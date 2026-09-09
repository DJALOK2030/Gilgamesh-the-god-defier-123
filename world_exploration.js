/* WORLD EXPLORATION — chapter atmosphere, discoverable secrets, landmarks, and ambient NPC motion */
(()=>{
 const T=THREE;
 const KEY='gilgamesh-world-secrets';
 const secrets=[
  {id:'uruk-tablet',x:-24,z:-18,label:'LOST TABLET',min:0,reward:55},
  {id:'gate-cache',x:26,z:-64,label:'ROYAL CACHE',min:1,reward:70},
  {id:'western-obelisk',x:-24,z:-132,label:'WESTERN SIGIL',min:5,reward:90},
  {id:'aegean-vault',x:23,z:-205,label:'AEGEAN RELIC',min:8,reward:110}
 ];
 let found=[];try{found=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){found=[]}
 const meshes=new Map(),npcBase=new WeakMap();
 function save(){localStorage.setItem(KEY,JSON.stringify(found))}
 function addSecret(s){
  if(found.includes(s.id)||state.quest<s.min)return;
  const g=new T.Group();
  const base=new T.Mesh(new T.CylinderGeometry(.8,.95,.22,8),new T.MeshStandardMaterial({color:0x6d4b28,roughness:.9}));base.position.y=.12;g.add(base);
  const glow=new T.Mesh(new T.OctahedronGeometry(.38),new T.MeshBasicMaterial({color:0xe2b24f,transparent:true,opacity:.8}));glow.position.y=.7;g.add(glow);
  g.position.set(s.x,.02,s.z);scene.add(g);meshes.set(s.id,g);
 }
 function announce(text){if(typeof msg==='function')msg(text)}
 function collect(s,g){found.push(s.id);save();state.coins=(Number(state.coins)||0)+25;state.xp=(Number(state.xp)||0)+s.reward;state.wrath=Math.min(100,(Number(state.wrath)||0)+12);if(typeof checkLevel==='function')checkLevel();if(typeof updateHUD==='function')updateHUD();g.visible=false;announce('SECRET FOUND · '+s.label+' · +'+s.reward+' XP');}
 function atmosphere(){
  if(!scene||!camera)return;
  const q=Number(state.quest)||0;
  scene.fog=new T.FogExp2(q>=20?0x1d2430:q>=9?0x28313b:0x241b15,q>=20?.006:q>=9?.0045:.0032);
  if(scene.background&&scene.background.isColor){scene.background.set(q>=20?0x111923:q>=9?0x171b20:0x17120d)}else scene.background=new T.Color(q>=20?0x111923:q>=9?0x171b20:0x17120d);
 }
 function animateNPCs(){
  if(typeof npcs==='undefined')return;
  for(const n of npcs){
   if(!n||!n.visible)continue;
   const name=n.userData?.name||'';
   if(!npcBase.has(n))npcBase.set(n,{x:n.position.x,z:n.position.z,phase:Math.random()*Math.PI*2});
   const b=npcBase.get(n),t=performance.now()/1000;
   if(name==='Citizen'){
    n.position.x=b.x+Math.sin(t*.35+b.phase)*.8;
    n.position.z=b.z+Math.cos(t*.3+b.phase)*.45;
    n.rotation.y+=Math.sin(t*.5+b.phase)*.002;
   }else if(name==='Western Envoy'){
    n.position.y=.02+Math.sin(t*1.6)*.025;
   }
  }
 }
 function update(){
  if(typeof state==='undefined'||typeof scene==='undefined')return;
  atmosphere();
  for(const s of secrets){
   if(state.quest>=s.min&&!found.includes(s.id)&&!meshes.has(s.id))addSecret(s);
   const g=meshes.get(s.id);if(!g||!g.visible)continue;
   g.children[1].rotation.y+=.035;
   g.children[1].position.y=.7+Math.sin(performance.now()/260+s.x)*.12;
   const d=player.position.distanceTo(g.position);
   if(d<3)collect(s,g);
  }
  animateNPCs();
 }
 setInterval(()=>{try{update()}catch(err){console.warn('world exploration',err)}},120);
 window.GilgameshWorld={refresh:update,resetSecrets:()=>{found=[];save()}};
})();
