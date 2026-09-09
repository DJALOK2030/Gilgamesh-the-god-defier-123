/* CAMERA + MOVEMENT RUNTIME — smooth third-person orbit, sprint, touch camera */
(()=>{
 const T=THREE;
 let yaw=0.35,pitch=0.32,distance=12,targetYaw=0.35,targetPitch=0.32;
 let dragging=false,lastX=0,lastY=0,sprint=false;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function setCameraInput(x,y){targetYaw-=x*.006;targetPitch=clamp(targetPitch-y*.004,.08,.78)}
 addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;dragging=true;lastX=e.clientX;lastY=e.clientY});
 addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;setCameraInput(dx,dy)});
 addEventListener('pointerup',()=>dragging=false);
 addEventListener('pointercancel',()=>dragging=false);
 addEventListener('keydown',e=>{if(e.key.toLowerCase()==='control')sprint=true});
 addEventListener('keyup',e=>{if(e.key.toLowerCase()==='control')sprint=false});
 // Two-finger-free touch camera: drag on the upper/right play area; action buttons stop propagation.
 addEventListener('touchstart',e=>{if(e.touches.length!==1)return;const t=e.touches[0];if(t.clientY<innerHeight*.72&&t.clientX>innerWidth*.38){dragging=true;lastX=t.clientX;lastY=t.clientY}},{passive:true});
 addEventListener('touchmove',e=>{if(!dragging||e.touches.length!==1)return;const t=e.touches[0];setCameraInput(t.clientX-lastX,t.clientY-lastY);lastX=t.clientX;lastY=t.clientY},{passive:true});
 addEventListener('touchend',()=>dragging=false,{passive:true});
 function update(dt){
  if(typeof player==='undefined'||typeof camera==='undefined'||typeof state==='undefined')return;
  yaw+=(targetYaw-yaw)*Math.min(1,dt*10);pitch+=(targetPitch-pitch)*Math.min(1,dt*10);
  const input=typeof moveInput==='function'?moveInput():new T.Vector3();
  if(!paused&&input.lengthSq()){
   const speed=sprint?10.5:7;
   const forward=new T.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
   const right=new T.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
   const dir=forward.multiplyScalar(-input.z).add(right.multiplyScalar(input.x));
   if(dir.lengthSq()){dir.normalize();player.position.addScaledVector(dir,dt*(state._invulnerableUntil&&performance.now()<state._invulnerableUntil?speed+2:speed));player.rotation.y=Math.atan2(dir.x,dir.z)}
  }
  player.position.x=clamp(player.position.x,-78,78);
  if(state.quest<4)player.position.z=clamp(player.position.z,-48,48);
  else player.position.z=clamp(player.position.z,-1010,48);
  const target=player.position.clone();target.y+=2.8;
  const cp=Math.cos(pitch),sp=Math.sin(pitch);
  const offset=new T.Vector3(Math.sin(yaw)*cp*distance,sp*distance,Math.cos(yaw)*cp*distance);
  const desired=target.clone().add(offset);
  camera.position.lerp(desired,1-Math.pow(.001,dt));
  camera.lookAt(target);
 }
 setInterval(()=>update(.016),16);
 window.GilgameshCamera={setOrbit:(y,p)=>{targetYaw=y;targetPitch=clamp(p,.08,.78)},getOrbit:()=>({yaw:targetYaw,pitch:targetPitch,distance})};
})();
