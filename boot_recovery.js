/* BOOT RECOVERY — makes the published browser build reliably start on touch devices */
(()=>{
 const ready=()=>{
  try{
   if(typeof makeWorld==='function' && (typeof renderer==='undefined'||!renderer)) makeWorld();
  }catch(err){console.error('Gilgamesh world boot failed',err);return}
  const start=()=>{
   try{
    paused=false;
    const menu=document.getElementById('menu'),hud=document.getElementById('hud'),touch=document.getElementById('touch');
    if(menu)menu.classList.add('hidden');
    if(hud)hud.classList.remove('hidden');
    if(touch)touch.classList.toggle('hidden',!('ontouchstart' in window));
    if(typeof msg==='function')msg('WELCOME TO URUK');
   }catch(err){console.error('Gilgamesh start failed',err)}
  };
  const load=()=>{
   if(typeof loadGame==='function')loadGame();
   else start();
  };
  const bindButton=(id,fn)=>{const e=document.getElementById(id);if(e)e.onclick=fn};
  bindButton('start',start);bindButton('load',load);
  document.querySelectorAll('[data-key]').forEach(b=>{
   const k=(b.dataset.key||'').toLowerCase();
   b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true},{passive:false});
   const off=e=>{e.preventDefault();keys[k]=false};
   b.addEventListener('pointerup',off,{passive:false});b.addEventListener('pointercancel',off,{passive:false});b.addEventListener('pointerleave',off,{passive:false});
  });
  document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('pointerdown',e=>{
   e.preventDefault();const a=b.dataset.action;
   if(a==='attack'&&typeof attack==='function')attack();
   if(a==='dodge'&&typeof dodge==='function')dodge();
   if(a==='wrath'&&typeof royalWrath==='function')royalWrath();
   if(a==='block')block=true;
  },{passive:false}));
  document.querySelectorAll('[data-action="block"]').forEach(b=>b.addEventListener('pointerup',()=>block=false));
  let last=performance.now();
  const frame=now=>{
   const dt=Math.min(.05,(now-last)/1000);last=now;
   try{if(typeof update==='function')update(dt)}catch(err){console.error('Gilgamesh update failed',err)}
   try{if(typeof renderer!=='undefined'&&renderer&&typeof scene!=='undefined'&&scene&&typeof camera!=='undefined'&&camera)renderer.render(scene,camera)}catch(err){console.error('Gilgamesh render failed',err)}
   requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
 window.GilgameshBoot={start:ready};
})();
