/* WORLD OBJECTIVES — persistent waypoint marker + contextual interaction prompts */
(()=>{
 const T=THREE;
 const points={
  0:{name:'GREAT GATE',x:0,z:-57},1:{name:'GREAT GATE',x:0,z:-57},2:{name:'ROYAL COURT · MESSENGER',x:0,z:5},
  3:{name:'WESTERN ROAD',x:0,z:-105},4:{name:'WESTERN ROAD',x:0,z:-125},5:{name:'GREEK CAMP',x:0,z:-205},6:{name:'WESTERN ENVOY',x:10,z:-195},
  7:{name:'AEGEAN CHAMPION',x:0,z:-230},8:{name:'AEGEAN CHAMPION',x:0,z:-230},9:{name:'SEA OF SIGNS',x:0,z:-340},10:{name:'COASTAL TEMPLE',x:0,z:-340},
  11:{name:'ORACLE WARDEN',x:0,z:-382},12:{name:'ORACLE WARDEN',x:0,z:-382},15:{name:'SUNKEN CITADEL',x:0,z:-442},16:{name:'CITADEL GUARDIANS',x:0,z:-450},
  17:{name:'KING OF THE LABYRINTH',x:0,z:-472},20:{name:'STORMBOUND HIGHLANDS',x:0,z:-600},21:{name:'THUNDER RELIC',x:0,z:-590},22:{name:'STORM HERALD',x:0,z:-625},
  24:{name:'FIELDS BEYOND THE GODS',x:0,z:-750},25:{name:'FIVE SIGNS',x:0,z:-750},26:{name:'DIVINE THRESHOLD',x:0,z:-770},27:{name:'GODS’ CHAMPION',x:0,z:-805},28:{name:'GODS’ CHAMPION',x:0,z:-805},
  30:{name:'THE LAST GATE',x:0,z:-905},31:{name:'FINAL JUDGMENT',x:0,z:-925},32:{name:'THE LAST JUDGE',x:0,z:-965}
 };
 let marker=null,ring=null,lastQuest=-1;
 function ensureUI(){
  if(document.getElementById('objectiveRuntime'))return;
  const el=document.createElement('div');el.id='objectiveRuntime';el.style.cssText='position:fixed;left:50%;top:16%;transform:translateX(-50%);z-index:8;padding:7px 13px;border:1px solid rgba(215,187,98,.55);border-radius:999px;background:rgba(12,10,8,.72);color:#ead49a;font:600 12px Inter,Arial,sans-serif;letter-spacing:1.4px;pointer-events:none;opacity:0;transition:opacity .2s';document.body.appendChild(el);
 }
 function rebuild(q){
  if(!scene||!player)return;
  if(marker){scene.remove(marker);marker=null}if(ring){scene.remove(ring);ring=null}
  const p=points[q];if(!p)return;
  marker=new T.Group();marker.position.set(p.x,0,p.z);
  const beam=new T.Mesh(new T.CylinderGeometry(.09,.09,7,8),new T.MeshBasicMaterial({color:0xd7bb62,transparent:true,opacity:.55}));beam.position.y=3.5;marker.add(beam);
  const crown=new T.Mesh(new T.OctahedronGeometry(.65),new T.MeshStandardMaterial({color:0xd7bb62,emissive:0x6a5015,emissiveIntensity:.9,metalness:.35}));crown.position.y=7.1;marker.add(crown);scene.add(marker);
  ring=new T.Mesh(new T.RingGeometry(2.2,2.5,32),new T.MeshBasicMaterial({color:0xd7bb62,transparent:true,opacity:.35,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(p.x,.08,p.z);scene.add(ring);
  ensureUI();const ui=document.getElementById('objectiveRuntime');ui.textContent='OBJECTIVE · '+p.name;ui.style.opacity='1';
 }
 function tick(){
  if(typeof state==='undefined'||typeof player==='undefined'||!scene)return;
  const q=Number(state.quest)||0;if(q!==lastQuest){lastQuest=q;rebuild(q)}
  if(marker){marker.children[0].rotation.y+=.015;marker.children[1].rotation.y+=.025;marker.children[1].position.y=7.1+Math.sin(performance.now()*.003)*.35}
  if(ring)ring.rotation.z+=.008;
  const p=points[q],ui=document.getElementById('objectiveRuntime');if(p&&ui){const d=Math.hypot(player.position.x-p.x,player.position.z-p.z);ui.textContent=d<6?'OBJECTIVE · '+p.name+' · NEARBY':'OBJECTIVE · '+p.name+' · '+Math.round(d)+'m'}
 }
 setInterval(tick,50);window.GilgameshObjectives={points,rebuild};
})();
