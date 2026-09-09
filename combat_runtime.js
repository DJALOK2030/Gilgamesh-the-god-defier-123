/* COMBAT RUNTIME — shared feedback, health bars, boss phases, and reward guards */
(()=>{
 const T=THREE;
 const tracked=new Map();
 let bannerTimer=0;
 const bossNames={
  'CHAMPION OF THE WEST':'CHAPTER I · CHAMPION OF THE WEST',
  'AEGEAN CHAMPION':'CHAPTER II · AEGEAN CHAMPION',
  'ORACLE WARDEN':'CHAPTER III · ORACLE WARDEN',
  'KING OF THE LABYRINTH':'CHAPTER IV · KING OF THE LABYRINTH',
  'STORM HERALD':'CHAPTER V · STORM HERALD',
  'THE GODS\' CHAMPION':'CHAPTER VI · THE GODS\' CHAMPION',
  'THE LAST JUDGE':'CHAPTER VII · THE LAST JUDGE'
 };
 function makeBar(e){
  const g=new T.Group();
  const bg=new T.Mesh(new T.PlaneGeometry(2.6,.16),new T.MeshBasicMaterial({color:0x241b18,transparent:true,opacity:.9,depthTest:false}));
  const fill=new T.Mesh(new T.PlaneGeometry(2.5,.11),new T.MeshBasicMaterial({color:0xb83b32,depthTest:false}));
  fill.position.z=.01;g.add(bg,fill);g.userData.fill=fill;g.renderOrder=900;scene.add(g);e.userData.combatBar=g;return g;
 }
 function removeBar(e){if(e.userData.combatBar){scene.remove(e.userData.combatBar);e.userData.combatBar=null}}
 function bossLabel(e){return e.userData.bossName||e.userData.name||'DIVINE CHAMPION'}
 function ensureBossHUD(e){
  let h=document.getElementById('combatBossHud');
  if(!h){h=document.createElement('div');h.id='combatBossHud';h.className='combat-boss-hud hidden';h.innerHTML='<div class="combat-boss-name"></div><div class="combat-boss-phase"></div><div class="combat-boss-track"><div class="combat-boss-fill"></div></div>';document.body.appendChild(h)}
  h.classList.remove('hidden');h.querySelector('.combat-boss-name').textContent=bossLabel(e);h.querySelector('.combat-boss-phase').textContent='PHASE '+(e.userData.phase||1);
  const pct=100*clamp((e.userData.hp||0)/(e.userData.maxHp||1),0,1);h.querySelector('.combat-boss-fill').style.width=pct+'%';
 }
 function hideBossHUD(){const h=document.getElementById('combatBossHud');if(h)h.classList.add('hidden')}
 function phaseBanner(e){
  const p=e.userData.phase||1,old=e.userData.lastCombatPhase||1;if(p===old)return;e.userData.lastCombatPhase=p;
  let b=document.getElementById('combatPhaseBanner');if(!b){b=document.createElement('div');b.id='combatPhaseBanner';b.className='combat-phase-banner';document.body.appendChild(b)}
  b.textContent='PHASE '+p+' · '+bossLabel(e);b.classList.add('show');clearTimeout(bannerTimer);bannerTimer=setTimeout(()=>b.classList.remove('show'),1800);
 }
 function flash(e){for(const c of e.children||[]){if(c.material&&c.material.color){c.userData.baseColor=c.userData.baseColor||c.material.color.getHex();c.material.color.setHex(0xffffff)}}setTimeout(()=>{for(const c of e.children||[]){if(c.material&&c.material.color&&c.userData.baseColor)c.material.color.setHex(c.userData.baseColor)}},90)}
 function tick(){
  if(typeof enemies==='undefined'||typeof scene==='undefined')return;
  const liveBoss=enemies.find(e=>e&&e.visible&&e.userData&&(e.userData.boss||e.userData.finalBoss||e.userData.chapter3Boss||e.userData.chapter4Boss||e.userData.chapter5Boss||e.userData.chapter6Boss));
  if(liveBoss){ensureBossHUD(liveBoss);phaseBanner(liveBoss)}else hideBossHUD();
  for(const e of enemies){if(!e||!e.userData)continue;const hp=Number(e.userData.hp);const max=Number(e.userData.maxHp||hp||1);if(!tracked.has(e)){tracked.set(e,{hp});if(!e.userData.boss&&!e.userData.finalBoss&&!e.userData.chapter3Boss&&!e.userData.chapter4Boss&&!e.userData.chapter5Boss&&!e.userData.chapter6Boss)makeBar(e)}const t=tracked.get(e);if(t&&hp<t.hp&&hp>0)flash(e);t.hp=hp;
   if(e.userData.combatBar){e.userData.combatBar.position.set(e.position.x,e.position.y+4.4,e.position.z);e.userData.combatBar.lookAt(camera.position);e.userData.combatBar.userData.fill.scale.x=clamp(hp/max,0,1)}
   if(hp<=0){removeBar(e);if(e.userData.boss||e.userData.finalBoss||e.userData.chapter3Boss||e.userData.chapter4Boss||e.userData.chapter5Boss||e.userData.chapter6Boss){e.userData.combatDefeated=true}}
  }
 }
 setInterval(tick,80);
 window.GilgameshCombat={refresh:tick,hideBossHUD};
})();
