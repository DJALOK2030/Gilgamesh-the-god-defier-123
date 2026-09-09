/* CHAPTER II BOSS — THE AEGEAN CHAMPION */
(()=>{
  const T=THREE; let spawned=false, boss=null, arena=null, intro=false;
  const M=(c,e=0)=>new T.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:e?.25:0,roughness:.7});
  function build(){
    if(spawned||state.quest<7)return; spawned=true;
    arena=new T.Group(); arena.position.set(0,0,-230); scene.add(arena);
    const floor=new T.Mesh(new T.CylinderGeometry(18,18,.5,32),M(0x4e443e)); floor.position.y=.1; arena.add(floor);
    for(let i=0;i<8;i++){const p=new T.Mesh(new T.CylinderGeometry(1.4,1.7,7,8),M(0x625448));p.position.set(Math.cos(i*Math.PI/4)*15,3.5,Math.sin(i*Math.PI/4)*15);arena.add(p)}
    boss=new T.Group(); boss.position.set(0,0,-230); boss.userData={hp:520,maxHp:520,phase:1,cooldown:0,dead:false,boss:true};
    const body=new T.Mesh(new T.CapsuleGeometry(1.7,3,5,12),M(0x3b4048));body.position.y=2.5;boss.add(body);
    const head=new T.Mesh(new T.SphereGeometry(1.25,16,10),M(0x8b7259));head.position.y=5.3;boss.add(head);
    const weapon=new T.Mesh(new T.BoxGeometry(.45,5,.45),M(0xb7a06d));weapon.position.set(2.2,2.8,0);weapon.rotation.z=-.3;boss.add(weapon);
    scene.add(boss); enemies.push(boss); msg('AEGEAN CHAMPION · ENTER THE ARENA');
  }
  function update(){
    if(state.quest<7)return; build(); if(!boss||boss.userData.dead)return;
    const d=player.position.distanceTo(boss.position); boss.userData.cooldown=Math.max(0,boss.userData.cooldown-.12);
    if(boss.userData.hp<boss.userData.maxHp*.5&&boss.userData.phase===1){boss.userData.phase=2;msg('PHASE II · THE CHAMPION ENRAGES');}
    if(d<15){boss.rotation.y=Math.atan2(player.position.x-boss.position.x,player.position.z-boss.position.z); if(d>4)boss.position.z+=Math.sign(player.position.z-boss.position.z)*.035; else if(boss.userData.cooldown===0){state.hp=Math.max(0,state.hp-9);boss.userData.cooldown=10;renderHUD()}}
    if(typeof boss.userData.hp==='number'&&boss.userData.hp<=0){boss.userData.dead=true;scene.remove(boss);state.xp+=350;state.quest=9;setQuest('Chapter II complete · The road to the divine frontier awaits.');checkLevel();renderHUD();msg('AEGEAN CHAMPION DEFEATED · +350 XP');}
  }
  setInterval(()=>{try{update()}catch(e){console.warn('C2 boss',e)}},120);
})();
