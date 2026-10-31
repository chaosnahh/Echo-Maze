(()=>{
const $=s=>document.querySelector(s),cv=$('#c'),X=cv.getContext('2d'),T=32;
const LV=Levels.stages;
// Save data v2: validated on load; the unlocked index is derived from completed stages so S.u and S.done can never disagree.
// Saves without v:2 (old development/test progress) are reset once (settings kept) and re-stamped; v2 saves are never reset.
const SAVE_V=2;
function loadSave(){const d={v:SAVE_V,u:0,vol:.7,sens:1,mute:false,bar:true,assist:false,done:Array(21).fill(0)};let r=null;try{r=JSON.parse(localStorage.getItem('echo'))}catch(e){}
 if(!r||typeof r!=='object')return d;
 for(const k of['vol','sens'])if(typeof r[k]==='number'&&isFinite(r[k]))d[k]=r[k];
 for(const k of['mute','bar','assist'])if(typeof r[k]==='boolean')d[k]=r[k];
 if(r.v===SAVE_V&&Array.isArray(r.done)){let last=-1;for(let i=0;i<21;i++)if(r.done[i]===1||r.done[i]===true){d.done[i]=1;last=i}d.u=Math.min(20,last+1)}
 return d}
let S=loadSave();
const save=()=>{try{localStorage.setItem('echo',JSON.stringify(S))}catch(e){}};
Audio.vol=S.vol;Audio.muted=S.mute;save();
let G={mode:'menu',t:0},W,H,keys={},jv={x:0,y:0},last=0;
const dust=Array.from({length:60},()=>({x:Math.random(),y:Math.random(),v:.01+Math.random()*.02,s:.6+Math.random()*1.4}));
const vib=n=>{if(navigator.vibrate)try{navigator.vibrate(n)}catch(e){}};
function size(){const d=Math.min(devicePixelRatio||1,2);W=cv.width=innerWidth*d|0;H=cv.height=innerHeight*d|0}
addEventListener('resize',size);size();
function show(id){document.querySelectorAll('.scr').forEach(s=>s.classList.toggle('on',s.id===id));$('#ui').classList.toggle('on',!!id);document.body.classList.toggle('play',G.mode==='play');
 if(id==='menu')$('#cont').classList.toggle('on',S.u>0);
 if(id==='chapters')$('#chl').innerHTML=Levels.CH.map((c,i)=>{const dn=S.done.slice(i*7,i*7+7).filter(Boolean).length;return`<button data-a="ch" data-i="${i}" ${i*7>S.u?'disabled':''}>Chapter ${'I'.repeat(i+1)} · ${c.n}<small>${i*7>S.u?'locked':dn+' / 7'}</small></button>`}).join('');
 if(id==='stages'){const c=Levels.CH[curCh];$('#sth').textContent='Chapter '+'I'.repeat(curCh+1)+' · '+c.n;$('#stl').innerHTML=c.s.map((n,k)=>{const i=curCh*7+k,st=S.done[i]?'done':i>S.u?'locked':'open';return`<button data-a="st" data-i="${i}" class="${st}" ${st==='locked'?'disabled':''}>${k+1}. ${n}<small>${st==='done'?'completed':st}</small></button>`}).join('')}}
let curCh=0;
function banner(i){const c=$('#card'),L=LV[i];c.innerHTML='Chapter '+'I'.repeat(L.ch+1)+' · '+Levels.CH[L.ch].n+'<br><b>'+(i%7+1)+'. '+L.name+'</b>';c.classList.remove('on');void c.offsetWidth;c.classList.add('on')}
function bake(m){const c=document.createElement('canvas');c.width=c.height=m.W*T;const x=c.getContext('2d');x.fillStyle='#070707';x.fillRect(0,0,c.width,c.height);
 for(let i=0;i<m.g.length;i++)if(m.g[i]){x.fillStyle='#242424';x.fillRect(i%m.W*T,(i/m.W|0)*T,T,T)}
 for(let i=0;i<m.W*m.W*14;i++){x.fillStyle=Math.random()<.5?'rgba(0,0,0,.25)':'rgba(255,255,255,.04)';x.fillRect(Math.random()*c.width,Math.random()*c.height,2,2)}return c}
function start(i){Audio.init();Audio.resume();Audio.dead=false;const L=LV[i],m=Maze.gen(L.n,L.s,L.b,L.st,L.rm),d=Maze.bfs(m,m.goal);
 G={mode:'play',lv:i,cfg:L,li:1,dr:Levels.drain(i,d[m.start]),m,d,maxd:d[m.start],px:(m.start%m.W+.5)*T,py:((m.start/m.W|0)+.5)*T,gx:(m.goal%m.W+.5)*T,gy:((m.goal/m.W|0)+.5)*T,fuel:100,trail:[],full:[],tt:0,best:d[m.start],prev:d[m.start],tr:0,t:0,end:0,fl:1,prox:0,img:bake(m),shown:0};show(null);banner(i)}
const free=(m,x,y)=>{const r=9;return!(m.g[((y-r)/T|0)*m.W+((x-r)/T|0)]||m.g[((y-r)/T|0)*m.W+((x+r)/T|0)]||m.g[((y+r)/T|0)*m.W+((x-r)/T|0)]||m.g[((y+r)/T|0)*m.W+((x+r)/T|0)])};
function mv(dx,dy){const g=G;if(free(g.m,g.px+dx,g.py+dy)){g.px+=dx;g.py+=dy}}
// Stereo guidance: follow the BFS route (3 tiles ahead) and express it relative to the messenger's heading.
function nextDir(g){const N=g.m.W;let t=(g.py/T|0)*N+(g.px/T|0);if(g.d[t]<0)return null;for(let k=0;k<3&&g.d[t]>0;k++){let b=t,bd=g.d[t];for(const o of[1,-1,N,-N]){const n=t+o;if(g.d[n]>=0&&g.d[n]<bd){bd=g.d[n];b=n}}t=b}return[(t%N+.5)*T-g.px,((t/N|0)+.5)*T-g.py]}
function update(dt){const g=G;if(g.mode==='menu'){g.t+=dt;if(Audio.ctx){Audio.dead=false;Audio.update(.1,0,.25,0)}return}
 if(g.mode==='pause')return;g.t+=dt;
 if(g.mode==='play'){
  let ix=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+jv.x,iy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+jv.y,l=Math.hypot(ix,iy);if(l>1){ix/=l;iy/=l}{const q=Math.min(1,Math.hypot(ix,iy)),wx=ix+2*iy,wy=2*iy-ix,wl=Math.hypot(wx,wy)||1;ix=wx/wl*q;iy=wy/wl*q}// screen input -> isometric world
  mv(ix*112*dt,0);mv(0,iy*112*dt);g.fuel-=g.dr*dt;
  if(g.t-g.tt>.12){g.tt=g.t;g.trail.push({x:g.px,y:g.py,t:g.t});g.full.push([g.px,g.py]);while(g.trail.length&&g.t-g.trail[0].t>13)g.trail.shift()}
  let d=g.d[(g.py/T|0)*g.m.W+(g.px/T|0)];if(d<0)d=g.prev;const dd=g.prev-d;g.prev=d;
  if(dd>0)g.tr+=(1-g.tr)*.35;else if(dd<0)g.tr+=(-1-g.tr)*.35;else g.tr*=1-dt*.4;
  if(d<g.best-4){g.best=d;g.fuel=Math.min(100,g.fuel+3);g.pulse=1;vib(15)}
  const p=g.prox=Math.pow(Math.max(0,1-d*S.sens/(g.maxd*1.1)),1.5),dx=g.gx-g.px,dy=g.gy-g.py,eu=Math.hypot(dx,dy);
  const nd=nextDir(g),fa=g.cam?g.cam.face:1.57;let tp=0,fr=1;if(nd&&(nd[0]||nd[1])){const a=Math.atan2((nd[0]+nd[1])/2,nd[0]-nd[1])-fa;tp=.9*Math.sin(a);fr=.8+.2*Math.cos(a)}g.pan=(g.pan||0)+(tp-(g.pan||0))*Math.min(1,dt*3);
  Audio.update(p,g.pan,Math.max(0,Math.min(1,(.15+p*.75+.25*g.tr)*fr)),Math.max(0,-g.tr));
  $('#fuel i').style.transform=`scaleX(${Math.max(0,g.fuel)/100})`;
  if(eu<14){g.mode='win';g.end=0;Audio.arrival();vib([60,40,120]);S.u=Math.max(S.u,Math.min(g.lv+1,20));S.done[g.lv]=1;save()}
  else if(g.fuel<=0){g.mode='lose';g.end=0;Audio.fade()}
 }else{g.end+=dt;
  if(g.mode==='win'&&g.end>7&&!g.shown){g.shown=1;if(g.lv%7===6){const c=g.lv/7|0;$('#cht').textContent='Chapter '+'I'.repeat(c+1)+' complete: '+Levels.CH[c].n;$('#nch').style.display=g.lv>=20?'none':'';show('chap')}else{$('#next').style.display='';show('win')}}
  if(g.mode==='lose'&&g.end>3&&!g.shown){g.shown=1;show('lose')}}}
// Adaptive torch: intensity/radius fall as the player nears the door (smoothed), never below a minimum radius.
function lightR(g){const f=Math.max(0,g.fuel)/100,e=Math.hypot(g.gx-g.px,g.gy-g.py)/T,tg=g.mode!=='play'?1:e>=10?1:e>=7?.75+.25*(e-7)/3:e>=4.5?.45+.3*(e-4.5)/2.5:e>=2.5?.2+.25*(e-2.5)/2:e>=1?.12+.08*(e-1)/1.5:.12;g.li+=(tg-g.li)*.04;
 const a=.025+(1-f)*(1-f)*.2+(1-g.li)*.14;let r=Math.max(42,(34+150*Math.sqrt(f))*(.4+.6*g.li));
 let k=1+Math.sin(g.t*13)*a*.5+(Math.random()-.5)*a;if((f<.25&&Math.random()<.03*(1-f/.25))||(g.li<.5&&Math.random()<.02*(1-g.li)))k*=.6;g.fl+=(k-g.fl)*.4;r*=g.fl;
 if(g.mode==='lose')r=40*Math.max(0,1-g.end/2.5);
 if(g.mode==='win')r+=Math.min(1,g.end/5)*T*40;return r}
function glow(cx,cy,R,rgb,a){const q=X.createRadialGradient(cx,cy,0,cx,cy,R);q.addColorStop(0,`rgba(${rgb},${a})`);q.addColorStop(1,`rgba(${rgb},0)`);X.fillStyle=q;X.fillRect(0,0,W,H)}
function dustDraw(dt){X.fillStyle='rgba(214,208,197,.18)';for(const p of dust){p.y-=p.v*dt;p.x+=Math.sin(G.t*.5+p.s*9)*.003*dt;if(p.y<0)p.y=1;X.fillRect(p.x%1*W,p.y*H,p.s,p.s)}}
function draw(dt){Render.draw(X,G,S,W,H,dt,G.m?lightR(G):0)}
function frame(now){const dt=Math.min(.05,(now-last)/1000||0);last=now;update(dt);draw(dt);requestAnimationFrame(frame)}
function pause(){if(G.mode==='play'){G.mode='pause';Audio.suspend();show('pause')}}
function resume(){if(G.mode==='pause'){G.mode='play';Audio.resume();show(null)}}
function menu(){G={mode:'menu',t:G.t};Audio.dead=false;Audio.resume();show('menu')}
const act={begin:()=>start(0),cont:()=>start(Math.min(S.u,20)),levels:()=>show('chapters'),ch:b=>{curCh=+b.dataset.i;show('stages')},st:b=>start(+b.dataset.i),nch:()=>start(G.lv+1),selst:()=>{curCh=G.lv/7|0;show('stages')},how:()=>show('how'),sound:()=>show('sound'),
 back:()=>G.mode==='pause'?show('pause'):show('menu'),lv:b=>start(+b.dataset.i),next:()=>start(G.lv+1),again:()=>start(G.lv),menu,pause,resume};
$('#ui').addEventListener('click',e=>{const b=e.target.closest('button');if(b)act[b.dataset.a](b)});
$('#pb').addEventListener('click',pause);
const bind=(id,k,prop,fn)=>{const el=$('#'+id);el[prop]=S[k];el.addEventListener('input',()=>{S[k]=prop==='checked'?el.checked:+el.value;fn&&fn();save()})};
bind('vol','vol','value',()=>{Audio.vol=S.vol;Audio.setVol()});bind('sens','sens','value');
bind('mute','mute','checked',()=>{Audio.muted=S.mute;Audio.setVol()});bind('bar','bar','checked',()=>$('#fuel').style.opacity=S.bar?.55:0);bind('assist','assist','checked');
$('#fuel').style.opacity=S.bar?.55:0;
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=1;if(k.startsWith('arrow'))e.preventDefault();if(k==='escape'||k==='p')G.mode==='pause'?resume():pause()});
addEventListener('keyup',e=>delete keys[e.key.toLowerCase()]);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
const jy=$('#joy'),kn=jy.firstElementChild;let jid=null,jc;
addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||G.mode!=='play'||jid!==null||e.target.closest('button'))return;jid=e.pointerId;jc={x:e.clientX,y:e.clientY};jy.style.cssText=`display:block;left:${jc.x-50}px;top:${jc.y-50}px`});
addEventListener('pointermove',e=>{if(e.pointerId!==jid)return;let x=(e.clientX-jc.x)/45,y=(e.clientY-jc.y)/45,l=Math.hypot(x,y);if(l>1){x/=l;y/=l}jv.x=x;jv.y=y;kn.style.transform=`translate(${x*35}px,${y*35}px)`});
const up=e=>{if(e.pointerId!==jid)return;jid=null;jv.x=jv.y=0;jy.style.display='none';kn.style.transform=''};
addEventListener('pointerup',up);addEventListener('pointercancel',up);
if('serviceWorker'in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('service-worker.js').catch(()=>{});
window.__echo={get G(){return G}};// debug hook for tests
show('menu');requestAnimationFrame(frame);
})();
