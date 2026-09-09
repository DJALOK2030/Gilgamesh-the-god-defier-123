/* GILGAMESH SAFE LOADER — nothing from the game is executed until Start is pressed. */
(()=>{
 const scripts=['https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.min.js','game.js','boss.js','chapter2.js','chapter2_content.js','chapter2_boss.js','chapter3.js','chapter3_boss.js','chapter4.js','chapter4_boss.js','chapter5.js','chapter5_boss.js','chapter6.js','chapter6_boss.js','chapter7.js','chapter7_boss.js','boss_combat_guard.js','combat_feel.js','combat_ai.js','boss_combat_polish.js','camera_runtime.js','equipment.js','inventory.js','equipment_runtime.js','chapter2_travel_fix.js','world_exploration.js','objective_runtime.js','interaction_runtime.js','quest_cinematics.js','side_quests.js','achievements.js','campaign.js','audio.js','trial.js','hall_of_heroes.js','save_system.js','campaign_runtime.js','boot_recovery.js'];
 let running=false, loaded=0;
 const status=t=>{const e=document.getElementById('loading');if(e)e.textContent=t};
 const fail=e=>{status('GAME ERROR · '+(e&&e.message?e.message:String(e))+' · Refresh and try again');console.error(e)};
 const hideMenu=()=>{const m=document.getElementById('menu'),h=document.getElementById('hud'),t=document.getElementById('touch');if(m)m.classList.add('hidden');if(h)h.classList.remove('hidden');if(t)t.classList.toggle('hidden',!('ontouchstart'in window));const l=document.getElementById('loading');if(l)l.style.display='none';};
 const loadNext=()=>{
   if(loaded>=scripts.length){
     try{
       if(typeof makeWorld==='function'&&(!renderer))makeWorld();
       if(typeof player==='undefined'||!player)throw new Error('Game world did not initialize');
       paused=false;hideMenu();if(typeof renderHUD==='function')renderHUD();
       if(typeof msg==='function')msg('WELCOME TO URUK');
     }catch(e){fail(e)}
     return;
   }
   const s=document.createElement('script');s.src=scripts[loaded++];s.async=false;
   s.onload=loadNext;s.onerror=()=>fail(new Error('Could not load '+s.src));
   document.body.appendChild(s);
 };
 window.GilgameshStart=()=>{
   if(running)return;running=true;status('AWAKENING THE CHRONICLE…');
   document.documentElement.classList.add('game-started');
   loadNext();
 };
 window.GilgameshLoad=()=>{window.GilgameshStart();};
})();
