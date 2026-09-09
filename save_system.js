/* UNIFIED CHRONICLE SAVE — one validated snapshot for gameplay and progression */
(()=>{
 const KEY='gilgamesh-unified-save',VERSION=3;
 const SUBKEYS=['gilgamesh-save','gilgamesh-equipment','gilgamesh-equipped','gilgamesh-inventory','gilgamesh-achievements','gilgamesh-campaign','gilgamesh-trial','gilgamesh-ending','gilgamesh-sidequests'];
 const clone=v=>JSON.parse(JSON.stringify(v));
 const num=(v,d)=>Number.isFinite(Number(v))?Number(v):d;
 function snapshot(){
  const s={version:VERSION,savedAt:Date.now(),state:clone(state)};
  if(typeof player!=='undefined'&&player)s.player={x:player.position.x,y:player.position.y,z:player.position.z};
  if(window.GilgameshEquipment)s.equipment=clone(window.GilgameshEquipment.gear);
  if(window.GilgameshEquipmentRuntime?.snapshot)s.equipped=clone(window.GilgameshEquipmentRuntime.snapshot());
  if(window.GilgameshInventory)s.inventory=clone(window.GilgameshInventory.inv);
  if(window.GilgameshAchievements)s.achievements=clone(window.GilgameshAchievements.unlocked);
  if(window.GilgameshCampaign)s.campaign=clone(window.GilgameshCampaign.data);
  if(window.GilgameshTrial?.state)s.trial=clone(window.GilgameshTrial.state);
  if(window.GilgameshSideQuests?.data)s.sidequests=clone(window.GilgameshSideQuests.data);
  s.ending=localStorage.getItem('gilgamesh-ending')||null;
  return s;
 }
 function mirror(s){
  localStorage.setItem('gilgamesh-save',JSON.stringify(s.state));
  if(s.equipment)localStorage.setItem('gilgamesh-equipment',JSON.stringify(s.equipment));
  if(s.equipped)localStorage.setItem('gilgamesh-equipped',JSON.stringify(s.equipped));
  if(s.inventory)localStorage.setItem('gilgamesh-inventory',JSON.stringify(s.inventory));
  if(s.achievements)localStorage.setItem('gilgamesh-achievements',JSON.stringify(s.achievements));
  if(s.campaign)localStorage.setItem('gilgamesh-campaign',JSON.stringify(s.campaign));
  if(s.trial)localStorage.setItem('gilgamesh-trial',JSON.stringify(s.trial));
  if(s.sidequests)localStorage.setItem('gilgamesh-sidequests',JSON.stringify(s.sidequests));
 }
 function save(){try{const s=snapshot();localStorage.setItem(KEY,JSON.stringify(s));mirror(s);if(typeof msg==='function')msg('CHRONICLE SAVED · ALL PROGRESS SECURED');return true}catch(e){if(typeof msg==='function')msg('SAVE FAILED · STORAGE ERROR');return false}}
 function valid(s){return !!(s&&[1,2,3].includes(s.version)&&s.state&&typeof s.state==='object')}
 function restoreObject(target,source){if(!target||!source)return;for(const k of Object.keys(target))delete target[k];Object.assign(target,clone(source))}
 function sanitize(){
  state.level=Math.max(1,Math.floor(num(state.level,1)));state.xp=clamp(num(state.xp,0),0,99);state.wrath=clamp(num(state.wrath,0),0,100);state.kills=Math.max(0,Math.floor(num(state.kills,0)));state.coins=Math.max(0,Math.floor(num(state.coins,0)));state.quest=Math.max(0,Math.floor(num(state.quest,0)));state.maxHp=Math.max(100,num(state.maxHp,100));state.hp=clamp(num(state.hp,state.maxHp),0,state.maxHp);if(!state.skills)state.skills={};for(const k of ['might','guard','agility','will','royal'])state.skills[k]=clamp(Math.floor(num(state.skills[k],0)),0,3);
 }
 function load(){
  let s=null;try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
  if(!valid(s)){try{const legacy=JSON.parse(localStorage.getItem('gilgamesh-save')||'null');if(legacy)s={version:1,state:legacy}}catch(e){}}
  if(!valid(s)){if(typeof msg==='function')msg('NO CHRONICLE FOUND');return false}
  Object.assign(state,clone(s.state));sanitize();
  if(s.player&&typeof player!=='undefined'&&player)player.position.set(num(s.player.x,0),num(s.player.y,0),num(s.player.z,35));
  if(s.equipment&&window.GilgameshEquipment)restoreObject(window.GilgameshEquipment.gear,s.equipment);
  if(s.inventory&&window.GilgameshInventory)restoreObject(window.GilgameshInventory.inv,s.inventory);
  if(s.achievements&&window.GilgameshAchievements)restoreObject(window.GilgameshAchievements.unlocked,s.achievements);
  if(s.campaign&&window.GilgameshCampaign)restoreObject(window.GilgameshCampaign.data,s.campaign);
  if(s.trial&&window.GilgameshTrial?.state)restoreObject(window.GilgameshTrial.state,s.trial);
  if(s.sidequests&&window.GilgameshSideQuests?.data)restoreObject(window.GilgameshSideQuests.data,s.sidequests);
  if(s.equipped&&window.GilgameshEquipmentRuntime?.restore)window.GilgameshEquipmentRuntime.restore(s.equipped);
  if(s.ending)localStorage.setItem('gilgamesh-ending',s.ending);else localStorage.removeItem('gilgamesh-ending');
  mirror(snapshot());
  renderHUD();setQuest(questText(state.quest));
  document.getElementById('menu')?.classList.add('hidden');document.getElementById('hud')?.classList.remove('hidden');document.getElementById('touch')?.classList.toggle('hidden',!('ontouchstart' in window));
  paused=false;if(state.quest>=34)document.getElementById('ending')?.classList.remove('hidden');if(typeof msg==='function')msg('CHRONICLE RESTORED · ALL PROGRESS LOADED');return true;
 }
 function questText(q){
  if(q>=34)return 'Chapter VII complete · Uruk endures.';if(q>=32)return 'Chapter VII · Face the Last Judge.';if(q>=30)return 'Chapter VII · Enter the Last Gate.';if(q>=28)return 'Chapter VI · Face the Gods’ Champion.';if(q>=27)return 'Chapter VI · Stand against the final host.';if(q>=26)return 'Chapter VI · Open the divine threshold.';if(q>=25)return 'Chapter VI · Gather the five signs beyond the gods.';if(q>=24)return 'Chapter VI · The last defier advances.';if(q>=22)return 'Chapter V · Challenge the divine champion.';if(q>=21)return 'Chapter V · Recover the Thunder Relic.';if(q>=20)return 'Chapter V · Climb the storm road.';if(q>=17)return 'Chapter IV · Break the royal trial.';if(q>=16)return 'Chapter IV · Find the King’s Seal.';if(q>=15)return 'Chapter IV · Enter the citadel.';if(q>=12)return 'Chapter III · Defy the Oracle.';if(q>=11)return 'Chapter III · Recover the Broken Sigil.';if(q>=10)return 'Chapter III · Cross the coastal ruins.';if(q>=9)return 'Chapter II complete · The Aegean Coast calls.';if(q>=8)return 'Chapter II · Face the Aegean Champion.';if(q>=7)return 'Chapter II · Clear the western road.';if(q>=6)return 'Chapter II · Speak with the western envoy.';if(q>=5)return 'Chapter II · Cross the western road and reach the Greek camp.';if(q>=4)return 'Chapter II unlocked · Follow the western road.';if(q===3)return 'Chapter I complete · The gods have noticed you.';if(q===2)return 'Speak with the Messenger in the Royal Court.';if(q===1)return 'Reach the Great Gate. Two foes have fallen.';return 'Explore Uruk and reach the Great Gate.';
 }
 function reset(){SUBKEYS.forEach(k=>localStorage.removeItem(k));localStorage.removeItem(KEY);location.reload()}
 window.GilgameshSave={key:KEY,snapshot,save,load,reset};
 document.getElementById('save')?.addEventListener('click',e=>{e.stopImmediatePropagation();save()});
 document.getElementById('load')?.addEventListener('click',e=>{e.stopImmediatePropagation();load()});
 window.addEventListener('beforeunload',()=>{if(!paused&&!dialogueOpen)save()});
})();
