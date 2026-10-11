# Calls a tool of any configured MCP server from the command line, for a session that started before the server was
# added (Claude Code loads MCP servers only at session start) or for a script. Reads the servers from the repo's
# .mcp.json, then ~/.claude.json (user scope). stdio servers are started for the call; HTTP servers are called with
# streamable-HTTP JSON-RPC. See production/mcp-tools.md.
#   python3 mcp_call.py list                                  the servers it knows
#   python3 mcp_call.py tools <server>                        a server's tools with their input fields
#   python3 mcp_call.py call <server> <tool> '{"arg": 1}'     call a tool; prints the result's text (or JSON)
#   python3 mcp_call.py login <server> [scopes]               OAuth device login for a server that answers 401
#   [--timeout 600]
import json, os, subprocess, sys, urllib.parse, urllib.request, urllib.error

UA = "mcp_call/1"                                     # urllib's default agent is refused by some hosts (exa: 403)

HERE = os.path.dirname(os.path.abspath(__file__))

def servers():
    found = {}
    for p in [os.path.expanduser("~/.claude.json"), os.path.join(HERE, "..", "..", ".mcp.json"), os.path.join(os.getcwd(), ".mcp.json")]:
        try: d = json.load(open(p))
        except Exception: continue
        found.update(d.get("mcpServers", {}))
    return found

INIT = {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "mcp_call", "version": "1"}}}

def stdio(cfg, requests, timeout):
    env = {**os.environ, **cfg.get("env", {})}
    p = subprocess.Popen([cfg["command"], *cfg.get("args", [])], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, env=env)
    p.stdin.write(json.dumps(INIT) + "\n"); p.stdin.flush()
    want, out = {r["id"] for r in requests}, {}
    import threading
    timer = threading.Timer(timeout, p.kill); timer.start()
    try:
        for line in p.stdout:
            try: d = json.loads(line)
            except Exception: continue
            if d.get("id") == 1:
                p.stdin.write(json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}) + "\n")
                for r in requests: p.stdin.write(json.dumps(r) + "\n")
                p.stdin.flush()
            elif d.get("id") in want:
                out[d["id"]] = d
                if len(out) == len(want): break
    finally:
        timer.cancel(); p.kill()
    return out

def urlopen(req, timeout=60):
    """urlopen that retries a dropped connection (the session proxy sometimes answers 502), never an HTTP error."""
    import time
    for i in range(4):
        try: return urllib.request.urlopen(req, timeout=timeout)
        except urllib.error.HTTPError: raise
        except (urllib.error.URLError, OSError):
            if i == 3: raise
            time.sleep(2 ** i)

TOKENS = os.path.expanduser("~/.claude/mcp_tokens")    # OAuth tokens from `login`, outside the repo, mode 600

def token_file(url): return os.path.join(TOKENS, urllib.parse.quote(url, safe="") + ".json")

def token_for(url):
    try: return json.load(open(token_file(url)))["access_token"]
    except Exception: return None

def refresh(url):
    """Renews an expired access token with the kept refresh token; True when it worked."""
    try: t = json.load(open(token_file(url)))
    except Exception: return False
    if not t.get("refresh_token"): return False
    n = form(t["token_endpoint"], {"grant_type": "refresh_token", "refresh_token": t["refresh_token"], "client_id": t["client_id"]})
    if "access_token" not in n: return False
    t.update(n)
    with open(os.open(token_file(url), os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), "w") as o: json.dump(t, o)
    return True

def form(url, data):
    req = urllib.request.Request(url, data=urllib.parse.urlencode(data).encode(), headers={"Content-Type": "application/x-www-form-urlencoded", "User-Agent": UA}, method="POST")
    try:
        with urlopen(req) as r: return json.loads(r.read())
    except urllib.error.HTTPError as e: return json.loads(e.read() or b"{}")

