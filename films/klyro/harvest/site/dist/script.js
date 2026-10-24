document.querySelectorAll('.motion').forEach(el=>el.addEventListener('mouseenter',()=>{document.querySelectorAll('.motion').forEach(m=>m.classList.remove('active'));el.classList.add('active')}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const scenes=[...document.querySelectorAll('[data-scroll-scene]')];
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let ticking=false;

function clamp(value,min,max){return Math.min(max,Math.max(min,value))}
function updateScrollStory(){
  ticking=false;
  if(reduceMotion.matches||window.innerWidth<=900){scenes.forEach(scene=>scene.removeAttribute('style'));return}
  const viewport=window.innerHeight;
  scenes.forEach(scene=>{
    const rect=scene.getBoundingClientRect();
    let distance=0;
    if(rect.top>viewport/2)distance=(rect.top-viewport/2)/viewport;
    else if(rect.bottom<viewport/2)distance=(rect.bottom-viewport/2)/viewport;
    const magnitude=Math.abs(distance);
    const opacity=clamp(1-(magnitude-.06)*2.35,0,1);
    const y=clamp(distance*260,-190,190);
    const blur=clamp((magnitude-.12)*4,0,2.5);
    scene.style.setProperty('--scene-opacity',opacity.toFixed(3));
    scene.style.setProperty('--scene-y',`${y.toFixed(1)}px`);
    scene.style.setProperty('--scene-blur',`${blur.toFixed(1)}px`);
  });
  const hero=document.querySelector('.hero-stage');
  if(hero){const rect=hero.getBoundingClientRect();const progress=clamp((viewport-rect.top)/(viewport+rect.height),0,1);hero.style.setProperty('--hero-tilt',`${(4-progress*8).toFixed(2)}deg`)}
  const principle=document.querySelector('.principle');
  if(principle){const rect=principle.getBoundingClientRect();const progress=clamp(1-(rect.top+rect.height/2-viewport/2)/viewport,0,1);principle.style.setProperty('--image-yaw',`${(-8+progress*16).toFixed(2)}deg`)}
}
function requestScrollStory(){if(!ticking){ticking=true;requestAnimationFrame(updateScrollStory)}}
window.addEventListener('scroll',requestScrollStory,{passive:true});
window.addEventListener('resize',requestScrollStory);
reduceMotion.addEventListener?.('change',requestScrollStory);
updateScrollStory();
const views={risk:{title:'Protect the renewal',confidence:'94% confidence',copy:'Usage dropped 38% after their champion changed roles. Re-engage the new owner before the renewal window.',signal:'Usage decline',decision:'Renewal risk',owner:'Jordan Miller',play:'Executive re-engagement',playCopy:'Create a tailored brief, notify the CSM, and schedule a check-in.'},expansion:{title:'Open the expansion path',confidence:'91% confidence',copy:'Three teams adopted advanced reporting this month. Buying intent is spreading beyond the original use case.',signal:'Feature adoption',decision:'Expansion intent',owner:'Maya Chen',play:'Multi-team expansion',playCopy:'Map new users, draft the value recap, and alert the account executive.'},handoff:{title:'Make the handoff seamless',confidence:'88% confidence',copy:'Implementation milestones are complete and the account is ready to transition into long-term success.',signal:'Milestone hit',decision:'Handoff ready',owner:'Alex Foster',play:'Success kickoff',playCopy:'Package key context, assign the CSM, and prepare the success plan.'}};

document.querySelectorAll('.signal').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.signal').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const v=views[btn.dataset.view];document.querySelector('#actionTitle').textContent=v.title;document.querySelector('#confidence').textContent=v.confidence;document.querySelector('#actionCopy').textContent=v.copy;document.querySelector('#flowSignal').textContent=v.signal;document.querySelector('#flowDecision').textContent=v.decision;document.querySelector('#flowOwner').textContent=v.owner;document.querySelector('#playTitle').textContent=v.play;document.querySelector('#playCopy').textContent=v.playCopy}));

