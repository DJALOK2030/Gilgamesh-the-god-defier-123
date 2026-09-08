const T=THREE;
let scene,camera,renderer,clock,player,blade,attackTimer=0,dodgeTimer=0,block=false,paused=true,worldTime=0;
const keys={},enemies=[],relics=[];
const state={hp:100,maxHp:100,xp:0,level:1,wrath:0,quest:0,kills:0,coins:0,skills:{might:0,guard:0,agility:0,will:0,royal:0},relic:false};
const skillInfo={might:['MIGHT','Increase attack power.'],guard:['STONE GUARD','Increase maximum HP.'],agility:['STORM STEP','Longer dodge window.'],will:['DEFIER WILL','Increase Royal Wrath gain.'],royal:['ROYAL COMMAND','Increase XP from foes.']};
const $=id=>document.getElementById(id); const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function msg(text){const m=$('message');m.textContent=text;m.style.opacity=1;clearTimeout(msg.t);msg.t=setTimeout(()=>m.style.opacity=0,2200)}
function mat(c){return new T.MeshStandardMaterial({color:c,roughness:.85,metalness:.05})}
function box(x,y,z,c){const m=new T.Mesh(new T.BoxGeometry(x,y,z),mat(c));m.castShadow=m.receiveShadow=true;return m}
function makeWorld(){
 scene=new T.Scene();scene.background=new T.Color(0xb58a55);scene.fog=new T.Fog(0xb58a55,45,180);
 camera=new T.PerspectiveCamera(60,innerWidth/innerHeight,.1,300);
 renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;document.body.prepend(renderer.domElement);
 const hemi=new T.HemisphereLight(0xffe0a3,0x3b2c20,2.2);scene.add(hemi);const sun=new T.DirectionalLight(0xffd89a,3.4);sun.position.set(40,70,20);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
 const ground=new T.Mesh(new T.PlaneGeometry(220,220),mat(0x8b693f));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
 // Uruk walls and towers
 for(let x=-80;x<=80;x+=20){for(let z of [-58,58]){const w=box(18,10,4,0xb28b55);w.position.set(x,5,z);scene.add(w)}}
 for(let z=-40;z<=40;z+=20){for(let x of [-88,88]){const w=box(4,10,18,0xb28b55);w.position.set(x,5,z);scene.add(w)}}
 for(let x of [-70,-35,0,35,70]){const t=box(8,24,8,0xc09a5d);t.position.set(x,12,-56);scene.add(t)}
 // city blocks, market stalls and pillars
 for(let i=0;i<34;i++){const a=i*2.399,r=12+(i%7)*7;const b=box(4+(i%3)*2,3+(i%4)*2,4,0x9d7747);b.position.set(Math.cos(a)*r, b.geometry.parameters.height/2,Math.sin(a)*r);scene.add(b)}
 for(let i=0;i<14;i++){const p=box(2,7,2,0xd0a766);p.position.set(-45+i*7,3.5,18+Math.sin(i)*5);scene.add(p)}
 // Great Gate
 const gateL=box(8,18,7,0x6f4e2e),gateR=gateL.clone();gateL.position.set(-9,9,-57);gateR.position.set(9,9,-57);scene.add(gateL,gateR);
 const gateTop=box(26,5,8,0xc7a15e);gateTop.position.set(0,20,-57);scene.add(gateTop);
 player=makeHero();scene.add(player);player.position.set(0,0,35);
 for(let p of [[18,0,8],[-20,0,-5],[30,0,-25],[-28,0,-35]])spawnEnemy(p[0],p[2]);
 spawnRelic(12,0,28);spawnRelic(-12,0,-15);clock=new T.Clock();resize();
}
function makeHero(){const g=new T.Group();const body=new T.Mesh(new T.CapsuleGeometry(1,2.1,5,10),mat(0x7c4b2a));body.position.y=2;body.castShadow=true;g.add(body);const head=new T.Mesh(new T.SphereGeometry(.72,16,12),mat(0xb47b52));head.position.y=4;head.castShadow=true;g.add(head);const crown=box(1.4,.28,1.2,0xd5b45c);crown.position.y=4.65;g.add(crown);blade=box(.18,2.8,.35,0xc7c9cc);blade.position.set(1.15,2.1,.2);blade.rotation.z=-.25;blade.visible=false;g.add(blade);return g}
function spawnEnemy(x,z){const g=new T.Group();const body=new T.Mesh(new T.CapsuleGeometry(.85,1.4,4,8),mat(0x4d5261));body.position.y=1.7;body.castShadow=true;g.add(body);const head=new T.Mesh(new T.SphereGeometry(.55,12,8),mat(0x75604d));head.position.y=3.1;g.add(head);g.position.set(x,0,z);g.userData={hp:55,maxHp:55,cool:Math.random()*2,state:'idle',hit:0};scene.add(g);enemies.push(g)}
function spawnRelic(x,y,z){const g=new T.Mesh(new T.OctahedronGeometry(.8),new T.MeshStandardMaterial({color:0xd7bb62,emissive:0x6a5015,emissiveIntensity:1}));g.position.set(x,y+1,z);g.userData.taken=false;scene.add(g);relics.push(g)}
function moveInput(){let x=0,z=0;if(keys.w)x-=1;if(keys.s)x+=1;if(keys.a)x-=1;if(keys.d)x+=1;return new T.Vector3(x,0,z)}
function attack(){if(paused||attackTimer>0||dodgeTimer>0)return;attackTimer=.42;blade.visible=true;state.wrath=clamp(state.wrath+7+state.skills.will*2,0,100);for(const e of enemies){if(e.userData.hp<=0)continue;const d=e.position.distanceTo(player.position);if(d<4.2){e.userData.hp-=24+state.skills.might*6;e.userData.hit=.2;if(e.userData.hp<=0)defeat(e)}}}
function defeat(e){e.userData.hp=0;e.visible=false;state.kills++;state.xp+=35+state.skills.royal*10;state.wrath=clamp(state.wrath+14,0,100);msg('FOE DEFEATED · XP +'+(35+state.skills.royal*10));checkLevel();if(state.kills>=2&&state.quest<1){state.quest=1;setQuest('Reach the Great Gate. Two foes have fallen.')}}
function checkLevel(){while(state.xp>=100){state.xp-=100;state.level++;state.maxHp+=5;state.hp=state.maxHp;msg('LEVEL UP · LEVEL '+state.level)}}
function dodge(){if(paused||dodgeTimer>0)return;dodgeTimer=.5;const d=moveInput();if(d.lengthSq()===0)d.set(0,0,-1);d.normalize();player.position.addScaledVector(d,6)}
function royalWrath(){if(state.wrath<100)return;state.wrath=0;msg('ROYAL WRATH · THE KING DEFIES');for(const e of enemies){if(e.userData.hp>0&&e.position.distanceTo(player.position)<9){e.userData.hp=0;defeat(e)}}}
function updateEnemies(dt){for(const e of enemies){if(!e.visible)continue;const d=e.position.distanceTo(player.position);e.userData.cool-=dt;if(d<14){const dir=player.position.clone().sub(e.position);dir.y=0;dir.normalize();if(d>3.2)e.position.addScaledVector(dir,dt*2.2);else if(e.userData.cool<=0){e.userData.cool=1.5;if(!block){state.hp-=9;msg('A GUARDIAN STRIKES');if(state.hp<=0){state.hp=state.maxHp;player.position.set(0,0,35);msg('THE CHRONICLE RESTORES YOU')}}else{state.wrath=clamp(state.wrath+10,0,100)}}e.lookAt(player.position.x,e.position.y,player.position.z)}e.userData.hit=Math.max(0,e.userData.hit-dt)}}
function update(dt){worldTime+=dt;attackTimer=Math.max(0,attackTimer-dt);dodgeTimer=Math.max(0,dodgeTimer-dt);if(blade.visible&&attackTimer===0)blade.visible=false;if(paused)return;const d=moveInput();if(d.lengthSq()){d.normalize();player.position.addScaledVector(d,dt*(dodgeTimer>0?15:7));player.rotation.y=Math.atan2(-d.x,-d.z)}player.position.x=clamp(player.position.x,-78,78);player.position.z=clamp(player.position.z,-48,48);updateEnemies(dt);
 for(const r of relics){if(!r.userData.taken){r.rotation.y+=dt*2;r.position.y=1+Math.sin(worldTime*3+r.position.x)*.25;if(r.position.distanceTo(player.position)<2.5){r.userData.taken=true;r.visible=false;state.coins++;state.relic=true;state.wrath=clamp(state.wrath+25,0,100);msg('RELIC CLAIMED · WRATH +25')}}}
 if(state.quest===1&&player.position.z<-47){state.quest=2;setQuest('Speak with the Messenger in the Royal Court.');msg('THE GREAT GATE OPENS · NEW OBJECTIVE')}
 if(state.quest===2&&player.position.distanceTo(new T.Vector3(0,0,5))<8){state.quest=3;setQuest('Chapter I complete · The gods have noticed you.');msg('CHAPTER I COMPLETE · THE GODS ARE WATCHING')}
 const target=player.position.clone();target.y+=3;const camTarget=target.clone().add(new T.Vector3(0,5,11));camera.position.lerp(camTarget,.08);camera.lookAt(target);renderHUD();}
