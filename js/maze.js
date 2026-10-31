// Seeded maze generation (recursive backtracker + optional braiding) and BFS pathfinding.
const Maze={
rng(s){return()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}},
gen(n,seed,braid,straight=0,rooms=0){const r=this.rng(seed),W=2*n+1,g=new Uint8Array(W*W).fill(1),vis=new Uint8Array(n*n),st=[0],ds=[[0,0]];vis[0]=1;g[W+1]=0;
 while(st.length){const c=st[st.length-1],cx=c%n,cy=c/n|0,nb=[];
  for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const x=cx+dx,y=cy+dy;if(x>=0&&y>=0&&x<n&&y<n&&!vis[y*n+x])nb.push([x,y,dx,dy])}
  if(!nb.length){st.pop();ds.pop();continue}
  const ld=ds[ds.length-1],same=nb.filter(o=>o[2]===ld[0]&&o[3]===ld[1]);
  const[x,y,dx,dy]=straight&&same.length&&r()<straight?same[0]:nb[r()*nb.length|0];ds.push([dx,dy]);vis[y*n+x]=1;g[(2*cy+1+dy)*W+2*cx+1+dx]=0;g[(2*y+1)*W+2*x+1]=0;st.push(y*n+x)}
 for(let k=0,K=braid*n*n|0;k<K;){const x=1+r()*(W-2)|0,y=1+r()*(W-2)|0;if(g[y*W+x]&&(x+y)%2){g[y*W+x]=0;k++}}
 for(let k=0;k<rooms;k++){const cx=1+r()*(n-3)|0,cy=1+r()*(n-3)|0;for(let y=2*cy+1;y<=2*cy+3;y++)for(let x=2*cx+1;x<=2*cx+3;x++)g[y*W+x]=0}
 const m={W,g,start:W+1,goal:0},d=this.bfs(m,m.start);let b=0;d.forEach((v,i)=>{if(v>d[b])b=i});m.goal=b;return m},
bfs(m,s){const d=new Int16Array(m.g.length).fill(-1),q=[s];d[s]=0;
 for(let i=0;i<q.length;i++){const c=q[i];for(const o of[1,-1,m.W,-m.W]){const n=c+o;if(!m.g[n]&&d[n]<0){d[n]=d[c]+1;q.push(n)}}}return d}};
