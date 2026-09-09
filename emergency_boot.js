/* EMERGENCY BOOT — capture-first startup for mobile browsers */
(()=>{
  let started=false, loopStarted=false;
  const showError=(err)=>{
    console.error('Gilgamesh boot error:',err);
    const m=document.getElementById('message');
    if(m){m.textContent='BOOT ERROR · '+(err&&err.message?err.message:String(err));m.style.opacity=1;m.style.whiteSpace='normal';m.style.maxWidth='90vw';}
  };
  const start=()=>{
    if(started)return;
    try{
      if(typeof makeWorld==='function' && (typeof renderer==='undefined'||!renderer)) makeWorld();
      if(typeof player==='undefined'||!player) throw new Error('Game world did not initialize');
      started=true; paused=false;
      const menu=document.getElementById('menu'),hud=document.getElementById('hud'),touch=document.getElementById('touch');
      if(menu)menu.classList.add('hidden');
      if(hud)hud.classList.remove('hidden');
      if(touch)touch.classList.toggle('hidden',!('ontouchstart' in window));
      if(typeof msg==='function')msg('WELCOME TO URUK');
      if(typeof renderHUD==='function')renderHUD();
      startLoop();
    }catch(err){showError(err)}
  };
  const load=()=>{
    try{
      if(typeof loadGame==='function') loadGame(); else start();
      startLoop();
    }catch(err){showError(err)}
  };
  const startLoop=()=>{
    if(loopStarted)return;
    loopStarted=true;
    let last=performance.now();
    const frame=(now)=>{
      const dt=Math.min(.05,(now-last)/1000);last=now;
      try{if(typeof update==='function')update(dt)}catch(err){showError(err)}
      try{if(typeof renderer!=='undefined'&&renderer&&typeof scene!=='undefined'&&scene&&typeof camera!=='undefined'&&camera)renderer.render(scene,camera)}catch(err){showError(err)}
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  const bind=()=>{
    document.addEventListener('click',e=>{
      const b=e.target.closest&&e.target.closest('#start,#load');
      if(!b)return;
      e.preventDefault();e.stopPropagation();
      if(b.id==='start')start();else load();
    },true);
    document.addEventListener('pointerup',e=>{
      const b=e.target.closest&&e.target.closest('#start,#load');
      if(!b)return;
      e.preventDefault();e.stopPropagation();
      if(b.id==='start')start();else load();
    },true);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
  window.GilgameshEmergencyBoot={start,load};
})();
