/* INVENTORY + LOOT — additive RPG layer */
(()=>{
 const key='gilgamesh-inventory';
 const inv={items:[]};
 const drops=[
  {name:'Bronze Reaver',type:'weapon',value:40,rarity:'UNCOMMON'},
  {name:'Guardian Cuirass',type:'armor',value:45,rarity:'UNCOMMON'},
  {name:'Sun Relic',type:'relic',value:60,rarity:'RARE'},
  {name:'Aegean Edge',type:'weapon',value:80,rarity:'RARE'},
  {name:'Lion Guard',type:'armor',value:90,rarity:'EPIC'}
 ];
 function load(){try{const s=JSON.parse(localStorage.getItem(key));if(s&&Array.isArray(s.items))inv.items=s.items}catch(e){}}
 function save(){localStorage.setItem(key,JSON.stringify(inv))}
 function add(item){inv.items.push({...item,id:Date.now()+Math.random()});save();return item}
 function grantRandom(){const item=drops[Math.floor(Math.random()*drops.length)];add(item);if(typeof msg==='function')msg('LOOT FOUND · '+item.name+' · '+item.rarity);return item}
 function open(){
  let p=document.getElementById('inventoryPanel');if(!p){p=document.createElement('div');p.id='inventoryPanel';p.style.cssText='position:fixed;inset:0;z-index:31;background:rgba(7,6,5,.95);display:flex;align-items:center;justify-content:center;color:#f4e2b0;font-family:system-ui';document.body.appendChild(p)}
  p.innerHTML='<div style="width:min(760px,92vw);max-height:82vh;overflow:auto;padding:28px;border:1px solid #9b7b42;background:#17120d"><h2>INVENTORY</h2><p>'+inv.items.length+' item(s) collected</p><div id="items"></div><button id="invClose">BACK</button></div>';
  const list=p.querySelector('#items'); if(!inv.items.length)list.innerHTML='<p>No loot yet. Defeat foes and search the western road.</p>'; else inv.items.forEach(i=>{const row=document.createElement('div');row.style.cssText='padding:10px;margin:6px 0;border:1px solid #4d3c26';row.innerHTML='<b>'+i.name+'</b> · '+i.type.toUpperCase()+' · '+i.rarity+' · value '+i.value;list.appendChild(row)});p.querySelector('#invClose').onclick=()=>p.remove();
 }
 load();window.GilgameshInventory={inv,drops,add,grantRandom,open,save};
 // Reward defeated ordinary foes without touching the existing combat code.
 let lastKills=0;setInterval(()=>{if(typeof state==='undefined')return;if(state.kills>lastKills){for(let n=lastKills;n<state.kills;n++)if(Math.random()<.32)grantRandom();lastKills=state.kills}},300);
 const pause=document.getElementById('skills');if(pause){const b=document.createElement('button');b.className='secondary';b.textContent='INVENTORY';b.onclick=open;pause.parentNode.insertBefore(b,pause.nextSibling)}
})();
