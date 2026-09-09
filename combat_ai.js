/* COMBAT AI — readable enemy archetypes, attack telegraphs, spacing, and recovery */
(()=>{
 const T=THREE;
 const boss=e=>!!(e?.userData?.boss||e?.userData?.finalBoss||e?.userData?.chapter3Boss||e?.userData?.chapter4Boss||e?.userData?.chapter5Boss||e?.userData?.chapter6Boss);
 const roles=['chaser','skirmisher','brute'];
 const settings={
  chaser:{speed:2.35,range:3.1,damage:8,cool:1.35,windup:.55},
  skirmisher:{speed:1.9,range:3.5,damage:7,cool:1.7,windup:.8},
  brute:{speed:1.45,range:3.8,damage:12,cool:2.0,windup:1.0}
 };
 const rings=new WeakMap();
 function roleFor(e){
  if(e.userData.aiRole)return e.userData.aiRole;
  const n=enemies.indexOf(e);
  e.userData.aiRole=roles[Math.abs(n)%roles.length];
  return e.userData.aiRole;
 }
 function ringFor(e){
  if(rings.has(e))return rings.get(e);
  const r=new T.Mesh(new T.RingGeometry(.55,1,32),new T.MeshBasicMaterial({color:0xd7a84c,transparent:true,opacity:.75,side:T.DoubleSide,depthTest:false}));
  r.rotation.x=-Math.PI/2;r.position.y=.04;r.renderOrder=850;r.visible=false;scene.add(r);rings.set(e,r);return r;
 }
 function telegraph(e,active){
  const r=ringFor(e);r.visible=active;r.position.set(e.position.x,.045,e.position.z);
  if(active){r.scale.setScalar(1.15);r.material.opacity=.45+.35*Math.abs(Math.sin(performance.now()/90))}
 }
 function hit(e,s){
  if(typeof window.GilgameshCombat?.damagePlayer==='function')window.GilgameshCombat.damagePlayer(s.damage);
  else if(typeof state!=='undefined')state.hp=Math.max(0,state.hp-s.damage);
  e.userData.cooldown=s.cool;e.userData.attackAt=0;
 }
 function ai(dt){
  if(typeof enemies==='undefined'||typeof player==='undefined'||typeof state==='undefined'||paused)return;
  for(const e of enemies){
   if(!e||!e.visible||!e.userData||e.userData.hp<=0||boss(e))continue;
   const role=roleFor(e),s=settings[role];
   e.userData.cooldown=Math.max(0,(Number(e.userData.cooldown)||0)-dt);
   const previousAttack=Number(e.userData.attackAt)||0;
   e.userData.attackAt=Math.max(0,previousAttack-dt);
   const d=e.position.distanceTo(player.position);
   if(d>=16){telegraph(e,false);continue}
   const dir=player.position.clone().sub(e.position);dir.y=0;
   if(dir.lengthSq()>0)dir.normalize();
   e.lookAt(player.position.x,e.position.y,player.position.z);
   if(previousAttack>0){
    telegraph(e,true);
    if(e.userData.attackAt===0)hit(e,s);
    continue;
   }
   telegraph(e,false);
   if(role==='skirmisher'){
    if(d>8)e.position.addScaledVector(dir,dt*s.speed);
    else if(d<5)e.position.addScaledVector(dir,-dt*s.speed*1.15);
    else e.position.addScaledVector(new T.Vector3(-dir.z,0,dir.x),dt*s.speed*.7);
   }else if(d>s.range)e.position.addScaledVector(dir,dt*s.speed);
   if(d<=s.range&&e.userData.cooldown<=0){e.userData.attackAt=s.windup;telegraph(e,true)}
  }
 }
 window.updateEnemies=ai;
 window.GilgameshCombatAI={refresh:()=>ai(.016),roleFor};
})();
