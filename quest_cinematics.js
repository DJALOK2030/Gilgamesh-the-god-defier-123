/* QUEST CINEMATICS — lightweight chapter transitions and quest-complete beats */
(()=>{
 const chapters={
  4:'THE WESTERN ROAD',9:'THE SEA OF SIGNS',15:'THE LABYRINTH OF KINGS',20:'THE STORM OF OLYMPUS',24:'THE LAST DEFIER',30:'THE FINAL CHRONICLE'
 };
 let last=-1,overlay=null,timer=0;
 function ensure(){
  if(overlay)return;
  overlay=document.createElement('div');overlay.id='questCinematic';overlay.style.cssText='position:fixed;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;background:rgba(5,4,3,.82);opacity:0;pointer-events:none;transition:opacity .35s';
  overlay.innerHTML='<div style="text-align:center;max-width:720px;padding:30px"><div id="qcEyebrow" style="font:600 11px Inter,Arial;letter-spacing:4px;color:#d7bb62">CHRONICLE</div><div id="qcTitle" style="margin-top:14px;font:700 clamp(30px,6vw,64px) Cinzel,serif;color:#f3dfaa">A NEW CHAPTER</div><div id="qcLine" style="margin-top:12px;font:400 15px Inter,Arial;color:#cfc4ad">The road changes. The king continues.</div></div>';
  document.body.appendChild(overlay);
 }
 function show(title,line){ensure();document.getElementById('qcTitle').textContent=title;document.getElementById('qcLine').textContent=line;overlay.style.opacity='1';timer=2.8;setTimeout(()=>{if(overlay)overlay.style.opacity='0'},2200)}
 function tick(){
  if(typeof state==='undefined')return;const q=Number(state.quest)||0;
  if(q!==last){
   if(last>=0&&chapters[q])show(chapters[q],'A new trial awaits beyond the horizon.');
   last=q;
  }
 }
 setInterval(tick,250);setTimeout(tick,700);
 window.GilgameshQuestCinematics={show};
})();
