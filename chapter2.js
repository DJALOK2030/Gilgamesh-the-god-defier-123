/* CHAPTER II — THE ROAD BEYOND URUK
   Additive world layer. Loaded after game.js and boss.js. */
(()=>{
  const T=THREE;
  let chapter2Built=false;
  const c2={active:false,gate:null,marker:null,greekCamp:null,foes:[],npcs:[],phase:0};
  const mat=(color,emissive=0)=>new T.MeshStandardMaterial({color,emissive,emissiveIntensity:emissive?0.35:0,roughness:.8});
  const add=(o)=>scene.add(o);
  function beam(x,z,label){
    const g=new T.Group(); g.position.set(x,.15,z);
    const ring=new T.Mesh(new T.TorusGeometry(2.2,.12,10,32),mat(0xd7ad55,0x4a2b00)); ring.rotation.x=Math.PI/2; g.add(ring);
    const p=new T.Mesh(new T.CylinderGeometry(.07,.07,5,8),mat(0xe8c66a,0x6b4200)); p.position.y=2.5; g.add(p);
    g.userData.label=label; add(g); return g;
  }
  function build(){
    if(chapter2Built)return; chapter2Built=true;
    // Western road terrain
    const road=new T.Mesh(new T.PlaneGeometry(70,180),mat(0x765d43)); road.rotation.x=-Math.PI/2; road.position.set(0,-.03,-120); add(road);
    for(let i=-2;i<=2;i++){
      const dune=new T.Mesh(new T.ConeGeometry(8,4,8),mat(0x96744e)); dune.position.set(i*13,2,-85-Math.abs(i)*10); dune.scale.z=1.7; add(dune);
    }
    c2.greekCamp=new T.Group(); c2.greekCamp.position.set(0,0,-205); add(c2.greekCamp);
    for(let i=-2;i<=2;i++){
      const tent=new T.Mesh(new T.ConeGeometry(4,6,4),mat(0x8c7562)); tent.position.set(i*8,3,0); tent.rotation.y=Math.PI/4; c2.greekCamp.add(tent);
    }
    const fire=new T.Mesh(new T.CylinderGeometry(.8,1,1.5,8),mat(0xd98d3a,0x7a2600)); fire.position.set(0,.7,0); c2.greekCamp.add(fire);
    c2.marker=beam(0,-205,'WESTERN CAMP');
    const m=new T.Mesh(new T.CylinderGeometry(.7,.7,3,8),mat(0x8f704f)); m.position.set(10,1.5,-195); add(m); c2.npcs.push(m);
    c2.active=true;
    msg('CHAPTER II UNLOCKED · Follow the western road.');
  }
  function spawnFoes(){
    if(c2.foes.length)return;
    for(let i=0;i<4;i++){
      const g=new T.Group(); g.position.set((i%2?1:-1)*(7+i*2),0,-125-i*9);
      const body=new T.Mesh(new T.CapsuleGeometry(1,2,4,8),mat(0x30313a)); body.position.y=2; g.add(body);
      const head=new T.Mesh(new T.SphereGeometry(.8,12,8),mat(0x6b5747)); head.position.y=4.1; g.add(head);
      g.userData={hp:70,maxHp:70,attackCooldown:0,isChapter2:true}; add(g); enemies.push(g); c2.foes.push(g);
    }
  }
  function activate(){
    if(state.quest!==4 || c2.active)return;
    build(); spawnFoes(); state.quest=5;
    if(typeof setQuest==='function')setQuest('Chapter II · Cross the western road and reach the Greek camp.');
  }
  function update(){
    if(state.quest===4 && !c2.active)activate();
    if(!c2.active)return;
    if(c2.marker){c2.marker.rotation.y+=.02; c2.marker.position.y=.15+Math.sin(performance.now()*.003)*.15;}
    if(state.quest===5 && player && player.position.z<-190){
      state.quest=6;
      if(typeof setQuest==='function')setQuest('Chapter II · Speak with the western envoy.');
      msg('The western camp is near. Press E to speak.');
    }
    if(state.quest===6 && player && player.position.distanceTo(new T.Vector3(10,0,-195))<5){
      state.quest=7;
      if(typeof setQuest==='function')setQuest('Chapter II · The envoy reveals a path toward the gods.');
      state.xp+=120; if(typeof checkLevel==='function')checkLevel(); if(typeof renderHUD==='function')renderHUD();
      msg('THE WESTERN ENVOY · A new path opens beyond the desert.');
    }
    if(state.quest===7 && c2.foes.length && c2.foes.every(f=>!f.parent)){
      state.quest=8;
      if(typeof setQuest==='function')setQuest('Chapter II complete · The road to the divine frontier awaits.');
      state.xp+=180; if(typeof checkLevel==='function')checkLevel(); if(typeof renderHUD==='function')renderHUD();
      msg('CHAPTER II COMPLETE');
    }
  }
  window.addEventListener('keydown',e=>{
    if(e.key.toLowerCase()==='e' && state.quest===6 && player && player.position.distanceTo(new T.Vector3(10,0,-195))<6){
      state.quest=7; if(typeof setQuest==='function')setQuest('Chapter II · The envoy reveals a path toward the gods.'); state.xp+=120; if(typeof checkLevel==='function')checkLevel(); if(typeof renderHUD==='function')renderHUD(); msg('THE ENVOY: Your defiance has drawn the gaze of powers beyond the sea.');
    }
  });
  const oldRender=window.renderHUD;
  const tick=()=>{try{update()}catch(err){console.warn('Chapter II:',err)}};
  setInterval(tick,120);
  const oldSave=window.saveGame;
  window.addEventListener('beforeunload',()=>{try{localStorage.setItem('gilgameshChapter2',JSON.stringify({quest:state.quest}))}catch(e){}});
})();