function setQuest(t){$('quest').innerHTML='<b>MAIN QUEST</b><br>'+t}
function renderHUD(){$('hpFill').style.width=(state.hp/state.maxHp*100)+'%';$('hpText').textContent=Math.ceil(state.hp)+' / '+state.maxHp;$('xpFill').style.width=(state.xp)+'%';$('xpText').textContent=state.xp+' / 100';$('wrathFill').style.width=state.wrath+'%';$('levelText').textContent='LEVEL '+state.level+(state.relic?' · RELIC '+state.coins:'')}
function saveGame(){localStorage.setItem('gilgamesh-save',JSON.stringify(state));msg('CHRONICLE SAVED')}
function loadGame(){const s=localStorage.getItem('gilgamesh-save');if(!s){msg('NO CHRONICLE FOUND');return}Object.assign(state,JSON.parse(s));renderHUD();$('menu').classList.add('hidden');$('hud').classList.remove('hidden');$('touch').classList.toggle('hidden',!('ontouchstart' in window));paused=false;msg('CHRONICLE RESTORED')}
function openSkills(){$('skillsPanel').classList.remove('hidden');renderSkills()}
function renderSkills(){const boxEl=$('skillList');boxEl.innerHTML='';for(const [id,[name,desc]] of Object.entries(skillInfo)){const lv=state.skills[id];const row=document.createElement('div');row.className='skill';row.innerHTML='<div><strong>'+name+'</strong><small>'+desc+' · Rank '+lv+'/3</small></div><button '+(state.xp<50||lv>=3?'disabled':'')+' data-skill="'+id+'">UPGRADE · 50 XP</button>';boxEl.appendChild(row)}boxEl.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>{const id=b.dataset.skill;if(state.xp>=50&&state.skills[id]<3){state.xp-=50;state.skills[id]++;if(id==='guard')state.maxHp+=10;renderSkills();renderHUD();msg(skillInfo[id][0]+' UPGRADED')}})}
function bind(){addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key===' '){e.preventDefault();attack()}if(e.key.toLowerCase()==='q')block=true;if(e.key.toLowerCase()==='e')royalWrath();if(e.key.toLowerCase()==='shift')dodge();if(e.key.toLowerCase()==='escape')togglePause()});addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;if(e.key.toLowerCase()==='q')block=false});$('start').onclick=()=>{paused=false;$('menu').classList.add('hidden');$('hud').classList.remove('hidden');$('touch').classList.toggle('hidden',!('ontouchstart' in window));msg('WELCOME TO URUK')};$('load').onclick=loadGame;$('resume').onclick=()=>{paused=false;$('pause').classList.add('hidden')};$('save').onclick=saveGame;$('skills').onclick=openSkills;$('closeSkills').onclick=()=>$('skillsPanel').classList.add('hidden');$('closePause').onclick=()=>$('pause').classList.add('hidden');addEventListener('blur',()=>{if(!paused)togglePause()});addEventListener('resize',resize);
 document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.onpointerdown=e=>{e.preventDefault();keys[k]=true};b.onpointerup=b.onpointercancel=()=>keys[k]=false});document.querySelector('[data-action="attack"]').onclick=attack;document.querySelector('[data-action="dodge"]').onclick=dodge;document.querySelector('[data-action="block"]').onpointerdown=()=>block=true;document.querySelector('[data-action="block"]').onpointerup=()=>block=false;
 let drag=false,lastX=0;renderer.domElement.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX});renderer.domElement.addEventListener('pointerup',()=>drag=false);renderer.domElement.addEventListener('pointermove',e=>{if(drag){camera.position.x+=(e.clientX-lastX)*.035;lastX=e.clientX;camera.lookAt(player.position.x,3,player.position.z)}});
}
function togglePause(){if($('skillsPanel').classList.contains('hidden')){paused=!paused;$('pause').classList.toggle('hidden',!paused)}}
function resize(){if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}
function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05);update(dt);renderer.render(scene,camera)}
makeWorld();bind();$('loading').remove();loop();
