/* SIDE QUESTS — optional Uruk stories that never block the main chronicle */
(()=>{
 const KEY='gilgamesh-sidequests';
 const defs={
  citizen_1:{title:'THE MARKET'S REQUEST',giver:'Citizen',goal:'Defeat 2 enemies',reward:80},
  citizen_2:{title:'THE KING'S WATCH',giver:'Citizen',goal:'Reach the western road',reward:120}
 };
 let data={active:null,completed:[],killsAtStart:0};
 try{data=Object.assign(data,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
 function save(){localStorage.setItem(KEY,JSON.stringify(data))}
 function ensure(){if(document.getElementById('sideQuestPanel'))return;const e=document.createElement('div');e.id='sideQuestPanel';e.style.cssText='position:fixed;right:18px;top:150px;z-index:12;max-width:260px;padding:10px 13px;border-left:2px solid #d7bb62;background:rgba(10,8,6,.72);color:#ead49a;font:12px Inter,Arial;letter-spacing:.4px;pointer-events:none;opacity:0;transition:opacity .2s';document.body.appendChild(e)}
 function accept(id){if(data.active||data.completed.includes(id))return false;data.active=id;data.killsAtStart=Number(state.kills)||0;save();msg('SIDE QUEST · '+defs[id].title);return true}
 function complete(){const d=defs[data.active];if(!d)return;data.completed.push(data.active);data.active=null;state.xp+=d.reward;state.wrath=Math.min(100,state.wrath+15);if(typeof checkLevel==='function')checkLevel();save();msg('SIDE QUEST COMPLETE · +'+d.reward+' XP')}
 function tick(){
  if(typeof state==='undefined')return;ensure();const e=document.getElementById('sideQuestPanel');const a=data.active&&defs[data.active];
  if(!a){e.style.opacity='0';return}
  let done=false;
  if(data.active==='citizen_1')done=(Number(state.kills)||0)>=data.killsAtStart+2;
  if(data.active==='citizen_2')done=(Number(state.quest)||0)>=4;
  e.innerHTML='<b>SIDE QUEST</b><br>'+a.title+'<br><span style="opacity:.75">'+a.goal+' · Reward '+a.reward+' XP</span>';e.style.opacity='1';
  if(done)complete();
 }
 setInterval(tick,300);window.GilgameshSideQuests={defs,data,accept,complete};
})();
