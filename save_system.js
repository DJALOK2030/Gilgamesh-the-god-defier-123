/* UNIFIED CHRONICLE SAVE — keeps gameplay + progression systems in one snapshot */
(()=>{
 const KEY='gilgamesh-unified-save';
 const SUBKEYS=['gilgamesh-save','gilgamesh-equipment','gilgamesh-inventory','gilgamesh-achievements','gilgamesh-campaign','gilgamesh-trial','gilgamesh-ending'];
 const clone=v=>JSON.parse(JSON.stringify(v));
 function snapshot(){
  const s={version:1,savedAt:Date.now(),state:clone(state)};
  if(typeof player!=='undefined'&&player)s.player={x:player.position.x,y:player.position.y,z:player.position.z};
  if(window.GilgameshEquipment)s.equipment=clone(window.GilgameshEquipment.gear);
  if(window.GilgameshInventory)s.inventory=clone(window.GilgameshInventory.inv);
  if(window.GilgameshAchievements)s.achievements=clone(window.GilgameshAchievements.unlocked);
  if(window.GilgameshCampaign)s.campaign=clone(window.GilgameshCampaign.data);
  if(window.GilgameshTrial?.state)s.trial=clone(window.GilgameshTrial.state);
  s.ending=localStorage.getItem('gilgamesh-ending')||null;
  return s;
 }
 function save(){
  try{
   const s=snapshot();
   localStorage.setItem(KEY,JSON.stringify(s));
   localStorage.setItem('gilgamesh-save',JSON.stringify(s.state));
   if(s.equipment)localStorage.setItem('gilgamesh-equipment',JSON.stringify(s.equipment));
   if(s.inventory)localStorage.setItem('gilgamesh-inventory',JSON.stringify(s.inventory));
   if(s.achievements)localStorage.setItem('gilgamesh-achievements',JSON.stringify(s.achievements));
   if(s.campaign)localStorage.setItem('gilgamesh-campaign',JSON.stringify(s.campaign));
   if(s.trial)localStorage.setItem('gilgamesh-trial',JSON.stringify(s.trial));
   if(typeof msg==='function')msg('CHRONICLE SAVED · ALL PROGRESS SECURED');
   return true;
  }catch(e){if(typeof msg==='function')msg('SAVE FAILED · STORAGE ERROR');return false;}
 }
 function valid(s){return s&&s.version===1&&s.state&&typeof s.state==='object';}
 function restoreObject(target,source){if(!target||!source)return;for(const k of Object.keys(target))delete target[k];Object.assign(target,clone(source));}
 function load(){
  let s=null;try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
  if(!valid(s)){
   const legacy=localStorage.getItem('gilgamesh-save');
   if(legacy)try{s={version:1,state:JSON.parse(legacy)}}catch(e){}
  }
  if(!valid(s)){if(typeof msg==='function')msg('NO CHRONICLE FOUND');return false;}
  Object.assign(state,clone(s.state));
  if(!state.skills)state.skills={might:0,guard:0,agility:0,will:0,royal:0};
  state.maxHp=Math.max(100,Number(state.maxHp)||100);state.hp=clamp(Number(state.hp)||state.maxHp,0,state.maxHp);
  if(s.player&&typeof player!=='undefined'&&player)player.position.set(Number(s.player.x)||0,Number(s.player.y)||0,Number(s.player.z)||0);
  if(s.equipment&&window.GilgameshEquipment)restoreObject(window.GilgameshEquipment.gear,s.equipment);
  if(s.inventory&&window.GilgameshInventory)restoreObject(window.GilgameshInventory.inv,s.inventory);
  if(s.achievements&&window.GilgameshAchievements)restoreObject(window.GilgameshAchievements.unlocked,s.achievements);
  if(s.campaign&&window.GilgameshCampaign)restoreObject(window.GilgameshCampaign.data,s.campaign);
  if(s.trial&&window.GilgameshTrial&&window.GilgameshTrial.state)restoreObject(window.GilgameshTrial.state,s.trial);
  if(s.ending)localStorage.setItem('gilgamesh-ending',s.ending);else localStorage.removeItem('gilgamesh-ending');
  if(window.GilgameshEquipment?.save)window.GilgameshEquipment.save();
  if(window.GilgameshInventory?.save)window.GilgameshInventory.save();
  if(window.GilgameshCampaign?.save)window.GilgameshCampaign.save();
  if(window.GilgameshTrial?.save)window.GilgameshTrial.save();
  if(window.GilgameshAchievements){try{localStorage.setItem('gilgamesh-achievements',JSON.stringify(window.GilgameshAchievements.unlocked))}catch(e){}}
  renderHUD();
  document.getElementById('menu')?.classList.add('hidden');document.getElementById('hud')?.classList.remove('hidden');document.getElementById('touch')?.classList.toggle('hidden',!('ontouchstart' in window));
  paused=false;if(typeof setQuest==='function')setQuest(questText(state.quest));
  if(typeof msg==='function')msg('CHRONICLE RESTORED · ALL PROGRESS LOADED');
  return true;
 }
 function questText(q){
  if(q>=34)return 'Chapter VII complete · Uruk endures.';
  if(q>=32)return 'Chapter VII · Face the Last Judge.';
  if(q>=30)return 'Chapter VII · Enter the Last Gate.';
  if(q>=28)return 'Chapter VI · Face the Gods’ Champion.';
  if(q>=27)return 'Chapter VI · Stand against the final host.';
  if(q>=26)return 'Chapter VI · Open the divine threshold.';
  if(q>=25)return 'Chapter VI · Gather the five signs beyond the gods.';
  if(q>=24)return 'Chapter VI · The last defier advances.';
  if(q>=22)return 'Chapter V · Challenge the divine champion.';
  if(q>=21)return 'Chapter V · Recover the Thunder Relic.';
  if(q>=20)return 'Chapter V · Climb the storm road.';
  if(q>=17)return 'Chapter IV · Break the royal trial.';
  if(q>=16)return 'Chapter IV · Find the King’s Seal.';
  if(q>=15)return 'Chapter IV · Enter the citadel.';
  if(q>=12)return 'Chapter III · Defy the Oracle.';
  if(q>=11)return 'Chapter III · Recover the Broken Sigil.';
  if(q>=10)return 'Chapter III · Cross the coastal ruins.';
  if(q>=9)return 'Chapter II complete · The Aegean Coast calls.';
  if(q>=8)return 'Chapter II · Face the Aegean Champion.';
  if(q>=7)return 'Chapter II · Clear the western road.';
  if(q>=6)return 'Chapter II · Speak with the western envoy.';
  if(q>=5)return 'Chapter II · Cross the western road and reach the Greek camp.';
  if(q>=4)return 'Chapter II unlocked · Follow the western road.';
  if(q===3)return 'Chapter I complete · The gods have noticed you.';
  if(q===2)return 'Speak with the Messenger in the Royal Court.';
  if(q===1)return 'Reach the Great Gate. Two foes have fallen.';
  return 'Explore Uruk and reach the Great Gate.';
 }
 function reset(){SUBKEYS.forEach(k=>localStorage.removeItem(k));localStorage.removeItem(KEY);location.reload();}
 window.GilgameshSave={key:KEY,snapshot,save,load,reset};
 const oldSave=document.getElementById('save'),oldLoad=document.getElementById('load');
 if(oldSave)oldSave.onclick=save;if(oldLoad)oldLoad.onclick=load;
 window.addEventListener('beforeunload',()=>{if(!paused&&!dialogueOpen)save()});
})();
