// Procedural guide signal: drone + melodic motif, shaped by distance (gain), clarity (lowpass/detune) and direction (stereo pan).
const Audio={ctx:null,vol:.7,muted:false,p:0,step:0,dead:false,
SC:[220,261.63,293.66,329.63,392,440,523.25,587.33],
MO:[0,-1,2,-1,4,-1,3,2,1,-1,2,-1,0,-1,-1,-1],
init(){if(this.ctx)return;const C=this.ctx=new(window.AudioContext||window.webkitAudioContext)();
 this.m=C.createGain();this.m.gain.value=this.muted?0:this.vol;this.m.connect(C.destination);
 this.pan=C.createStereoPanner();this.pan.connect(this.m);
 this.g=C.createGain();this.g.gain.value=0;this.g.connect(this.pan);
 this.lp=C.createBiquadFilter();this.lp.type='lowpass';this.lp.Q.value=2;this.lp.frequency.value=300;this.lp.connect(this.g);
 this.dr=[[55,'sawtooth',.1],[55.35,'sawtooth',.1],[82.4,'sine',.3],[110,'triangle',.07]].map(([f,t,v])=>{const o=C.createOscillator(),a=C.createGain();o.type=t;o.frequency.value=f;a.gain.value=v;o.connect(a);a.connect(this.lp);o.start();return o});
 this.iv=setInterval(()=>this.tick(),320)},
tone(f,v,d,delay=0,type='sine'){const C=this.ctx,t=C.currentTime+delay,o=C.createOscillator(),a=C.createGain();o.type=type;o.frequency.value=f;
 a.gain.setValueAtTime(0,t);a.gain.linearRampToValueAtTime(v,t+.03);a.gain.exponentialRampToValueAtTime(.001,t+d);
 o.connect(a);a.connect(this.lp);o.start(t);o.stop(t+d+.1);o.onended=()=>{o.disconnect();a.disconnect()}},
tick(){const C=this.ctx;if(!C||C.state!=='running'||this.dead)return;const p=this.p,s=this.step++%16,n=this.MO[s];
 if(p<.18||n<0&&!(p>.75&&s%4==2))return;
 if(p<.45){if(s%8==0||(s%4==0&&Math.random()<.4))this.tone(this.SC[n],.25,1.6)}
 else if(p<.75){this.tone(this.SC[n],.45,1.4);this.tone(this.SC[n]*2,.12,1,0,'triangle')}
 else{if(n>=0){this.tone(this.SC[n],.55,1.6);this.tone(this.SC[n]*2,.2,1.2,0,'triangle');this.tone(this.SC[n]*1.5,.1,1.2)}
  if(s%8==0)this.tone(110,.4,2.4);if(s%4==2)this.tone(this.SC[(n<0?5:n)]*4,.06,.8)}},
update(p,pan,clar,wrong){if(!this.ctx)return;const t=this.ctx.currentTime;this.p=p;
 this.g.gain.setTargetAtTime(.03+.85*p,t,.15);this.pan.pan.setTargetAtTime(pan,t,.1);
 this.lp.frequency.setTargetAtTime(220+5500*clar*clar,t,.2);
 this.dr.forEach((o,i)=>o.detune.setTargetAtTime(wrong*Math.sin(t*2.1+i)*60,t,.2))},
arrival(){if(!this.ctx)return;this.dead=true;const t=this.ctx.currentTime;this.g.gain.setTargetAtTime(.9,t,.3);this.lp.frequency.setTargetAtTime(7000,t,.3);this.pan.pan.setTargetAtTime(0,t,.5);
 [[220,0],[329.63,.5],[392,1],[440,1.5],[523.25,2.2],[659.25,2.9],[880,3.6]].forEach(([f,d])=>this.tone(f,.5,3,d));
 [220,277.18,329.63,440,554.37].forEach(f=>this.tone(f,.35,5,4.4,'triangle'))},
fade(){if(!this.ctx)return;this.dead=true;this.g.gain.setTargetAtTime(0,this.ctx.currentTime,.7)},
setVol(){if(this.ctx)this.m.gain.setTargetAtTime(this.muted?0:this.vol,this.ctx.currentTime,.05)},
resume(){if(this.ctx)this.ctx.resume()},suspend(){if(this.ctx)this.ctx.suspend()}};
