/* EQUIPMENT RUNTIME — inventory-owned gear with live stat effects */
(()=>{
 const key='gilgamesh-equipped';
 const owned=()=>window.GilgameshInventory?.inv?.items||[];
 const stats={'Bronze Reaver':{type:'weapon',power:5},'Aegean Edge':{type:'weapon',power:10},'Guardian Cuirass':{type:'armor',hp:15},'Lion Guard':{type:'armor',hp:30},'Sun Relic':{type:'relic',wrath:10},'Storm Relic':{type:'relic',wrath:20}};
 const base={weapon:'Uruk Kingsblade',armor:'Royal War Mantle',relic:'None'};let equipped={...base};
 function load(){try{const s=JSON.parse(localStorage.getItem(key));if(s)equipped={...base,...s}}catch(e){}}
 function save(){localStorage.setItem(key,JSON.stringify(equipped))}
 function item(n){return stats[n]||{type:'none',power:0,hp:0,wrath:0}}
 function ownedName(n){return n==='None'||n==='Uruk Kingsblade'||n==='Royal War Mantle'||owned().some(i=>i.name===n)}
 function equip(n){const s=item(n);if(!ownedName(n)||s.type==='none')return false;equipped[s.type]=n;save();apply();if(typeof msg==='function')msg('EQUIPPED · '+n);return true}
 function apply(){if(typeof state==='undefined')return;const a=item(equipped.armor);state.maxHp=Math.max(100,100+(a.hp||0)+(state.skills.guard||0)*10);state.hp=Math.min(state.hp,state.maxHp)}
 function openFromInventory(){const p=document.getElementById('inventoryPanel'),list=p?.querySelector('#items');if(!list)return;const items=owned();[...list.children].forEach((row,idx)=>{const it=items[idx];if(!it||!stats[it.name]||row.querySelector('.equipBtn'))return;const b=document.createElement('button');b.className='equipBtn';b.textContent='EQUIP';b.style.marginLeft='10px';b.onclick=()=>{equip(it.name);openFromInventory()};row.appendChild(b)})}
 load();window.GilgameshEquipmentRuntime={equipped,stats,equip,apply,refreshInventory:openFromInventory};setTimeout(apply,80);setInterval(apply,700);
 const oldOpen=window.GilgameshInventory?.open;if(oldOpen)window.GilgameshInventory.open=()=>{oldOpen();setTimeout(openFromInventory,0)};
 // Apply weapon/relic bonuses only for the duration of an existing combat call; base skill ranks remain unchanged.
 const originalAttack=window.attack;if(typeof originalAttack==='function'){window.attack=function(){if(typeof state==='undefined')return originalAttack();const w=item(equipped.weapon),r=item(equipped.relic),oldM=state.skills.might,oldW=state.skills.will;state.skills.might=oldM+(w.power||0)/7;state.skills.will=oldW+(r.wrath||0)/2;try{return originalAttack()}finally{state.skills.might=oldM;state.skills.will=oldW}}}
})();
