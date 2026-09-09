(() => {
  const questLog = [
    { id:'gate', title:'THE GREAT GATE', text:'Reach the Great Gate of Uruk.', done:()=>state.quest>=2 },
    { id:'relics', title:'TREASURES OF URUK', text:'Recover both ancient relics.', done:()=>state.coins>=2 },
    { id:'champion', title:'CHAMPION OF THE WEST', text:'Defeat the Champion of the West.', done:()=>state.quest>=4 }
  ];
  const sideState = { equipment:'Royal Blade', chapter2:false, markers:[] };

  function addWorldUI(){
    if($('worldPanel')) return;
    const p=document.createElement('div'); p.id='worldPanel'; p.className='world-panel';
    p.innerHTML='<div class="world-title">CHRONICLE</div><div id="equipmentText">EQUIPMENT · ROYAL BLADE</div><div id="sideQuestText">SIDE QUESTS</div><button id="mapBtn">WORLD MAP</button>';
    document.body.appendChild(p);
    $('mapBtn').onclick=toggleMap;
    const map=document.createElement('div'); map.id='mapOverlay'; map.className='overlay hidden';
    map.innerHTML='<div class="menu-card wide"><h2>URUK · WESTERN APPROACH</h2><p>Gold markers show major objectives. The western road leads beyond the city.</p><div class="map-grid"><span>ROYAL COURT</span><span>MARKET</span><span>GREAT GATE</span><span>WESTERN ROAD</span></div><button id="closeMap" class="secondary">BACK</button></div>';
    document.body.appendChild(map); $('closeMap').onclick=toggleMap;
  }
  function toggleMap(){ $('mapOverlay').classList.toggle('hidden'); if(!$('mapOverlay').classList.contains('hidden')) paused=true; else if(!dialogueOpen) paused=false; }

  function addQuestMarkers(){
    for(const m of sideState.markers) scene.remove(m);
    sideState.markers=[];
    const points=[{x:0,z:-53,label:'GATE'},{x:12,z:28,label:'RELIC'},{x:-12,z:-15,label:'RELIC'},{x:0,z:5,label:'MESSENGER'}];
    for(const p of points){
      const g=new T.Group(); const ring=new T.Mesh(new T.RingGeometry(.55,.7,24),new T.MeshBasicMaterial({color:0xe7c76a,transparent:true,opacity:.8,side:T.DoubleSide})); ring.rotation.x=-Math.PI/2; g.add(ring);
      const stem=new T.Mesh(new T.CylinderGeometry(.035,.035,2.4,6),new T.MeshBasicMaterial({color:0xe7c76a,transparent:true,opacity:.65})); stem.position.y=1.2; g.add(stem); g.position.set(p.x,.04,p.z); g.userData.label=p.label; scene.add(g); sideState.markers.push(g);
    }
  }
  function updateMarkers(dt){
    for(const m of sideState.markers){ m.rotation.y+=dt*.7; m.position.y=.05+Math.sin(worldTime*2+m.position.x)*.08; }
  }

  function renderQuestLog(){
    const el=$('sideQuestText'); if(!el) return;
    const active=questLog.filter(q=>!q.done()).slice(0,2);
    el.innerHTML='<b>SIDE OBJECTIVES</b><br>'+(active.length?active.map(q=>'• '+q.title+'<small>'+q.text+'</small>').join(''):'All current objectives complete.');
    const eq=$('equipmentText'); if(eq) eq.textContent='EQUIPMENT · '+sideState.equipment;
  }

  function completeRelicQuest(){
    if(state.coins>=2 && !state.relicQuestReward){
      state.relicQuestReward=true; state.xp+=75; checkLevel(); msg('TREASURES OF URUK COMPLETE · XP +75');
    }
  }

  function chapterTwo(){
    if(sideState.chapter2 || state.quest<4) return;
    sideState.chapter2=true;
    state.quest=5;
    setQuest('Chapter II · The Road Beyond Uruk. Reach the Western Road.');
    banner('CHAPTER II · THE ROAD BEYOND URUK');
    msg('A NEW CHAPTER BEGINS');
    const road=document.createElement('div'); road.id='chapterToast'; road.textContent='CHAPTER II · THE ROAD BEYOND URUK'; document.body.appendChild(road); setTimeout(()=>road.remove(),4200);
  }

  addWorldUI();
  setTimeout(addQuestMarkers,300);
  const oldUpdate=window.update;
  if(typeof oldUpdate==='function'){
    window.update=function(dt){ oldUpdate(dt); if(!paused){updateMarkers(dt);renderQuestLog();completeRelicQuest();chapterTwo();} };
  }
  const oldSave=window.saveGame;
  if(typeof oldSave==='function') window.saveGame=function(){ state.relicQuestReward=!!state.relicQuestReward; localStorage.setItem('gilgamesh-save',JSON.stringify(state)); msg('CHRONICLE SAVED'); };
  renderQuestLog();
})();
