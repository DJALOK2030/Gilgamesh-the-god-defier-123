/* COMBAT FEEL — timing, invulnerability, hit reactions, counters, and safe rewards */
(()=>{
 const T=THREE;
 let lastAttack=0;
 const originalAttack=window.attack;
 const originalDodge=window.dodge;
 const originalRoyal=window.royalWrath;
 const flashers=new WeakMap();
 const sparks=[];
 function now(){return performance.now();}
 function markHit(e,damage){
  e.userData.hp=Math.max(0,(Number(e.userData.hp)||0)-damage);
  e.userData.hitUntil=now()+140;
  e.userData.hitFlash=1;
  const p=e.position.clone();p.y+=2.2;
  const g=new T.Mesh(new T.SphereGeometry(.09,6,6),new T.MeshBasicMaterial({color:0xf2d37c}));g.position.copy(p);scene.add(g);sparks.push({g,t:0});
 }
 function rewardSafe(e){
  if(!e||e.userData.rewarded)return false;
  if(e.userData.boss||e.userData.finalBoss||e.userData.chapter3Boss||e.userData.chapter4Boss||e.userData.chapter5Boss||e.userData.chapter6Boss)return false;
  if(e.userData.hp>0)return false;
  e.userData.rewarded=true;
  e.visible=false;
  state.kills++;
  const gain=35+state.skills.royal*10;
  state.xp+=gain;state.wrath=Math.min(100,state.wrath+14);
  if(window.GilgameshInventory?.grantRandom)window.GilgameshInventory.grantRandom();
  msg('FOE DEFEATED · XP +'+gain);
  if(typeof checkLevel==='function')checkLevel();
  if(state.kills>=2&&state.quest<1){state.quest=1;setQuest('Reach the Great Gate. Two foes have fallen.')}
  return true;
 }
 window.GilgameshCombat={
  damageEnemy(e,damage){if(!e||e.userData.hp<=0)return false;markHit(e,damage);return rewardSafe(e)},
  damagePlayer(damage){
   if(state._invulnerableUntil&&now()<state._invulnerableUntil)return false;
   const reduced=block?Math.max(1,damage*.35):damage;
   state.hp=Math.max(0,state.hp-reduced);
   state._invulnerableUntil=now()+450;
   msg(block?'BLOCK · DAMAGE REDUCED':'GILGAMESH HIT · HP -'+Math.ceil(reduced));
   if(state.hp<=0){state.hp=state.maxHp;player.position.set(0,0,35);msg('THE CHRONICLE RESTORES YOU')}
   return true;
  },
  counter(){state.wrath=Math.min(100,state.wrath+12+state.skills.will*2);msg('PERFECT GUARD · ROYAL WRATH +'+(12+state.skills.will*2))}
 };
 // Replace attack with a deterministic hit window while preserving the existing combo system.
 window.attack=function(){
  if(paused||dialogueOpen||attackTimer>0||dodgeTimer>0)return;
  const t=now();if(t-lastAttack<110)return;lastAttack=t;
  combo=comboWindow>0?combo%3+1:1;comboWindow=.75;attackTimer=.34;blade.visible=true;
  state.wrath=Math.min(100,state.wrath+7+state.skills.will*2);
  const damage=18+state.skills.might*7+combo*4+(window.GilgameshEquipmentRuntime?.stats?.().weapon||0);
  for(const e of enemies){if(e.userData.hp>0&&!e.userData.boss&&!e.userData.finalBoss&&!e.userData.chapter3Boss&&!e.userData.chapter4Boss&&!e.userData.chapter5Boss&&!e.userData.chapter6Boss&&e.position.distanceTo(player.position)<4.5)window.GilgameshCombat.damageEnemy(e,damage)}
  // Custom bosses receive damage directly so their own phase/death scripts remain authoritative.
  for(const e of enemies){if(e.userData.hp>0&&(e.userData.boss||e.userData.finalBoss||e.userData.chapter3Boss||e.userData.chapter4Boss||e.userData.chapter5Boss||e.userData.chapter6Boss)&&e.position.distanceTo(player.position)<5)window.GilgameshCombat.damageEnemy(e,damage)}
  msg('ROYAL STRIKE · COMBO '+combo);
 };
 window.dodge=function(){
  if(paused||dialogueOpen||dodgeTimer>0)return;
  dodgeTimer=.5;state._invulnerableUntil=now()+560;
  const d=moveInput();if(d.lengthSq()===0)d.set(0,0,-1);d.normalize();player.position.addScaledVector(d,7+state.skills.agility*1.2);
  msg('STORM STEP · INVULNERABLE');
 };
 window.royalWrath=function(){
  if(paused||dialogueOpen)return;
  if(state.wrath<100){msg('ROYAL WRATH IS NOT READY');return}
  state.wrath=0;msg('ROYAL WRATH · THE KING DEFIES');
  for(const e of enemies){if(e.userData.hp>0&&e.position.distanceTo(player.position)<10)window.GilgameshCombat.damageEnemy(e,99999)}
 };
 function animate(){
  const t=now();
  for(const e of enemies){if(!e||!e.userData)continue;if(e.userData.hitUntil&&t<e.userData.hitUntil){e.scale.setScalar(1.07)}else e.scale.lerp(new T.Vector3(1,1,1),.25)}
  for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.t+=.045;s.g.position.y+=.035;s.g.scale.setScalar(Math.max(0,1-s.t));if(s.t>=1){scene.remove(s.g);s.g.geometry.dispose();s.g.material.dispose();sparks.splice(i,1)}}
  requestAnimationFrame(animate);
 }
 requestAnimationFrame(animate);
 // Patch the legacy damage path used by ordinary enemies without touching custom boss AI.
 const legacyDefeat=window.defeat;
 if(typeof legacyDefeat==='function')window.defeat=function(e){if(e?.userData?.boss||e?.userData?.finalBoss||e?.userData?.chapter3Boss||e?.userData?.chapter4Boss||e?.userData?.chapter5Boss||e?.userData?.chapter6Boss)return;return window.GilgameshCombat.damageEnemy(e,0)};
})();
