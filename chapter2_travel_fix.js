/* FULL CAMPAIGN TRAVEL FIX — player corridor only; camera is owned by camera_runtime.js */
(()=>{
 function frame(){
  requestAnimationFrame(frame);
  if(typeof state==='undefined'||typeof player==='undefined')return;
  if(state.quest>=4){
   // Chapters II–VII extend westward from Uruk. Keep the player inside the full campaign corridor.
   player.position.z=Math.max(-1010,player.position.z);
  }
 }
 requestAnimationFrame(frame);
})();
