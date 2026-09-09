/* FULL CAMPAIGN TRAVEL FIX — replaces the old Chapter II-only boundary */
(()=>{
 function frame(){
  requestAnimationFrame(frame);
  if(typeof state==='undefined'||typeof player==='undefined')return;
  if(state.quest>=4){
   // Chapters II–VII extend westward from Uruk. Keep the player inside the full campaign corridor.
   player.position.z=Math.max(-1010,player.position.z);
   if(typeof camera!=='undefined'&&camera){
    const target=new THREE.Vector3(player.position.x,player.position.y+4,player.position.z+8);
    camera.position.lerp(new THREE.Vector3(player.position.x+9,player.position.y+7,player.position.z+11),.08);
    camera.lookAt(target);
   }
  }
 }
 requestAnimationFrame(frame);
})();
