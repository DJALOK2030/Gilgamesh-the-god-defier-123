/* MYTHIC ACHIEVEMENTS — persistent milestone tracker */
(()=>{
 const key='gilgamesh-achievements';
 const defs=[
  ['first_blood','FIRST BLOOD','Defeat your first foe.',s=>s.kills>=1],
  ['champion','CHAMPION BREAKER','Defeat the Champion of the West.',s=>s.quest>=4],
  ['road_walker','WESTERN ROAD','Reach the western camp.',s=>s.quest>=6],
  ['relic_hunter','RELIC HUNTER','Collect 3 western relics.',s=>s.coins>=3],
  ['level_five','RISING KING','Reach level 5.',s=>s.level>=5],
  ['arsenal','ROYAL ARSENAL','Collect 4 pieces of loot.',s=>(window.GilgameshInventory?.inv?.items?.length||0)>=4],
  ['defier','THE GOD-DEFIER','Defeat the Aegean Champion.',s=>s.quest>=9]
 ];
 let unlocked={};
 try{unlocked=JSON.parse(localStorage.getItem(key))||{}}catch(e){}
 function save(){localStorage.setItem(key,JSON.stringify(unlocked))}
 function check(){if(typeof state==='undefined')return;for(const [id,name,desc,test] of defs)if(!unlocked[id]&&test(state)){unlocked[id]={name,at:Date.now()};save();if(typeof msg==='function')msg('ACHIEVEMENT · '+name)}}
 function open(){
  let p=document.getElementById('achievementsPanel');if(!p){p=document.createElement('div');p.id='achievementsPanel';p.style.cssText='position:fixed;inset:0;z-index:40;background:rgba(7,6,5,.96);display:flex;align-items:center;justify-content:center;color:#f4e2b0;font-family:system-ui';document.body.appendChild(p)}
  p.innerHTML='<div style="width:min(760px,92vw);max-height:84vh;overflow:auto;padding:28px;border:1px solid #9b7b42;background:#17120d"><h2>ACHIEVEMENTS</h2><p>'+Object.keys(unlocked).length+' / '+defs.length+' unlocked</p><div id="achList"></div><button id="achClose">BACK</button></div>';
  const list=p.querySelector('#achList');defs.forEach(([id,name,desc])=>{const row=document.createElement('div');row.style.cssText='padding:12px;margin:7px 0;border:1px solid #4d3c26';const done=!!unlocked[id];row.innerHTML='<b>'+name+'</b> · '+(done?'UNLOCKED':'LOCKED')+'<br><small>'+desc+'</small>';list.appendChild(row)});p.querySelector('#achClose').onclick=()=>p.remove();
 }
 window.GilgameshAchievements={defs,unlocked,check,open};
 const skills=document.getElementById('skills');if(skills){const b=document.createElement('button');b.className='secondary';b.textContent='ACHIEVEMENTS';b.onclick=open;skills.parentNode.insertBefore(b,skills.nextSibling)}
 setInterval(check,700);setTimeout(check,300);
})();