def login(name, scopes):
    """OAuth device flow (RFC 8628) for an HTTP server that asks for authorization: prints a link for the person to
    approve in their own browser, waits, and keeps the token for later calls. Nothing is stored in the repo."""
    import time
    url = servers()[name]["url"]; u = urllib.parse.urlsplit(url); base = f"{u.scheme}://{u.netloc}"
    meta = json.loads(urlopen(urllib.request.Request(base + "/.well-known/oauth-authorization-server", headers={"User-Agent": UA})).read())
    reg = json.loads(urlopen(urllib.request.Request(meta["registration_endpoint"], data=json.dumps({"client_name": "Claude Code (mcp_call)", "grant_types": ["urn:ietf:params:oauth:grant-type:device_code", "refresh_token"], "token_endpoint_auth_method": "none", "redirect_uris": []}).encode(), headers={"Content-Type": "application/json", "User-Agent": UA}, method="POST")).read())
    dev = form(meta["device_authorization_endpoint"], {"client_id": reg["client_id"], "scope": scopes, "resource": url})
    print("Approve at:", dev.get("verification_uri_complete") or f'{dev["verification_uri"]}  code {dev["user_code"]}', flush=True)
    wait = dev.get("interval", 5)
    while True:
        time.sleep(wait)
        t = form(meta["token_endpoint"], {"grant_type": "urn:ietf:params:oauth:grant-type:device_code", "device_code": dev["device_code"], "client_id": reg["client_id"]})
        if "access_token" in t: break
        if t.get("error") == "slow_down": wait += 5
        elif t.get("error") != "authorization_pending": sys.exit(f"login failed: {t}")
    os.makedirs(TOKENS, exist_ok=True)
    f = os.path.join(TOKENS, urllib.parse.quote(url, safe="") + ".json")
    with open(os.open(f, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), "w") as o: json.dump({**t, "client_id": reg["client_id"], "token_endpoint": meta["token_endpoint"]}, o)
    print("logged in; token kept in", f)

def http(cfg, requests, timeout):
    try: return http_once(cfg, requests, timeout)
    except urllib.error.HTTPError as e:
        if e.code == 401 and refresh(cfg["url"]): return http_once(cfg, requests, timeout)
        if e.code == 401: sys.exit(f"{cfg['url']} needs a sign-in: python3 mcp_call.py login <server>")
        raise

def http_once(cfg, requests, timeout):
    tok = token_for(cfg["url"])
    url, headers, sid = cfg["url"], {**({"Authorization": f"Bearer {tok}"} if tok else {}), "Content-Type": "application/json", "Accept": "application/json, text/event-stream", "User-Agent": UA, **cfg.get("headers", {})}, None
    def post(msg):
        nonlocal sid
        h = dict(headers)
        if sid: h["Mcp-Session-Id"] = sid
        req = urllib.request.Request(url, data=json.dumps(msg).encode(), headers=h, method="POST")
        with urlopen(req, timeout) as r:
            sid = r.headers.get("Mcp-Session-Id") or sid
            body = r.read().decode()
        if not body.strip(): return None
        if body.lstrip().startswith("{"): return json.loads(body)
        for line in body.splitlines():                      # server-sent events: the data lines
            if line.startswith("data:"):
                try:
                    d = json.loads(line[5:])
                    if "id" in d: return d
                except Exception: pass
        return None
    post(INIT); post({"jsonrpc": "2.0", "method": "notifications/initialized"})
    return {r["id"]: post(r) for r in requests}

def run(name, requests, timeout):
    cfg = servers().get(name)
    if not cfg: sys.exit(f"no MCP server named {name}; known: {', '.join(servers())}")
    return (http if cfg.get("type") == "http" or "url" in cfg else stdio)(cfg, requests, timeout)

def main():
    a = sys.argv[1:]; timeout = 600
    if "--timeout" in a: i = a.index("--timeout"); timeout = float(a[i + 1]); del a[i:i + 2]
    if not a or a[0] == "list":
        for n, c in servers().items(): print(f"{n}: {c.get('url') or ' '.join([c.get('command', '')] + c.get('args', []))}")
        return
    if a[0] == "login":                                    # login <server> [scopes]
        login(a[1], a[2] if len(a) > 2 else "openid email mcp"); return
    if a[0] == "tools":
        r = run(a[1], [{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}], timeout).get(2, {})
        for t in r.get("result", {}).get("tools", []):
            props = t.get("inputSchema", {}).get("properties", {})
            print(f"- {t['name']}({', '.join(props)}): {(t.get('description') or '').strip().splitlines()[0][:160] if t.get('description') else ''}")
        return
    if a[0] == "call":
        args = json.loads(a[3]) if len(a) > 3 else {}
        r = run(a[1], [{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": a[2], "arguments": args}}], timeout).get(2)
        if not r: sys.exit("no answer (timed out)")
        if "error" in r: sys.exit(json.dumps(r["error"]))
        for c in r["result"].get("content", []):
            print(c.get("text") if c.get("type") == "text" else json.dumps(c)[:400])
        return
    sys.exit(__doc__ if False else "usage: mcp_call.py list | login <server> | tools <server> | call <server> <tool> '<json args>'")

if __name__ == "__main__":
    main()
