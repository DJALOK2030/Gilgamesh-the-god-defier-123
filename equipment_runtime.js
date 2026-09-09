/* EQUIPMENT RUNTIME — inventory-owned gear with live stat effects */
(()=>{
 const key='gilgamesh-equipped';
 const owned=()=>window.GilgameshInventory?.inv?.items||[];
 const stats={
  'Bronze Reaver':{type:'weapon',power:5},
  'Aegean Edge':{type:'weapon',power:10},
  'Guardian Cuirass':{type:'armor',hp:15},
  'Lion Guard':{type:'armor',hp:30},
  'Sun Relic':{type:'relic',wrath:10},
  'Storm Relic':{type:'relic',wrath:20}
 };
 const base={weapon:'Uruk Kingsblade',armor:'Royal War Mantle',relic:'None'};
 let equipped={...base};
 let applied={weapon:0,relic:0};
 function load(){try{const s=JSON.parse(localStorage.getItem(key));if(s)equipped={...base,...s}}catch(e){}}
 function save(){localStorage.setItem(key,JSON.stringify(equipped))}
 function item(name){return stats[name]||{type:'none',power:0,hp:0,wrath:0}}
 function ownedName(name){return name==='None'||name==='Uruk Kingsblade'||name==='Royal War Mantle'||owned().some(i=>i.name===name)}
 function equip(name){
  const s=item(name); if(!ownedName(name)) return false;
  equipped[s.type]=name; save(); apply(true); if(typeof msg==='function')msg('EQUIPPED · '+name); return true;
 }
 function apply(show){
  if(typeof state==='undefined')return;
  const w=item(equipped.weapon),r=item(equipped.relic);
  const wp=w.power||0, rw=r.wrath||0;
  // Feed weapon power into the existing combat stat without permanently stacking it.
  if(typeof state.skills==='object'){
   state.skills.might=Math.max(0,(state.skills.might||0)-applied.weapon+wp);
  }
  applied.weapon=wp;
  // Relics grant an immediate Royal Wrath reserve and are reflected in the HUD.
  if(show && rw>applied.relic) state.wrath=Math.min(100,(state.wrath||0)+(rw-applied.relic));
  applied.relic=rw;
  state.maxHp=Math.max(100,100+(item(equipped.armor).hp||0)+(state.skills.guard||0)*10);
  state.hp=Math.min(state.hp,state.maxHp);
 }
 function openFromInventory(){
  if(!window.GilgameshInventory)return;
  let p=document.getElementById('inventoryPanel'); if(!p)return;
  const list=p.querySelector('#items'); if(!list)return;
  [...list.children].forEach((row,idx)=>{
   const it=owned()[idx]; if(!it||!stats[it.name])return;
   const b=document.createElement('button'); b.textContent='EQUIP'; b.style.marginLeft='10px'; b.onclick=()=>{equip(it.name); openFromInventory()}; row.appendChild(b);
  });
 }
 load();
 window.GilgameshEquipmentRuntime={equipped,stats,equip,apply,refreshInventory:openFromInventory};
 setTimeout(()=>apply(false),50);
 setInterval(()=>apply(false),700);
 const oldOpen=window.GilgameshInventory?.open;
 if(oldOpen){
  window.GilgameshInventory.open=()=>{oldOpen();setTimeout(openFromInventory,0)};
 }
})();
