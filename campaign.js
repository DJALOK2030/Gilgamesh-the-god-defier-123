/* CAMPAIGN FRAMEWORK — Chapters III–VII scaffolding, quests, regions, bosses, progression */
(()=>{
 const T=THREE;
 const chapters={
  3:{name:'CHAPTER III · THE SEA OF SIGNS',region:'Aegean Coast',quests:['Cross the coastal ruins','Recover the Broken Sigil','Defy the Oracle'],boss:'ORACLE WARDEN'},
  4:{name:'CHAPTER IV · THE LABYRINTH OF KINGS',region:'Sunken Citadel',quests:['Enter the citadel','Find the King’s Seal','Break the royal trial'],boss:'KING OF THE LABYRINTH'},
  5:{name:'CHAPTER V · THE STORM OF OLYMPUS',region:'Stormbound Highlands',quests:['Climb the storm road','Recover the Thunder Relic','Challenge the divine champion'],boss:'STORM HERALD'},
  6:{name:'CHAPTER VI · THE LAST DEFIER',region:'Fields Beyond the Gods',quests:['Gather the five signs','Open the divine threshold','Stand against the final host'],boss:'THE GODS\' CHAMPION'},
  7:{name:'CHAPTER VII · THE FINAL CHRONICLE',region:'The Last Gate',quests:['Enter the Last Gate','Face the final judgment','Choose the fate of Uruk'],boss:'THE LAST JUDGE'}
 };
 const stateKey='gilgamesh-campaign';
 let data={chapter:1,questIndex:0,completed:{}};
 try{data={...data,...JSON.parse(localStorage.getItem(stateKey)||'{}')}}catch(e){}
 function save(){localStorage.setItem(stateKey,JSON.stringify(data))}
 function current(){return chapters[data.chapter]}
 function announce(text){if(typeof msg==='function')msg(text);}
 function advance(){const c=current();if(!c)return;if(data.questIndex<c.quests.length-1){data.questIndex++;announce('QUEST COMPLETE · '+c.quests[data.questIndex]);setQuest(c.name+' · '+c.quests[data.questIndex])}else{data.completed[data.chapter]=true;announce(c.name+' COMPLETE · '+c.boss awaits);save();}}
 function unlock(n){if(n<3||!data.completed[n-1])return false;data.chapter=n;data.questIndex=0;save();setQuest(chapters[n].name+' · '+chapters[n].quests[0]);announce(chapters[n].name+' UNLOCKED · '+chapters[n].region);return true}
 function panel(){let p=document.getElementById('campaignPanel');if(!p){p=document.createElement('div');p.id='campaignPanel';p.className='overlay';document.body.appendChild(p)}p.classList.remove('hidden');p.innerHTML='<div class="menu-card wide"><h2>THE CHRONICLE</h2><p>Seven chapters. One defiance.</p><div id="campaignList"></div><button id="campaignClose" class="secondary">BACK</button></div>';const l=p.querySelector('#campaignList');for(let n=1;n<=7;n++){const c=n<3?{name:'CHAPTER '+n,region:n===1?'URUK': 'WESTERN ROAD',quests:n===1?['The Restless King','Champion of the West']:['The Western Envoy','Aegean Champion']} :chapters[n];const done=n===1?data.completed[1]||data.chapter>1:data.completed[n];const unlocked=n<=2||data.completed[n-1];const row=document.createElement('div');row.className='campaign-row';row.innerHTML='<b>'+c.name+'</b><br><small>'+c.region+' · '+(done?'COMPLETE':unlocked?'UNLOCKED':'LOCKED')+'</small>';if(unlocked&&n>=3&&!done){row.onclick=()=>{unlock(n);panel()}}l.appendChild(row)}p.querySelector('#campaignClose').onclick=()=>p.remove()}
 window.GilgameshCampaign={chapters,data,advance,unlock,panel,current,save};
 const pause=document.getElementById('skills');if(pause){const b=document.createElement('button');b.className='secondary';b.textContent='THE CHRONICLE';b.onclick=panel;pause.parentNode.insertBefore(b,pause.nextSibling)}
 setInterval(()=>{if(typeof state==='undefined')return;if(state.quest>=9&&data.chapter<3){data.completed[2]=true;data.chapter=3;data.questIndex=0;save();setQuest(chapters[3].name+' · '+chapters[3].quests[0]);announce('CHAPTER III UNLOCKED · The Aegean Coast calls.')}} ,1000);
})();
