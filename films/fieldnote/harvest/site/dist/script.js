const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('.step').forEach(step=>step.addEventListener('mouseenter',()=>{document.querySelectorAll('.step').forEach(s=>s.classList.remove('active'));step.classList.add('active')}));
