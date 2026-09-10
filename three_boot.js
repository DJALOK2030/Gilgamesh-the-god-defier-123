/* Robust Three.js loader for GitHub Pages / mobile browsers. */
(()=>{
  'use strict';
  const sources=[
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r180/three.min.js',
    'https://unpkg.com/three@0.180.0/build/three.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.min.js'
  ];
  let i=0;
  const boot=document.getElementById('boot');
  const status=t=>{const e=document.getElementById('bootStatus');if(e)e.textContent=t;};
  const fail=()=>{
    if(i<sources.length) return load();
    status('3D engine could not be reached. Check the connection, then reload.');
    const b=document.getElementById('boot'); if(b)b.classList.add('error');
    window.dispatchEvent(new Event('gilgamesh-three-failed'));
  };
  const load=()=>{
    const src=sources[i++];
    status('Loading 3D engine…');
    const s=document.createElement('script');
    s.src=src;
    s.onload=()=>{
      if(window.THREE){
        status('3D engine ready.');
        window.dispatchEvent(new Event('gilgamesh-three-ready'));
      }else fail();
    };
    s.onerror=fail;
    document.head.appendChild(s);
  };
  load();
})();
