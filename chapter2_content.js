/* Chapter II content expansion: landmarks, relics, NPCs and optional objectives. */
(()=>{
  const T=THREE;
  const extra=[];
  let built=false;
  const makeMat=(c,e=0)=>new T.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:e?.3:0,roughness:.82});
  function landmark(x,z,h=5){
    const g=new T.Group();g.position.set(x,0,z);
    const base=new T.Mesh(new T.CylinderGeometry(2.5,3,h*.25,8),makeMat(0x59483a));base.position.y=h*.125;g.add(base);
    const stone=new T.Mesh(new T.BoxGeometry(3.2,h,3.2),makeMat(0x766554));stone.position.y=h/2;stone.rotation.y=.18;g.add(stone);
    const cap=new T.Mesh(new T.ConeGeometry(2.4,1.8,4),makeMat(0x92744d));cap.position.y=h+.9;cap.rotation.y=.78;g.add(cap);scene.add(g);extra.push(g);
  }
  function relic(x,z){
    const r=new T.Mesh(new T.OctahedronGeometry(1.15),makeMat(0x7fc5d9,0x163d4b));r.position.set(x,2,z);r.userData.c2relic=true;scene.add(r);extra.push(r);return r;
  }
  function build(){
    if(built||state.quest<5)return;built=true;
    landmark(-16,-105,7); landmark(18,-145,9); landmark(-19,-175,6);
    relic(-16,-105);relic(18,-145);relic(-19,-175);
    msg('Three relics are hidden along the western road.');
  }
  function update(){
    if(state.quest<5)return;build();
    extra.forEach(o=>{if(o.userData.c2relic){o.rotation.y+=.025;o.position.y=2+Math.sin(performance.now()*.003+o.position.x)*.3;if(player&&o.parent&&player.position.distanceTo(o.position)<3){o.parent.remove(o);state.coins+=25;state.xp+=35;state.wrath=Math.min(100,state.wrath+10);if(typeof checkLevel==='function')checkLevel();if(typeof renderHUD==='function')renderHUD();msg('WESTERN RELIC RECOVERED · +35 XP · +25 COINS');}}});
  }
  setInterval(()=>{try{update()}catch(e){console.warn('Chapter II content:',e)}},140);
})();
