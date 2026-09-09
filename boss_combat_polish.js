/* BOSS COMBAT POLISH — readable phases, telegraphs, arena pressure, and victory beats */
(()=>{
 const T=THREE;
 const isBoss=e=>!!(e?.userData?.boss||e?.userData?.finalBoss||e?.userData?.chapter3Boss||e?.userData?.chapter4Boss||e?.userData?.chapter5Boss||e?.userData?.chapter6Boss);
 const names={'CHAMPION OF THE WEST':'WESTERN CHAMPION','AEGEAN CHAMPION':'AEGEAN CHAMPION','ORACLE WARDEN':'ORACLE WARDEN','KING OF THE LABYRINTH':'KING OF THE LABYRINTH','STORM HERALD':'STORM HERALD',"THE GODS' CHAMPION":"GODS' CHAMPION",'THE LAST JUDGE':'THE LAST JUDGE'};
 const rings=new WeakMap();
 function name(e){return e.userData.bossName||e.userData.name||names[e.userData.name]||'DIVINE CHAMPION'}
 function ring(e){if(rings.has(e))return rings.get(e);const m=new T.Mesh(new T.RingGeometry(1.1,1.35,32),new T.MeshBasicMaterial({color:0xe2b24f,transparent:true,opacity:.75,side:T.DoubleSide,depthTest:false}));m.rotation.x=-Math.PI/2;m.renderOrder=870;scene.add(m);rings.set(e,m);return m}
 function ensure(){let e=document.getElementById('bossCombatNotice');if(e)return e;e=document.createElement('div');e.id='bossCombatNotice';e.style.cssText='position:fixed;left:50%;bottom:18%;transform:translateX(-50%);padding:8px 16px;border:1px solid rgba(226,178,79,.55);background:rgba(18,12,9,.8);color:#f2d37c;font:700 12px Inter,sans-serif;letter-spacing:2px;opacity:0;transition:opacity .18s;pointer-events:none;z-index:40';document.body.appendChild(e);return e}
 function announce(text){const e=ensure();e.textContent=text;e.style.opacity='1';clearTimeout(announce.t);announce.t=setTimeout(()=>e.style.opacity='0',900)}
 function tick(){
  if(typeof enemies==='undefined'||typeof player==='undefined'||typeof state==='undefined')return;
  const now=performance.now();
  for(const e of enemies){
   if(!e||!e.visible||!e.userData||!isBoss(e))continue;
   const max=Number(e.userData.maxHp)||1,hp=Math.max(0,Number(e.userData.hp)||0),ratio=hp/max;
   const phase=Number(e.userData.phase)|| (ratio<=.34?3:ratio<=.67?2:1);
   if(!e.userData._polishPhase)e.userData._polishPhase=phase;
   if(phase!==e.userData._polishPhase){e.userData._polishPhase=phase;announce('PHASE '+phase+' · '+name(e));e.userData.cooldown=Math.max(Number(e.userData.cooldown)||0,1.0)}
   const r=ring(e),dist=e.position.distanceTo(player.position);
   r.position.set(e.position.x,.055,e.position.z);
   const wind=Number(e.userData.attackWind)||0;
   if(wind>0){e.userData.attackWind=Math.max(0,wind-.08);r.visible=true;r.scale.setScalar(1+.18*Math.sin(now/70));r.material.opacity=.35+.4*Math.abs(Math.sin(now/100))}
   else r.visible=false;
   /* Telegraph-only: chapter boss scripts remain the single authority for damage and defeat. */
   if(e.userData._polishWindActive&&wind<=0){e.userData._polishWindActive=false;announce('BOSS STRIKE · DODGE OR BLOCK')}
   if(dist<14&&(!e.userData.cooldown||e.userData.cooldown<=0)&&phase>=2&&!e.userData.attackWind){
    e.userData.attackWind=phase===3?.42:.62;e.userData.attackRange=phase===3?5.8:5;e.userData.attackDamage=phase===3?15:phase===2?12:10;e.userData.attackCooldown=phase===3?1.45:1.9;e.userData._polishWindActive=true;
   }
   if(hp<=0&&!e.userData._polishVictory){e.userData._polishVictory=true;r.visible=false;announce('CHAMPION DEFEATED');if(window.GilgameshAudio)GilgameshAudio.boss()}
  }
 }
 setInterval(()=>{try{tick()}catch(err){console.warn('boss polish',err)}},80);
 window.GilgameshBossPolish={refresh:tick};
})();
