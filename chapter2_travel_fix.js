/* CHAPTER II TRAVEL FIX — extends the playable road beyond Uruk */
(()=>{
 function frame(){
  requestAnimationFrame(frame);
  if(typeof state==='undefined'||typeof player==='undefined')return;
  if(state.quest>=4){
   // game.js originally bounded the base city at z=-48; Chapter II needs the western road.
   player.position.z=Math.max(-245,player.position.z);
   if(typeof camera!=='undefined'&&camera){
    const target=new THREE.Vector3(player.position.x,player.position.y+4,player.position.z+8);
    camera.position.lerp(new THREE.Vector3(player.position.x+9,player.position.y+7,player.position.z+11),.08);
    camera.lookAt(target);
   }
  }
 }
 requestAnimationFrame(frame);
})();
