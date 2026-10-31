// Isometric 2.5D renderer. Presentation only: reads game state, never changes maze, collision, audio or fuel logic.
// Projection: screen = ((x-y)*sc, (x+y)/2*sc - z*sc) from maze-world pixels. Input is rotated by the inverse in main.js.
const Render=(()=>{
const T=32,LVS=[{h:15,dark:.94,echo:0,deb:.04},{h:26,dark:.965,echo:.5,deb:.07},{h:22,dark:.985,echo:.75,deb:.1}];
const hash=(i,j,k)=>{let h=Math.imul(i*374761393^j*668265263^k*1442695041,1274126177);h^=h>>>13;h=Math.imul(h,1597334677);return((h^h>>>16)>>>0)/4294967296};
const dust=Array.from({length:110},()=>({x:Math.random(),y:Math.random(),v:.01+Math.random()*.02,s:.8+Math.random()*1.6}));
let X,sc,ox,oy;
const P=(x,y,z=0)=>[ox+(x-y)*sc,oy+(x+y)*.5*sc-z*sc];
const quad=(i,j,z)=>[P(i*T,j*T,z),P((i+1)*T,j*T,z),P((i+1)*T,(j+1)*T,z),P(i*T,(j+1)*T,z)];
function poly(a,f){X.beginPath();a.forEach((p,k)=>k?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.closePath();X.fillStyle=f;X.fill()}
function line(a,b,c,w){X.strokeStyle=c;X.lineWidth=w;X.beginPath();X.moveTo(a[0],a[1]);X.lineTo(b[0],b[1]);X.stroke()}
const lw=k=>Math.max(1,sc*k);
const isW=(m,i,j)=>i<0||j<0||i>=m.W||j>=m.W||m.g[j*m.W+i]===1;
const lp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
function floor(i,j,L,m){const h=k=>hash(i,j,k),z=(h(10)-.5)*3,ins=.03,dep=5+h(11)*6;
 const c=[[0,0],[1,0],[1,1],[0,1]].map(([a,b],n)=>[(i+(a?1-ins:ins)+(h(20+n)-.5)*.08)*T,(j+(b?1-ins:ins)+(h(30+n)-.5)*.08)*T]);
 const tp=c.map(p=>P(p[0],p[1],z)),bt=c.map(p=>P(p[0],p[1],z-dep));
 poly([bt[3],bt[2],tp[2],tp[3]],'#111113');poly([bt[2],bt[1],tp[1],tp[2]],'#0b0b0c');
 const v=34+h(0)*16|0,tn=h(12)*6|0;X.beginPath();const q0=lp(tp[3],tp[0],.8);X.moveTo(q0[0],q0[1]);
 for(let n=0;n<4;n++){const nx=tp[(n+1)%4],e1=lp(tp[n],nx,.2),e2=lp(tp[n],nx,.8);X.quadraticCurveTo(tp[n][0],tp[n][1],e1[0],e1[1]);X.lineTo(e2[0],e2[1])}
 X.closePath();X.fillStyle=`rgb(${v},${v},${v+tn})`;X.fill();X.strokeStyle='rgba(20,20,22,.6)';X.lineWidth=lw(1);X.stroke();
 line(tp[3],tp[0],'rgba(85,85,89,.75)',lw(1));line(tp[0],tp[1],'rgba(85,85,89,.6)',lw(1));
 const f=k=>h(k)*.3,W2=(x,y)=>P((i+x)*T,(j+y)*T,z);
 if(h(13)<.5){const p=W2(.3+f(40),.3+f(41));X.fillStyle='rgba(0,0,0,.14)';X.beginPath();X.ellipse(p[0],p[1],9*sc,4*sc,0,0,7);X.fill()}
 const u=h(1);
 if(u<.16){const a=W2(.2+f(2),.2),b=W2(.5+f(3),.6+f(4));line(a,b,'rgba(5,5,6,.75)',lw(.8));line(b,W2(.8,.7),'rgba(5,5,6,.55)',lw(.6))}
 else if(u<.32)line(W2(.3,.3+f(2)),W2(.7,.4+f(3)),'rgba(85,85,89,.35)',lw(.5));
 if(h(14)<.06){const k=h(15)*4|0;poly([tp[k],lp(tp[k],tp[(k+1)%4],.35),lp(tp[k],tp[(k+3)%4],.35)],'#030303')}
 if(h(5)<L.deb){const p=W2(.3+f(6),.3+f(7));X.fillStyle='rgba(12,12,13,.9)';X.fillRect(p[0],p[1],5*sc,3*sc)}
 for(const[dx,dy]of[[0,-1],[1,0],[0,1],[-1,0]])if(isW(m,i+dx,j+dy)){const x0=dx>0?i+.65:i,x1=dx<0?i+.35:i+1,y0=dy>0?j+.65:j,y1=dy<0?j+.35:j+1;
  poly([P(x0*T,y0*T,z),P(x1*T,y0*T,z),P(x1*T,y1*T,z),P(x0*T,y1*T,z)],'rgba(0,0,0,.38)')}}
function wall(i,j,h){const H=h*(.88+hash(i,j,9)*.24),t=quad(i,j,H),b=quad(i,j,0),f=quad(i,j,H*.35);
 poly([b[3],b[2],t[2],t[3]],'#101012');poly([b[2],b[1],t[1],t[2]],'#0a0a0b');
 poly([b[3],b[2],f[2],f[3]],'rgba(0,0,0,.35)');poly([b[2],b[1],f[1],f[2]],'rgba(0,0,0,.4)');
 const v=21+hash(i,j,8)*6|0;poly(t,`rgb(${v},${v},${v+2})`);X.strokeStyle='rgba(85,85,89,.45)';X.lineWidth=lw(1);X.stroke();
 if(hash(i,j,7)<.2)line(P((i+.2)*T,(j+.3)*T,H),P((i+.6)*T,(j+.7)*T,H),'rgba(0,0,0,.5)',lw(.8));
 if(hash(i,j,6)<.25)line(P((i+.3)*T,(j+1)*T,H*.9),P((i+.35)*T,(j+1)*T,H*.3),'rgba(60,60,64,.35)',lw(.6))}
// ---- procedural four-direction sprite sheets (dir 0 front,1 back,2 left,3 right; 6 walk + 4 idle frames), baked once
const K=2,CW=32,CH=40;let SH,SE;
function frame(g,d,ph,walk,col,lan){const s=Math.sin(ph*6.283),bob=walk?Math.abs(s)*1.5:s*.5,sw=walk?s*1.6:s*.5,fx=16,hy=35,ty=hy-17,side=d>=2,el=(x,y,rx,ry)=>{g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill()};
 g.save();if(d===3){g.translate(CW,0);g.scale(-1,1)}
 g.fillStyle='#8f8f8f';const fl=walk?Math.max(0,s)*1.6:0,fr=walk?Math.max(0,-s)*1.6:0,st=walk?s*2.5:0;
 if(side){el(fx-2+st,hy+.5-fl,2.2,1.2);el(fx+1-st,hy+.5-fr,2.2,1.2)}else{el(fx-2.5,hy+.5-fl,2,1.2);el(fx+2.5,hy+.5-fr,2,1.2)}
 g.fillStyle=col;g.beginPath();
 if(!side){g.moveTo(fx-6.5+sw,hy-bob);g.lineTo(fx+6.5-sw*.6,hy-bob);g.lineTo(fx+3.6,ty);g.lineTo(fx-3.6,ty)}
 else{const tr=walk?3+s*1.2:.6+s*.3;g.moveTo(fx-3.6,hy-bob);g.lineTo(fx+4+tr,hy-bob);g.lineTo(fx+2.4,ty);g.lineTo(fx-2,ty)}
 g.closePath();g.fill();g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=.6;g.beginPath();g.moveTo(fx,ty+2);g.lineTo(fx+sw*.5,hy-bob);g.stroke();
 g.fillStyle=col;g.beginPath();g.arc(side?fx-.8:fx,ty-4,4.6,0,7);g.fill();g.beginPath();
 if(!side){g.moveTo(fx-4.5,ty-4);g.lineTo(fx+sw*.2,ty-12.5);g.lineTo(fx+4.5,ty-4)}else{g.moveTo(fx-4,ty-5);g.lineTo(fx+4.5,ty-11);g.lineTo(fx+3,ty-2)}
 g.fill();g.fillStyle='rgba(5,5,5,.85)';
 if(d===0)el(fx,ty-3.5,2.4,3);else if(d>1)el(fx-3,ty-3.5,1.5,2.6);else{g.strokeStyle='rgba(0,0,0,.35)';g.beginPath();g.moveTo(fx,ty-8);g.lineTo(fx,ty-1);g.stroke()}
 const th=walk?s*.5:s*.15,hd=side?[fx-5.5,ty+7.5]:[fx+7.5,ty+8];
 g.strokeStyle=col;g.lineWidth=1.6;g.beginPath();g.moveTo(side?fx-.5:fx+3.4,ty+2);g.lineTo(hd[0],hd[1]);g.stroke();
 const lx=hd[0]+Math.sin(th)*5,ly=hd[1]+Math.cos(th)*5;g.strokeStyle='rgba(200,200,200,.6)';g.lineWidth=.6;g.beginPath();g.moveTo(hd[0],hd[1]);g.lineTo(lx,ly);g.stroke();
 if(lan){g.translate(lx,ly);g.rotate(th);g.fillStyle='#EAEAEA';g.fillRect(-1.7,0,3.4,4.6)}
 g.restore();return d===3?[CW-lx,ly+2.3]:[lx,ly+2.3]}
function bake(col,lan){const cv=document.createElement('canvas');cv.width=10*CW*K;cv.height=4*CH*K;const g=cv.getContext('2d'),pos=[];
 for(let d=0;d<4;d++){pos[d]=[];for(let f=0;f<10;f++){g.save();g.setTransform(K,0,0,K,f*CW*K,d*CH*K);pos[d][f]=frame(g,d,f<6?f/6:(f-6)/4,f<6,col,lan);g.restore()}}return{cv,pos}}
function spr(sh,x,y,S,d,f,al){X.globalAlpha=al;X.drawImage(sh.cv,f*CW*K,d*CH*K,CW*K,CH*K,x-16*S,y-36*S,CW*S,CH*S);X.globalAlpha=1;const p=sh.pos[d][f];return[x+(p[0]-16)*S,y+(p[1]-36)*S]}
const dirOf=a=>Math.abs(a)<Math.PI/4?3:Math.abs(a)>=3*Math.PI/4?2:a>0?0:1;
function shadow(x,y,S){X.fillStyle='rgba(0,0,0,.55)';X.beginPath();X.ellipse(x,y,9*S,4*S,0,0,7);X.fill()}
// ---- destination: ancient stone doorway standing on the goal tile (visual only, no collision)
let dc=null;
function door(g,rev,rv,prox,t){const m=g.m,N=m.W,i=m.goal%N,j=m.goal/N|0,ax=!isW(m,i,j+1)||!isW(m,i,j-1),HT=40;
 const Qd=(u,v,d)=>ax?P((i+u)*T,(j+.5+d)*T,v):P((i+.5+d)*T,(j+u)*T,v),Q=(u,v)=>Qd(u,v,.1);
 poly([Q(.06,0),Q(.94,0),Q(.94,HT+8),Q(.06,HT+8)],'#161618');
 for(const[a,b]of[[.06,.26],[.74,.94]]){poly([Qd(b,0,.1),Qd(b,0,-.1),Qd(b,HT,-.1),Qd(b,HT,.1)],'#121214');poly([Q(a,0),Q(b,0),Q(b,HT),Q(a,HT)],'#1c1c1f')}
 poly([Qd(.94,HT+8,.1),Qd(.94,HT+8,-.1),Qd(.94,0,-.1),Qd(.94,0,.1)],'#0e0e10');
 poly([Qd(.04,HT+8,.1),Qd(.96,HT+8,.1),Qd(.96,HT+8,-.1),Qd(.04,HT+8,-.1)],'#232326');poly([Q(.04,HT),Q(.96,HT),Q(.96,HT+8),Q(.04,HT+8)],'#1f1f22');
 poly([Q(.3,HT+8),Q(.7,HT+8),Q(.5,HT+16)],'#1c1c1f');
 const pts=[Q(.26,0),Q(.74,0)];for(let k=0;k<=8;k++){const a=Math.PI*k/8;pts.push(Q(.5+.24*Math.cos(a),26+11*Math.sin(a)))}
 poly(pts,'#040404');const op=.02+.95*rv;poly(pts,`rgba(234,234,234,${op})`);
 if(rev>.02){X.globalAlpha=rev*.45;const c='rgba(150,150,156,.65)';
  for(let k=0;k<4;k++)for(const o of[.1,.78]){line(Q(o,8+k*8),Q(o+.06,12+k*8),c,lw(.8));line(Q(o+.06,12+k*8),Q(o+.12,8+k*8),c,lw(.8))}
  for(let k=0;k<12;k++){const a=k*Math.PI/6,b=a+Math.PI/6;line(Q(.5+.09*Math.cos(a),44+.09*Math.sin(a)*3.4),Q(.5+.09*Math.cos(b),44+.09*Math.sin(b)*3.4),c,lw(.7))}
  line(Q(.5,40.5),Q(.5,47.5),c,lw(.7));line(Q(.78,4),Q(.83,20),'rgba(0,0,0,.7)',lw(.9));line(Q(.83,20),Q(.8,30),'rgba(0,0,0,.7)',lw(.9));line(Q(.14,36),Q(.2,28),'rgba(0,0,0,.6)',lw(.8));X.globalAlpha=1}
 dc=Q(.5,20)}
function glow(x,y,R,a,ry){X.save();X.translate(x,y);X.scale(1,ry);const q=X.createRadialGradient(0,0,0,0,0,R);q.addColorStop(0,`rgba(234,234,234,${a})`);q.addColorStop(1,'rgba(234,234,234,0)');X.fillStyle=q;X.fillRect(-R,-R,2*R,2*R);X.restore()}
function dustDraw(W,H,dt,n,a,t){X.fillStyle=`rgba(166,166,166,${a})`;for(let k=0;k<n;k++){const p=dust[k];p.y-=p.v*dt;p.x+=Math.sin(t*.5+p.s*9)*.003*dt;if(p.y<0)p.y=1;X.fillRect(((p.x%1)+1)%1*W,p.y*H,p.s,p.s)}}
let MM=null,mk='',mt=0,msil=[];
function menu(g,W,H,dt){if(!SH){SH=bake('#DADADA',true);SE=bake('#A6A6A6',false)}
 if(!MM)MM=Maze.gen(8,5,.08,.4,1);const N=MM.W,full=N*T;sc=Math.max(W,H)*.85/full;const dr=Math.sin(g.t*.05)*14;ox=W/2;oy=H*.5-(full/2+dr)*sc;
 if(mk!==W+'x'+H){mk=W+'x'+H;const op=[];for(let j=0;j<N;j++)for(let i=0;i<N;i++)if(!MM.g[j*N+i]){const p=P((i+.5)*T,(j+.5)*T);op.push([i,j,Math.hypot(p[0]-W*(H>W?.3:.26),p[1]-H*(H>W?.955:.8))])}
  op.sort((a,b)=>a[2]-b[2]);mt=op[0];msil=[.2,.5,.8].map(f=>{const o=op.filter(p=>{const q=P((p[0]+.5)*T,(p[1]+.5)*T);return p[2]>Math.min(W,H)*.45&&q[0]>W*.12&&q[0]<W*.88&&q[1]>H*.14&&q[1]<H*.84&&Math.abs(q[0]-W/2)>W*.2});return o[(o.length*f)|0]})}
 const L=LVS[1],vis=(i,j)=>{const p=P((i+.5)*T,(j+.5)*T);return p[0]>-90*sc&&p[0]<W+90*sc&&p[1]>-120*sc&&p[1]<H+120*sc};
 for(let j=0;j<N;j++)for(let i=0;i<N;i++)if(!MM.g[j*N+i]&&vis(i,j))floor(i,j,L,MM);
 const mx=(mt[0]+.5)*T,my=(mt[1]+.5)*T,SS=sc*2.2;let lpn=null;
 for(let s=0;s<=2*N;s++){if(!lpn&&(mx+my)/T<s+1){const p=P(mx,my);shadow(p[0],p[1],SS);lpn=spr(SH,p[0],p[1],SS,1,6+(g.t*2.5|0)%4,1)}
  for(let i=Math.max(0,s-N+1);i<=Math.min(N-1,s);i++){const j=s-i;if(MM.g[j*N+i]&&vis(i,j))wall(i,j,26)}}
 if(!lpn){const p=P(mx,my);lpn=spr(SH,p[0],p[1],SS,1,6,1)}
 const lx=lpn[0],ly=lpn[1],R=Math.min(W,H)*.62*(1+Math.sin(g.t*9)*.008+(Math.random()-.5)*.02);
 for(let b=0;b<4;b++)glow(W*(.15+.25*b)+Math.sin(g.t*.1+b)*W*.05,H*(.65+.1*Math.cos(g.t*.13+b*2)),Math.min(W,H)*.4,.03,.5);
 dustDraw(W,H,dt,90,.25,g.t);
 X.globalCompositeOperation='lighter';glow(lx,ly,R*.3,.45,.55);glow(lx,ly,R*.9,.14,.55);X.globalCompositeOperation='source-over';
 X.save();X.translate(lx,ly);X.scale(1,.55);const q=X.createRadialGradient(0,0,R*.05,0,0,R);q.addColorStop(0,'rgba(3,3,3,0)');q.addColorStop(.5,'rgba(3,3,3,.3)');q.addColorStop(1,'rgba(3,3,3,.9)');X.fillStyle=q;X.fillRect(-W*3,-H*6,W*6,H*12);X.restore();
 msil.forEach((o,k)=>{if(!o)return;const a=Math.max(0,Math.sin(g.t*.25+k*2.1))*.3,p=P((o[0]+.5)*T,(o[1]+.5)*T);if(a>.01)spr(SE,p[0],p[1],sc*2,0,6+(g.t*.8|0)%4,a)})}
function echoes(g,dt,L,flick){const e=g.ech=g.ech||[],m=g.m;g.en=(g.en||4)-dt;
 const spawn=(dmin,dmax,life)=>{for(let n=0;n<30;n++){const a=Math.random()*6.28,d=dmin+Math.random()*(dmax-dmin),i=(g.px/T+Math.cos(a)*d)|0,j=(g.py/T+Math.sin(a)*d)|0;
  if(i>0&&j>0&&i<m.W&&j<m.W&&!m.g[j*m.W+i]&&(j*m.W+i)!==m.goal){e.push({x:(i+.5)*T,y:(j+.5)*T,a:0,life,f:Math.random()*6.28});return}}};
 if(g.mode==='play'&&g.cfg.ec){if(g.en<=0){g.en=7+Math.random()*10;if(Math.random()<g.cfg.ec&&e.length<2)spawn(4.5,8,5+Math.random()*6)}
  if(flick&&!g.wasF&&Math.random()<.5&&e.length<2)spawn(3,5,.9)}
 g.wasF=flick;
 for(let k=e.length-1;k>=0;k--){const o=e[k];o.a+=dt;if(Math.hypot(o.x-g.px,o.y-g.py)<T*3.2)o.life=Math.min(o.life,o.a+.2);if(o.a>o.life+.6)e.splice(k,1)}}
function draw(ctx,g,S,W,H,dt,r){X=ctx;X.setTransform(1,0,0,1,0,0);X.fillStyle='#030303';X.fillRect(0,0,W,H);
 if(!g.m){menu(g,W,H,dt);return}
 const L=LVS[g.lv/7|0],m=g.m,N=m.W,win=g.mode==='win',rv=win?Math.min(1,g.end/5):0,full=N*T;
 if(!g.cam)g.cam={x:g.px,y:g.py,face:Math.PI/2,lx:g.px,ly:g.py};const c=g.cam,k=Math.min(1,dt*6);c.x+=(g.px-c.x)*k;c.y+=(g.py-c.y)*k;
 const dx=g.px-c.lx,dy=g.py-c.ly,mv=g.mode==='play'&&Math.hypot(dx,dy)>.15;
 if(mv){let d=Math.atan2((dx+dy)/2,dx-dy)-c.face;d=Math.atan2(Math.sin(d),Math.cos(d));c.face+=d*Math.min(1,dt*10)}c.lx=g.px;c.ly=g.py;
 sc=Math.min(W,H)/416*(1-.5*rv);const cx=c.x+(full/2-c.x)*rv,cy=c.y+(full/2-c.y)*rv;ox=W/2-(cx-cy)*sc;oy=H*.54-(cx+cy)*.5*sc;
 const ci=g.px/T|0,cj=g.py/T|0,rg=win?N:9,i0=Math.max(0,ci-rg),i1=Math.min(N-1,ci+rg),j0=Math.max(0,cj-rg),j1=Math.min(N-1,cj+rg);
 const vis=(i,j)=>{const p=P((i+.5)*T,(j+.5)*T);return p[0]>-150*sc&&p[0]<W+150*sc&&p[1]>-200*sc&&p[1]<H+200*sc};
 for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)if(!m.g[j*N+i]&&vis(i,j))floor(i,j,L,m);
 if(!win){for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)if(m.g[j*N+i]&&vis(i,j)){const wx=(i+.5)*T-g.px,wy=(j+.5)*T-g.py,d=Math.hypot(wx,wy);if(d>r*1.3||d<1)continue;
  const a=.32*(1-d/(r*1.3)),ux=wx/d*T,uy=wy/d*T;for(let s=1;s<=2;s++){const q=[[i*T,j*T],[(i+1)*T,j*T],[(i+1)*T,(j+1)*T],[i*T,(j+1)*T]].map(p=>P(p[0]+ux*s*.6,p[1]+uy*s*.6));poly(q,`rgba(3,3,3,${a})`)}}}
 echoes(g,dt,L,g.fl<.7);
 if(!SH){SH=bake('#DADADA',true);SE=bake('#A6A6A6',false)}
 const nd=dirOf(c.face);if(c.dir===undefined)c.dir=nd;if(nd!==c.dir){c.pd=c.dir;c.dir=nd;c.ft=.12}c.ft=Math.max(0,(c.ft||0)-dt);
 const fr=mv?(g.t*11|0)%6:6+(g.t*2.5|0)%4,SS=sc*1.5;let lpn=null;const gx=(m.goal%N+.5)*T,gy=(m.goal/N|0)*T+T/2,dist=Math.hypot(g.px-gx,g.py-gy);
 const rev=Math.max(0,Math.min(1,(r*1.15-dist)/(r*.6+1)));
 const ents=[{k:(g.px+g.py)/T,f:()=>{const p=P(g.px,g.py);shadow(p[0],p[1],SS);if(c.ft>0)spr(SH,p[0],p[1],SS,c.pd,fr,c.ft/.12*.9);lpn=spr(SH,p[0],p[1],SS,c.dir,fr,c.ft>0?1-c.ft/.12*.6:1)}},
  {k:(m.goal%N+m.goal/N|0)+1,f:()=>door(g,rev*(g.mode==='play'?g.li:1),rv,g.prox,g.t)}].sort((a,b)=>a.k-b.k);
 let e=0;
 for(let s=i0+j0;s<=i1+j1;s++){while(e<ents.length&&ents[e].k<s+1)ents[e++].f();for(let i=Math.max(i0,s-j1);i<=Math.min(i1,s-j0);i++){const j=s-i;if(m.g[j*N+i]&&vis(i,j))wall(i,j,L.h*(1+(g.lv%7)*.03))}}
 while(e<ents.length)ents[e++].f();
 {const p=P(g.px,g.py);spr(SH,p[0],p[1],SS,c.dir,fr,.2)}
 const lp=lpn;
 const pp=P(g.px,g.py),lx=lp?lp[0]:pp[0],ly=lp?lp[1]:pp[1]-14*sc;
 g.pulse=(g.pulse||0)*.95;const R=Math.max(0,r)*sc*1.1*(1+.12*g.pulse);const I=g.mode==='play'?g.li:1;
 for(let b=0;b<3;b++)glow(lx+Math.sin(g.t*.2+b*2)*R*.4,ly+Math.cos(g.t*.17+b*3)*R*.2,R*.6,.035,.5);
 dustDraw(W,H,dt,60+(g.prox*50|0),.2+.25*g.prox,g.t);
 if(R>2){X.globalCompositeOperation='lighter';glow(lx,ly,R*.3,.5*I,.55);glow(lx,ly,R*.8,.18*I,.55);X.globalCompositeOperation='source-over';
  X.save();X.translate(lx,ly);X.scale(1,.55);const q=X.createRadialGradient(0,0,R*.05,0,0,R),dk=Math.min(.99,L.dark+(g.lv%7)*.003);
  q.addColorStop(0,`rgba(3,3,3,${1-I})`);q.addColorStop(.4,`rgba(3,3,3,${1-.88*I})`);q.addColorStop(.7,`rgba(3,3,3,${1-.5*I})`);q.addColorStop(1,`rgba(3,3,3,${Math.max(dk,1-.04*I)})`);X.fillStyle=q;X.fillRect(-W*3,-H*6,W*6,H*12);X.restore()}
 else{X.fillStyle='#030303';X.fillRect(0,0,W,H)}
 if(R>2&&g.mode==='play'){X.globalCompositeOperation='lighter';glow(lx,ly,38*sc,.045,.55);X.globalCompositeOperation='source-over';if(I<1)spr(SH,pp[0],pp[1],SS,c.dir,fr,.5*(1-I))}// minimum local light, independent of torch intensity
 for(const p of g.trail){const q=P(p.x,p.y);X.fillStyle=`rgba(166,166,166,${(1-(g.t-p.t)/13)*.25})`;X.beginPath();X.ellipse(q[0],q[1],3*sc,1.5*sc,0,0,7);X.fill()}
 if(g.ech&&R>2)for(const o of g.ech){const a=Math.min(1,o.a/.5,Math.max(0,(o.life+.6-o.a)/.6))*.34,q=P(o.x,o.y);if(a>0)spr(SE,q[0],q[1],SS,dirOf(Math.atan2(Math.sin(o.f),Math.cos(o.f))),6+(g.t*.8|0)%4,a)}
 if(dc&&R>2){X.globalCompositeOperation='lighter';glow(dc[0],dc[1],(30+70*rv)*sc*1.5,.04+.5*rv+.1*g.prox*rev,.8);X.globalCompositeOperation='source-over'}
 if(win){const a=rv;X.strokeStyle=`rgba(234,234,234,${.5*a})`;X.lineWidth=lw(2);X.beginPath();g.full.forEach((p,n)=>{const q=P(p[0],p[1]);n?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1])});X.stroke();
  }
 if(S.assist&&g.mode==='play'){const a=Math.atan2((g.gx-g.px)*.5+(g.gy-g.py)*.5,(g.gx-g.px)-(g.gy-g.py)),e2=Math.min(W,H)*.42;X.fillStyle=`rgba(234,234,234,${.15+.3*g.prox})`;X.beginPath();X.arc(W/2+Math.cos(a)*e2,H/2+Math.sin(a)*e2,10,0,7);X.fill()}}
return{draw}})();
