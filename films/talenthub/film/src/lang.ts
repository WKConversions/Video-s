// on-screen language; the Dutch build sets this to "nl"
export const LANG = "en" as "en" | "nl";
export const tx = <V,>(en: V, nl: V): V => (LANG === "nl" ? nl : en);
