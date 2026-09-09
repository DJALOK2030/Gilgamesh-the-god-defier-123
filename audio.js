/* AUDIO SYSTEM — lightweight procedural ambience and combat feedback */
(()=>{
 let ctx=null,master=null,ambient=null;
 function init(){if(ctx)return;try{ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.055;master.connect(ctx.destination)}catch(e){}}
 function tone(freq,duration=.12,type='sine',volume=.08){init();if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(volume,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+duration)}
 function start(){init();if(!ctx)return;if(ctx.state==='suspended')ctx.resume();if(ambient)return;ambient=setInterval(()=>{tone(110,.5,'triangle',.018)},2600)}
 function stop(){if(ambient){clearInterval(ambient);ambient=null}}
 window.GilgameshAudio={init,start,stop,attack:()=>tone(180,.07,'square',.035),hit:()=>tone(75,.08,'sawtooth',.025),level:()=>{tone(440,.12,'triangle',.05);setTimeout(()=>tone(660,.18,'triangle',.04),100)},boss:()=>tone(55,.45,'sawtooth',.035)};
 document.addEventListener('keydown',e=>{if(e.key==='Enter')start()},{once:true});
})();
