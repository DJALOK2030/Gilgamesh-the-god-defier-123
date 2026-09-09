/* BOSS COMBAT GUARD — keeps custom bosses out of ordinary defeat rewards */
(()=>{
  const original=window.defeat;
  if(typeof original!=='function')return;
  window.defeat=function(e){
    if(e&&e.userData&&(e.userData.boss||e.userData.finalBoss||e.userData.chapter3Boss||e.userData.chapter4Boss||e.userData.chapter5Boss||e.userData.chapter6Boss)){
      e.userData.hp=0;
      return;
    }
    return original(e);
  };
})();
