/* HALL OF HEROES — persistent achievement, campaign and trial showcase */
(()=>{
 function open(){let p=document.getElementById('heroesPanel');if(!p){p=document.createElement('div');p.id='heroesPanel';p.className='overlay';document.body.appendChild(p)}p.classList.remove('hidden');let ach={};try{ach=JSON.parse(localStorage.getItem('gilgamesh-achievements')||'{}')}catch(e){}let unlocked=Object.keys(ach).length;let trial=window.GilgameshTrial?.state||{};p.innerHTML='<div class="menu-card wide"><h2>HALL OF HEROES</h2><p>Gilgamesh\'s deeds are remembered.</p><div class="hero-grid"><div><b>ACHIEVEMENTS</b><br>'+unlocked+' recorded</div><div><b>TRIAL BEST</b><br>'+(trial.best||0)+' points</div><div><b>CAMPAIGN</b><br>Chapter '+(window.GilgameshCampaign?.data?.chapter||1)+' of 7</div></div><button id="heroesClose" class="secondary">BACK</button></div>';p.querySelector('#heroesClose').onclick=()=>p.remove()}
 window.GilgameshHall={open};
 const pause=document.getElementById('skills');if(pause){const b=document.createElement('button');b.className='secondary';b.textContent='HALL OF HEROES';b.onclick=open;pause.parentNode.insertBefore(b,pause.nextSibling)}
})();
