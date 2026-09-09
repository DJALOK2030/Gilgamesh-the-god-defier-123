/* CAMPAIGN RUNTIME — reliable chapter checkpoints and HUD chapter labels */
(()=>{
 let lastQuest=-1,lastChapter='';
 function chapterFor(q){
  if(q>=30)return 'CHAPTER VII · THE FINAL CHRONICLE';
  if(q>=24)return 'CHAPTER VI · THE LAST DEFIER';
  if(q>=20)return 'CHAPTER V · THE STORM OF OLYMPUS';
  if(q>=15)return 'CHAPTER IV · THE LABYRINTH OF KINGS';
  if(q>=9)return 'CHAPTER III · THE SEA OF SIGNS';
  if(q>=4)return 'CHAPTER II · THE ROAD BEYOND URUK';
  return 'CHAPTER I · THE RESTLESS KING';
 }
 function tick(){
  if(typeof state==='undefined')return;
  const q=Number(state.quest)||0;
  const ch=chapterFor(q);
  const el=document.querySelector('.chapter');
  if(el&&el.textContent!==ch)el.textContent=ch;
  if(q!==lastQuest){
   if(lastQuest>=0&&window.GilgameshSave?.save)window.GilgameshSave.save();
   lastQuest=q;
   if(window.GilgameshSave?.save)window.GilgameshSave.save();
  }
  if(ch!==lastChapter)lastChapter=ch;
 }
 setInterval(tick,350);
 setTimeout(tick,500);
 window.GilgameshCampaignRuntime={chapterFor,tick};
})();
