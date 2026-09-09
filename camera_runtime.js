/* CAMERA RUNTIME — smooth third-person orbit and sprint state.
   Player translation remains in game.js so there is one movement authority. */
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
 addEventListener('touchstart',e=>{if(e.touches.length!==1)return;const t=e.touches[0];if(t.clientY<innerHeight*.72&&t.clientX>innerWidth*.38){dragging=true;lastX=t.clientX;lastY=t.clientY}},{passive:true});
 addEventListener('touchmove',e=>{if(!dragging||e.touches.length!==1)return;const t=e.touches[0];setCameraInput(t.clientX-lastX,t.clientY-lastY);lastX=t.clientX;lastY=t.clientY},{passive:true});
 addEventListener('touchend',()=>dragging=false,{passive:true});
 function update(){
  if(typeof player==='undefined'||typeof camera==='undefined'||typeof state==='undefined')return;
  const dt=.016;
  yaw+=(targetYaw-yaw)*Math.min(1,dt*10);pitch+=(targetPitch-pitch)*Math.min(1,dt*10);
  // Expose sprint to the main movement loop without creating a second movement loop.
  state._sprinting=sprint;
  const target=player.position.clone();target.y+=2.8;
  const cp=Math.cos(pitch),sp=Math.sin(pitch);
  const offset=new T.Vector3(Math.sin(yaw)*cp*distance,sp*distance,Math.cos(yaw)*cp*distance);
  const desired=target.clone().add(offset);
  camera.position.lerp(desired,1-Math.pow(.001,dt));
  camera.lookAt(target);
 }
 setInterval(update,16);
 window.GilgameshCamera={setOrbit:(y,p)=>{targetYaw=y;targetPitch=clamp(p,.08,.78)},getOrbit:()=>({yaw:targetYaw,pitch:targetPitch,distance}),isSprinting:()=>sprint};
})();
