/* RPG EQUIPMENT LAYER — additive, save-compatible */
(()=>{
 const gear={weapon:{name:'Uruk Kingsblade',power:0},armor:{name:'Royal War Mantle',hp:0},relic:{name:'None',wrath:0}};
 const catalog={
  weapon:[['Uruk Kingsblade',0],['Bronze Reaver',5],['Aegean Edge',10]],
  armor:[['Royal War Mantle',0],['Guardian Cuirass',15],['Lion Guard',30]],
  relic:[['None',0],['Sun Relic',10],['Storm Relic',20]]
 };
 function load(){try{const s=JSON.parse(localStorage.getItem('gilgamesh-equipment'));if(s)Object.assign(gear,s)}catch(e){}}
 function save(){localStorage.setItem('gilgamesh-equipment',JSON.stringify(gear))}
 function bonus(type){return gear[type][1]||gear[type].power||gear[type].hp||gear[type].wrath||0}
 function open(){
  let p=document.getElementById('equipmentPanel');if(!p){p=document.createElement('div');p.id='equipmentPanel';p.style.cssText='position:fixed;inset:0;z-index:30;background:rgba(8,7,6,.94);display:flex;align-items:center;justify-content:center;color:#f4e2b0;font-family:system-ui';document.body.appendChild(p)}
  p.innerHTML='<div style="width:min(700px,92vw);padding:28px;border:1px solid #9b7b42;background:#17120d"><h2>EQUIPMENT</h2><p>Weapon: '+gear.weapon.name+' · Power +'+bonus('weapon')+'</p><p>Armor: '+gear.armor.name+' · Max HP +'+bonus('armor')+'</p><p>Relic: '+gear.relic.name+' · Wrath +'+bonus('relic')+'</p><div id="gearChoices"></div><button id="gearClose">BACK</button></div>';
  const c=p.querySelector('#gearChoices'); for(const type of Object.keys(catalog)){const h=document.createElement('h3');h.textContent=type.toUpperCase();c.appendChild(h);catalog[type].forEach((item,i)=>{const b=document.createElement('button');b.textContent=item[0]+' (+'+item[1]+')';b.style.margin='4px';b.onclick=()=>{gear[type]={name:item[0],power:type==='weapon'?item[1]:0,hp:type==='armor'?item[1]:0,wrath:type==='relic'?item[1]:0};save();open()};c.appendChild(b)})}p.querySelector('#gearClose').onclick=()=>p.remove();
 }
 load(); window.GilgameshEquipment={gear,bonus,open,save};
 const oldStart=document.getElementById('skills'); if(oldStart){const b=document.createElement('button');b.className='secondary';b.textContent='EQUIPMENT';b.onclick=open;oldStart.parentNode.insertBefore(b,oldStart.nextSibling)}
 const oldAttack=window.attack;
 setInterval(()=>{if(typeof state!=='undefined'){state.maxHp=Math.max(100,100+(gear.armor.hp||0)+state.skills.guard*10);}},500);
})();
