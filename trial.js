/* TRIAL OF CHAMPIONS — replayable combat challenge with score, waves and rewards */
(()=>{
 const key='gilgamesh-trial';
 let s={best:0,runs:0,wins:0,active:false,wave:0,score:0};
 try{s={...s,...JSON.parse(localStorage.getItem(key)||'{}')}}catch(e){}
 const save=()=>localStorage.setItem(key,JSON.stringify(s));
 function panel(){let p=document.getElementById('trialPanel');if(!p){p=document.createElement('div');p.id='trialPanel';p.className='overlay';document.body.appendChild(p)}p.classList.remove('hidden');p.innerHTML='<div class="menu-card wide"><h2>TRIAL OF CHAMPIONS</h2><p>Three waves. Survive the arena and earn a permanent record.</p><div class="trial-stats">BEST SCORE: '+s.best+' · VICTORIES: '+s.wins+' · RUNS: '+s.runs+'</div><button id="trialStart">START TRIAL</button><button id="trialClose" class="secondary">BACK</button></div>';p.querySelector('#trialStart').onclick=start;p.querySelector('#trialClose').onclick=()=>p.remove()}
 function start(){if(typeof state==='undefined')return; s.runs++;s.active=true;s.wave=1;s.score=0;save();document.getElementById('trialPanel')?.remove();announce('TRIAL OF CHAMPIONS · WAVE I');}
 function announce(t){if(typeof msg==='function')msg(t)}
 function win(){s.active=false;s.wins++;s.score+=500;if(s.score>s.best)s.best=s.score;state.xp+=200;state.wrath=Math.min(100,state.wrath+30);if(typeof checkLevel==='function')checkLevel();save();announce('TRIAL COMPLETE · +200 XP · SCORE '+s.score)}
 function update(){if(!s.active||typeof state==='undefined')return;if(s.wave===1&&state.kills>=3){s.wave=2;s.score+=250;announce('TRIAL · WAVE II') }else if(s.wave===2&&state.kills>=6){s.wave=3;s.score+=400;announce('TRIAL · FINAL WAVE')}else if(s.wave===3&&state.kills>=9)win()}
 window.GilgameshTrial={panel,start,save,state:s};
 const pause=document.getElementById('skills');if(pause){const b=document.createElement('button');b.className='secondary';b.textContent='TRIAL OF CHAMPIONS';b.onclick=panel;pause.parentNode.insertBefore(b,pause.nextSibling)}
 setInterval(update,700);
})();
