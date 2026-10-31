// 21 stages in 3 chapters. Each stage: grid size n, fixed seed, braid (loops), straight (corridor length bias), rm (open rooms), ec (echo chance), dr (base drain).
const Levels=(()=>{
const CH=[{n:'The Spiral',s:['The Entrance','First Echo','The Narrow Passage','Fading Footsteps','The Broken Spiral','The Silent Room','The Last Turn']},
 {n:'The Fork',s:['Two Paths','The False Direction','Forgotten Corridors','The Watchers','The Hollow Chamber','The Lost Route','Beyond the Fork']},
 {n:'The Web',s:['The Descent','Tangled Paths','The Shifting Echo','The Forgotten','The Endless Web','The Final Signal','The Last Delivery']}];
const C=[
 [6,0,0.8,0,0,307],
 [7,0,0.75,0,0.25,1511],
 [8,0,0.85,0,0,1399],
 [9,0,0.7,0,0.3,363],
 [10,0.02,0.6,0,0.3,636],
 [10,0.02,0.6,1,0.35,734],
 [11,0.03,0.55,0,0.35,2757],
 [10,0.04,0.4,0,0.4,349],
 [10,0.05,0.35,0,0.45,2757],
 [11,0.06,0.35,0,0.45,475],
 [12,0.06,0.3,0,0.8,342],
 [12,0.07,0.3,1,0.5,958],
 [13,0.08,0.3,0,0.55,496],
 [14,0.08,0.25,1,0.6,1077],
 [13,0.05,0.2,0,0.6,517],
 [14,0.06,0.2,1,0.65,76],
 [14,0.07,0.15,1,0.8,2554],
 [15,0.08,0.15,1,0.7,2274],
 [16,0.08,0.15,2,0.8,2246],
 [17,0.09,0.1,2,0.85,307],
 [18,0.1,0.1,3,0.9,1553]];
const stages=C.map((c,i)=>({i,ch:i/7|0,name:CH[i/7|0].s[i%7],n:c[0],b:c[1],st:c[2],rm:c[3],ec:c[4],s:c[5]}));
// Fuel pressure: slack = fuel time / ideal route time, tightening from 4.6x (stage 1) to 2.2x (stage 21).
const drain=(i,pathLen)=>Math.max(.45,Math.min(1.2,100/((4.6-.12*i)*pathLen/3.5)));
return{CH,stages,drain}})();
