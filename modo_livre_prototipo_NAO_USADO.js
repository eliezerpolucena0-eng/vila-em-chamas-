// ===== MODO LIVRE (sobrevivencia: minerar, construir, fabricar, chefes, missoes, coop ate 3) =====
const TS=8, DAYLEN=7200;
const TP=[
 {sol:0,h:0},{sol:1,h:1,c:'#4f9a44',d:'dirt'},{sol:1,h:1,c:'#6b4a2e',d:'dirt'},{sol:1,h:3,c:'#7a8088',d:'stone'},
 {sol:0,h:2,c:'#6d4c41',d:'wood'},{sol:0,h:1,c:'#2f7a3a',d:null},{sol:1,h:3,c:'#7a8088',o:'#1a1a1f',d:'coal'},
 {sol:1,h:4,c:'#7a8088',o:'#d9a37a',d:'ironore',t:0},{sol:1,h:5,c:'#7a8088',o:'#ffd23f',d:'goldore',t:1},
 {sol:1,h:7,c:'#5a5a78',o:'#7ad7ff',d:'crystal',t:2},{sol:1,h:2,c:'#b08a5a',d:'plank'},{sol:0,h:1,c:'#8a5a2b',d:'bench'},
 {sol:0,h:.3,c:'#ffb347',d:'torch'},{sol:0,h:2,c:'#6a6a72',d:'furn'},{sol:1,h:999,c:'#2a2a30',d:null}
];
const PLC={dirt:2,stone:3,wood:4,plank:10,bench:11,torch:12,furn:13};
const IN={dirt:'Terra',stone:'Pedra',wood:'Madeira',plank:'Tábua',coal:'Carvão',ironore:'Minério de Ferro',goldore:'Minério de Ouro',crystal:'Cristal',ironbar:'Barra de Ferro',goldbar:'Barra de Ouro',crysbar:'Barra de Cristal',bench:'Bancada',torch:'Tocha',furn:'Fornalha',gel:'Gosma',lente:'Lente',osso:'Osso',estrela:'Estrela Caída',gato:'Gato',pk0:'Picareta de Madeira',pk1:'Picareta de Ferro',pk2:'Picareta de Ouro',pk3:'Picareta de Cristal',coroa:'Coroa de Gosma',lenteS:'Lente Suspeita',cranio:'Crânio Antigo'};
const IC={dirt:'#6b4a2e',stone:'#7a8088',wood:'#6d4c41',plank:'#b08a5a',coal:'#222',ironore:'#d9a37a',goldore:'#ffd23f',crystal:'#7ad7ff',ironbar:'#cfd8dc',goldbar:'#ffd23f',crysbar:'#7ad7ff',bench:'#8a5a2b',torch:'#ffb347',furn:'#6a6a72',gel:'#6fd27a',lente:'#e8f0e0',osso:'#e8dcc0',estrela:'#fff6a0',gato:'#ffb347',pk0:'#8a5a2b',pk1:'#cfd8dc',pk2:'#ffd23f',pk3:'#7ad7ff',coroa:'#6fd27a',lenteS:'#e53935',cranio:'#e8dcc0'};
const PKT={pk0:[0,1],pk1:[1,2],pk2:[2,3.2],pk3:[3,5]};            // [tier, poder]
const SUMM={coroa:'king',lenteS:'eye',cranio:'skull'};
const WREC={s5:{ironbar:3},s3:{ironbar:4,plank:4},s4:{ironbar:5,plank:6},s0:{ironbar:6,plank:2},s1:{plank:10,ironbar:2},s6:{plank:12,goldbar:1},
  s2:{goldbar:6,plank:6},s7:{goldbar:8,crysbar:2},s8:{ironbar:10,goldbar:4},s9:{ironbar:8,goldbar:2},s10:{osso:6,ironbar:4},s11:{plank:20,goldbar:6},
  legend:{crysbar:8,goldbar:10,gel:8,estrela:1},lotus:{crysbar:8,goldbar:10,lente:6,estrela:1},
  sword:{crysbar:20,goldbar:20,estrela:3,gel:10,lente:10,osso:10},fist:{crysbar:20,goldbar:20,estrela:3,gel:10,lente:10,osso:10},card:{crysbar:20,goldbar:20,estrela:3,gel:10,lente:10,osso:10},
  spear:{crysbar:20,goldbar:20,estrela:3,gel:10,lente:10,osso:10},bow:{crysbar:20,goldbar:20,estrela:3,gel:10,lente:10,osso:10}};
const SECRET=['sword','fist','card','spear','bow'];
const RECIPES=(()=>{ const r=[
 {o:['plank',4],n:{wood:1}},{o:['bench',1],n:{plank:10}},{o:['torch',4],n:{wood:1,coal:1}},{o:['furn',1],s:'bench',n:{stone:20,plank:4}},
 {o:['ironbar',1],s:'furn',n:{ironore:3}},{o:['goldbar',1],s:'furn',n:{goldore:3}},{o:['crysbar',1],s:'furn',n:{crystal:3}},
 {o:['pk1',1],s:'bench',n:{ironbar:8,plank:4}},{o:['pk2',1],s:'furn',n:{goldbar:10,plank:6}},{o:['pk3',1],s:'furn',n:{crysbar:10,goldbar:5}},
 {o:['coroa',1],s:'bench',n:{gel:10,ironbar:6}},{o:['lenteS',1],s:'bench',n:{lente:6,crysbar:3}},{o:['cranio',1],s:'bench',n:{osso:10,goldbar:5}}];
 for(const id in WREC){ if(WEAPONS.some(w=>w.id===id)) r.push({o:['w:'+id,1],s:(SECRET.includes(id)||id==='legend'||id==='lotus'||WREC[id].goldbar>=2)?'furn':'bench',n:WREC[id]}); }
 return r; })();
const ENT={zomb:{hp:30,dmg:3,spd:.55,w:7,h:14,col:'#4f8a4a'},skel:{hp:45,dmg:4,spd:.45,w:7,h:14,col:'#e8dcc0'},gob:{hp:26,dmg:3,spd:.95,w:8,h:12},slime:{hp:22,dmg:2,spd:0,w:10,h:8,col:'#6fd27a'},
  king:{hp:420,dmg:5,spd:0,w:28,h:20,col:'#4fd27a',boss:1,nome:'REI GOSMA'},eye:{hp:650,dmg:6,spd:0,w:20,h:20,col:'#e8f0e0',boss:1,nome:'OLHO SINISTRO'},skull:{hp:900,dmg:6,spd:0,w:20,h:22,col:'#e8dcc0',boss:1,nome:'ESQUELETRON'}};
const QUESTS=[
 {id:'m1',main:1,npc:0,nome:'Madeira para a vila',d:'Colete 15 madeiras',p:()=>[FI.wood|0,15],take:{wood:15},rw:{plank:20}},
 {id:'m2',main:1,npc:0,nome:'A primeira bancada',d:'Fabrique uma bancada',p:()=>[FW.s.cr.bench|0,1],rw:{torch:10}},
 {id:'m3',main:1,npc:0,nome:'Mãos de ferro',d:'Fabrique uma picareta de ferro',p:()=>[FW.s.cr.pk1|0,1],rw:{goldbar:2}},
 {id:'m4',main:1,npc:0,nome:'Limpando a vizinhança',d:'Derrote 10 inimigos',p:()=>[FW.s.kills,10],rw:{ironbar:6}},
 {id:'m5',main:1,npc:0,nome:'O Rei da Gosma',d:'Derrote o Rei Gosma',p:()=>[FW.s.boss.king|0,1],rw:{goldbar:5,estrela:1}},
 {id:'m6',main:1,npc:0,nome:'O olho que tudo vê',d:'Derrote o Olho Sinistro',p:()=>[FW.s.boss.eye|0,1],rw:{crysbar:5}},
 {id:'m7',main:1,npc:0,nome:'Ossos antigos',d:'Derrote o Esqueletron',p:()=>[FW.s.boss.skull|0,1],rw:{crysbar:8,goldbar:5}},
 {id:'m8',main:1,npc:0,nome:'Lenda viva',d:'Fabrique uma arma secreta',p:()=>[FW.s.sec|0,1],rw:{estrela:2}},
 {id:'s1',npc:1,nome:'Gatinhos perdidos',d:'Ache 3 gatos nas cavernas',p:()=>[FI.gato|0,3],take:{gato:3},rw:{goldbar:3}},
 {id:'s4',npc:1,nome:'Brilho azul',d:'Entregue 5 cristais',p:()=>[FI.crystal|0,5],take:{crystal:5},rw:{estrela:1,goldbar:2}},
 {id:'s2',npc:2,nome:'Ferro para o ferreiro',d:'Entregue 8 barras de ferro',p:()=>[FI.ironbar|0,8],take:{ironbar:8},rw:{goldbar:2,torch:10}},
 {id:'s3',npc:2,nome:'Noite de zumbis',d:'Derrote 8 zumbis',p:()=>[FW.s.zomb|0,8],rw:{torch:20,ironbar:4}}];
const NPCS=[{n:'Mario da Silva Neto',hl:0,fx:-14,say:['Bem-vindo! Precisamos de você para reerguer a vila.','Complete as missões principais e enfrente os chefes.']},
            {n:'Mario Luis Carneiro Lucas',hl:3,fx:12,say:['Perdi alguns gatos nas cavernas... pode me ajudar?']},
            {n:'Ferreiro Thorin',hl:4,fx:30,say:['Trago ferro e fogo. Me traga barras e zumbis!']}];
let FW=null,FP=null,FI={},FE=[],FB=[],FPA=[],FN=[],FC={x:0,y:0},FUI=0,FL={lm:null},FNAME='',FSAVE=0,FSP=0,FDAY=1;
const FDK=Array.from({length:9},(_,i)=>'rgba(0,0,0,'+(i/8*.92).toFixed(2)+')');
function mb32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function vn(x,y,s){ const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf);
  const h=(a,b)=>{ let n=(a*374761393+b*668265263+s*1274126177)|0; n=Math.imul(n^(n>>>13),1103515245); return ((n^(n>>>16))>>>0)/4294967296; };
  return (h(xi,yi)*(1-u)+h(xi+1,yi)*u)*(1-v)+(h(xi,yi+1)*(1-u)+h(xi+1,yi+1)*u)*v; }
function strSeed(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function freeGen(seed){
  const W2=400,H2=110,r=mb32(seed),t=new Uint8Array(W2*H2),surf=new Int16Array(W2);
  for(let x=0;x<W2;x++) surf[x]=Math.round(34+16*(vn(x/45,0,seed)-.5)+6*(vn(x/13,5,seed)-.5));
  for(let x=0;x<W2;x++) for(let y=0;y<H2;y++){ let id=0;
    if(y===H2-1) id=14; else if(y>surf[x]+5) id=3; else if(y>surf[x]) id=2; else if(y===surf[x]) id=1;
    if(id===3&&y>surf[x]+9){ const c=vn(x/10,y/10,seed+7)+vn(x/4,y/4,seed+9)*.35; if(c>.98) id=0; }
    t[y*W2+x]=id; }
  const ore=(id,minD,n,rad)=>{ for(let i=0;i<n;i++){ const ox=(r()*W2)|0, oy=surf[ox]+minD+((r()*(H2-4-surf[ox]-minD))|0);
    for(let k=0;k<rad*2+3;k++){ const px=ox+((r()*rad*2)|0)-rad, py=oy+((r()*rad*2)|0)-rad; if(px>0&&px<W2-1&&py>0&&py<H2-2&&t[py*W2+px]===3) t[py*W2+px]=id; } } };
  ore(6,6,70,2); ore(7,18,50,2); ore(8,38,36,2); ore(9,56,24,2);
  for(let x=6;x<W2-6;x+=5+((r()*6)|0)){ if(Math.abs(x-W2/2)<4) continue; const y=surf[x], ht=4+((r()*3)|0);
    for(let k=1;k<=ht;k++) t[(y-k)*W2+x]=4;
    for(let dx=-2;dx<=2;dx++) for(let dy=-2;dy<=1;dy++){ if(Math.abs(dx)+Math.abs(dy)<=3){ const px=x+dx,py=y-ht+dy; if(py>0&&t[py*W2+px]===0) t[py*W2+px]=5; } } }
  const cats=[]; for(let tr=0;tr<6000&&cats.length<3;tr++){ const cx=(r()*(W2-20)+10)|0, cy=(surf[cx]+14+r()*40)|0;
    if(t[cy*W2+cx]===0&&t[(cy-1)*W2+cx]===0&&(t[(cy+1)*W2+cx]===3||t[(cy+1)*W2+cx]===2)) cats.push({x:cx*TS+4,y:cy*TS+2,got:0}); }
  return {w:W2,h:H2,t,surf,seed,cats,mods:{},time:1500,torches:[],q:{},s:{kills:0,zomb:0,cr:{},boss:{},sec:0},sel:0,hb:[null,null,null,null,null,null,null,null]};
}
function fGet(x,y){ return (x<0||x>=FW.w||y>=FW.h)?14:(y<0?0:FW.t[y*FW.w+x]); }
function fSol(x,y){ return TP[fGet(x,y)].sol===1; }
function fSet(x,y,id,quiet){
  if(x<0||x>=FW.w||y<0||y>=FW.h) return; const i=y*FW.w+x, o=FW.t[i]; if(o===id||o===14) return;
  FW.t[i]=id; FW.mods[i]=id;
  if(o===12) FW.torches=FW.torches.filter(q=>q[0]!==x||q[1]!==y); if(id===12) FW.torches.push([x,y]);
  if(!quiet&&mp.r){ mp.es++; mp.evl.push({s:mp.es,k:'b',lv:12,i,x:id,e:'',h:0,ts:performance.now()}); if(mp.evl.length>16) mp.evl.shift(); sendPresence(true); }
}
function freeApplyBlock(v){ const x=v.i%FW.w, y=(v.i/FW.w)|0; fSet(x,y,v.x,true); }
function fCol(o){ const x0=Math.floor(o.x/TS),x1=Math.floor((o.x+o.w-.01)/TS),y0=Math.floor(o.y/TS),y1=Math.floor((o.y+o.h-.01)/TS);
  for(let y=y0;y<=y1;y++) for(let x=x0;x<=x1;x++) if(fSol(x,y)) return true; return false; }
function fMove(o,dx,dy){
  let n=Math.ceil(Math.abs(dx)/2.5)||1;
  for(let i=0;i<n;i++){ o.x+=dx/n; if(fCol(o)){ if(o.ground&&o.step){ o.y-=TS; if(!fCol(o)){ continue; } o.y+=TS; } o.x-=dx/n; o.vx=0; o.bump=1; break; } }
  o.ground=false; n=Math.ceil(Math.abs(dy)/2.5)||1;
  for(let i=0;i<n;i++){ o.y+=dy/n; if(fCol(o)){ o.y-=dy/n; if(dy>0) o.ground=true; o.vy=0; break; } }
  o.x=clamp(o.x,0,FW.w*TS-o.w);
}
const fDay=()=>{ const p=(FW.time%DAYLEN)/DAYLEN, s=Math.sin(p*TAU); return clamp(.55+s*.8,.12,1); };
const fNight=()=>fDay()<.4;
function fAdd(id,n){ FI[id]=(FI[id]|0)+n; if(FI[id]<=0){ delete FI[id]; for(let i=0;i<8;i++) if(FW.hb[i]===id&&!id.startsWith('w:')&&!id.startsWith('pk')) FW.hb[i]=null; }
  else if(!FW.hb.includes(id)){ const s=FW.hb.indexOf(null); if(s>=0) FW.hb[s]=id; } }
function fNum(x,y,t,c){ FN.push({x,y,t:String(t),c:c||'#fff',l:50}); }
function fPart(x,y,n,cols,sp){ for(let i=0;i<n;i++){ const a=rnd(0,TAU),v=rnd(.3,sp||1.6); FPA.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-.5,l:rnd(14,30)|0,c:Array.isArray(cols)?pick(cols):cols}); } }
function freeNew(name,code){
  FNAME=name; const seed=code?strSeed('livre-'+code):strSeed('solo-'+name), key='vc_free_'+seed;
  FW=freeGen(seed); FI={}; FE=[]; FB=[]; FPA=[]; FN=[];
  const sx=(FW.w/2)*TS, sy=(FW.surf[FW.w>>1]-3)*TS;
  FP={x:sx,y:sy,vx:0,vy:0,w:6,h:14,dir:1,ground:false,hp:40,mhp:40,inv:60,cd:0,sw:0,step:1,ptr:null,mn:null,sp:0,hurtT:0,spawn:{x:sx,y:sy}};
  let sv=null; try{ sv=JSON.parse(localStorage.getItem(key)||'null'); }catch(_){}
  if(sv&&sv.seed===seed){ for(const i in sv.mods) fSet(+i%FW.w,(+i/FW.w)|0,sv.mods[i],true); FI=sv.fi||{}; FW.hb=sv.hb||FW.hb; FW.q=sv.q||{}; FW.s=sv.s||FW.s; FW.time=sv.time||FW.time; FW.sel=sv.sel|0; FP.x=sv.x||FP.x; FP.y=sv.y||FP.y; FP.hp=sv.hp||FP.hp; (sv.cats||[]).forEach((g2,i)=>{ if(FW.cats[i]) FW.cats[i].got=g2; }); }
  else { const w0=WEAPONS.find(w=>w.own&&w.ci===(cls===7?2:cls)); fAdd('pk0',1); if(w0) fAdd('w:'+w0.id,1); fAdd('torch',8); }
  FW.key=key; FNAME=name; FSAVE=0;
  FNPC=NPCS.map((n,i)=>({n:n.n,x:sx+n.fx*TS+0,y:(FW.surf[((sx/TS)|0)+n.fx]-2)*TS,lk:Object.assign({rc:HRC[n.hl]},HL[n.hl]),d:1,say:n.say,i}));
}
let FNPC=[];
function freeSave(){ if(!FW) return; const cats=FW.cats.map(c=>c.got); try{ localStorage.setItem(FW.key,JSON.stringify({seed:FW.seed,mods:FW.mods,fi:FI,hb:FW.hb,q:FW.q,s:FW.s,time:FW.time,sel:FW.sel,x:FP.x,y:FP.y,hp:FP.hp,cats})); }catch(_){} }
function fHeld(){ return FW.hb[FW.sel]; }
function fPick(){ const it=fHeld(); return it&&PKT[it]?PKT[it]:null; }
function fNearSt(s){ if(!s) return true; const tx=Math.round((FP.x+3)/TS),ty=Math.round((FP.y+7)/TS), id=s==='bench'?11:13; for(let y=-4;y<=4;y++) for(let x=-6;x<=6;x++) if(fGet(tx+x,ty+y)===id) return true; return false; }
function fCanCraft(r){ for(const k in r.n) if((FI[k]|0)<r.n[k]) return false; return fNearSt(r.s); }
function fCraft(r){ if(!fCanCraft(r)) return false; for(const k in r.n) fAdd(k,-r.n[k]); fAdd(r.o[0],r.o[1]); const id=r.o[0].replace('w:',''); FW.s.cr[id]=(FW.s.cr[id]|0)+1; if(SECRET.includes(id)) FW.s.sec=1; sfx('coin'); fNum(FP.x,FP.y-8,'FABRICOU!','#ffd166'); return true; }
// ----- combate -----
function fHurt(d,fx){
  if(FP.inv>0) return; FP.hp-=d; FP.inv=40; FP.vy=-2.2; FP.vx=(FP.x+3<fx?-2:2); sfx('hurt'); fNum(FP.x,FP.y-6,'-'+d,'#ff6b6b'); fPart(FP.x+3,FP.y+7,6,['#e53935','#fff'],1.6); shake=MX(shake,2);
  if(FP.hp<=0){ FP.hp=FP.mhp; FP.x=FP.spawn.x; FP.y=FP.spawn.y; FP.vx=FP.vy=0; FP.inv=180; FE=FE.filter(e=>!e.boss); gT.push({t:'VOCE CAIU! VOLTOU PARA A VILA',l:200}); }
}
function fKill(e){
  const dr=(id,n,pr)=>{ if(Math.random()<pr) fAdd(id,n); };
  FW.s.kills++; if(e.k==='zomb') FW.s.zomb++;
  if(e.k==='slime') dr('gel',1+((Math.random()*2)|0),.9); if(e.k==='zomb') dr('lente',1,.18); if(e.k==='skel') dr('osso',1,.5);
  if(e.k==='gob'){ dr('ironore',1,.4); dr('wood',1,.3); }
  if(e.boss){ FW.s.boss[e.k]=1; fAdd('estrela',1); if(e.k==='king') fAdd('gel',14); if(e.k==='eye') fAdd('lente',9); if(e.k==='skull') fAdd('osso',14); gT.push({t:e.nome+' DERROTADO! +1 ESTRELA',l:260}); shake=MX(shake,10); sfx('boom'); }
  fPart(e.x+e.w/2,e.y+e.h/2,e.boss?40:12,[e.col||'#b9d98a','#fff'],e.boss?4:2);
}
function fDmg(e,d,kx){ if(e.hp<=0) return; e.hp-=d; e.hit=6; e.vx+=kx*.5; e.vy-=1; fNum(e.x+e.w/2,e.y-4,d,'#fff'); fPart(e.x+e.w/2,e.y+e.h/2,4,'#fff',1.2); if(e.hp<=0){ fKill(e); } }
function fNplayers(){ return 1+mp.act.filter(p=>!p.isMe&&p.presence&&p.presence.lv===12).length; }
function fSpawn(k,x,y){ const t=ENT[k], f=1+.5*(fNplayers()-1)*(t.boss?1.6:1); const e={k,x,y,w:t.w,h:t.h,vx:0,vy:0,hp:Math.round(t.hp*f),mhp:Math.round(t.hp*f),dmg:t.dmg,spd:t.spd,col:t.col,boss:t.boss,nome:t.nome,cd:60+((Math.random()*60)|0),dir:1,hit:0,ground:false,step:1,t:0};
  FE.push(e); return e; }
function fAim(){ const q=FP.ptr; return q?{x:q.x+FC.x,y:q.y+FC.y}:{x:FP.x+3+FP.dir*40,y:FP.y+7}; }
function fWeapon(it){ return WEAPONS.find(w=>w.id===it.slice(2)); }
function fUse(it){
  const w=fWeapon(it); if(!w||FP.cd>0) return; const a=fAim(), cx=FP.x+3, cy=FP.y+6; let dx=a.x-cx, dy=a.y-cy; const m=Math.hypot(dx,dy)||1; dx/=m; dy/=m; FP.dir=dx>=0?1:-1;
  FP.cd=MX(10,w.cd||24); FP.sw=10; sfx(WSFX[w.id]||'swing'); const dm=(w.dmg||1)*5+(w.id==='sword'||w.id==='spear'||w.id==='fist'||w.id==='card'||w.id==='bow'?12:0);
  if(w.ty==='shot'){ FB.push({x:cx,y:cy,vx:dx*((w.sv||3)*1.25),vy:dy*((w.sv||3)*1.25),dmg:dm,life:(w.sl||50)+20,fr:1,col:w.col||'#fff',kind:w.sk||'orb',pierce:w.id==='bow'||w.id==='spear'}); }
  else { const rg=(w.rng||18)+10, r={x:FP.dir>0?FP.x+FP.w:FP.x-rg,y:FP.y-4,w:rg,h:FP.h+8}; FE.forEach(e=>{ if(e.hp>0&&e.x<r.x+r.w&&e.x+e.w>r.x&&e.y<r.y+r.h&&e.y+e.h>r.y) fDmg(e,dm,FP.dir*(w.kb||3)); }); fPart(cx+FP.dir*rg*.6,cy,8,[w.col||'#fff','#fff'],2); }
}
function freeSpecial(){
  const it=fHeld(); if(FP.sp>0){ fNum(FP.x,FP.y-8,'ESPECIAL '+Math.ceil(FP.sp/60)+'S','#c9a0ff'); return; } if(!it||!it.startsWith('w:')) return;
  FP.sp=360; sfx('boom'); shake=MX(shake,4); const w=fWeapon(it), cx=FP.x+3, cy=FP.y+7; fPart(cx,cy,30,[w.col||'#fff','#fff'],3.5);
  FE.forEach(e=>{ if(e.hp>0&&Math.hypot(e.x+e.w/2-cx,e.y+e.h/2-cy)<64) fDmg(e,((w.dmg||1)*9)+10,(e.x>FP.x?1:-1)*5); });
}
function fSummon(k){ const e=fSpawn(k,FP.x+(FP.dir>0?40:-60),FP.y-40); gT.push({t:ENT[k].nome+' APARECEU!',l:220}); sfx('growl'); shake=MX(shake,6); return e; }
// ----- inimigos -----
function fEnemyAI(e){
  e.t++; if(e.hit>0) e.hit--; const tx=FP.x+3-(e.x+e.w/2), ty=FP.y+7-(e.y+e.h/2), dist=Math.hypot(tx,ty); e.dir=tx>=0?1:-1;
  if(!e.boss&&(dist>460||e.y>FW.h*TS)){ e.hp=0; e.gone=1; return; }
  if(e.k==='slime'){ e.vy=MN(e.vy+.2,5.5); if(e.ground){ e.vx*=.6; if(e.t%70===0){ e.vy=-4; e.vx=e.dir*1.3; } } fMove(e,e.vx,e.vy); }
  else if(e.k==='king'){ e.vy=MN(e.vy+.2,5.5); if(e.ground){ e.vx*=.5; if(e.t%(e.hp<e.mhp*.5?55:85)===0){ e.vy=-6.2; e.vx=e.dir*(e.hp<e.mhp*.5?2.2:1.7); sfx('growl'); } } fMove(e,e.vx,e.vy); if(e.hp<e.mhp*.5&&e.t%240===0&&FE.length<14){ const s=fSpawn('slime',e.x+e.w/2,e.y-6); s.vy=-3; s.vx=e.dir*1.4; } }
  else if(e.k==='eye'){ const rage=e.hp<e.mhp*.5; if(e.dash>0){ e.dash--; e.x+=e.dvx; e.y+=e.dvy; } else { const gx=FP.x-e.x-e.w/2, gy=FP.y-70-e.y; e.x+=clamp(gx*.02,-1.4,1.4); e.y+=clamp(gy*.03,-1.2,1.2); if(e.t%(rage?70:105)===0){ const m=Math.hypot(tx,ty)||1; e.dvx=tx/m*(rage?5:4); e.dvy=ty/m*(rage?5:4); e.dash=24; sfx('growl'); } } }
  else if(e.k==='skull'){ const rage=e.hp<e.mhp*.5; e.x+=clamp(tx*.012,-1,1); e.y+=clamp((ty-30)*.012,-.8,.8); if(e.t%(rage?80:115)===0){ const n=rage?12:8; for(let i=0;i<n;i++){ const a=i*TAU/n+e.t*.05; FB.push({x:e.x+e.w/2,y:e.y+e.h/2,vx:Math.cos(a)*1.7,vy:Math.sin(a)*1.7,dmg:5,life:140,hostile:1,col:'#e8dcc0',kind:'bone'}); } sfx('zap'); } }
  else { // zumbi, esqueleto, goblin
    e.vy=MN(e.vy+.2,5.5); const sp=e.spd*(e.k==='gob'?1:1); e.vx+=(e.dir*sp-e.vx)*.2; if(e.k==='skel'&&Math.abs(tx)<150&&Math.abs(ty)<40){ e.vx*=.3; if(e.t%110===0){ FB.push({x:e.x+e.w/2,y:e.y+4,vx:e.dir*2.4,vy:-.2,dmg:e.dmg,life:90,hostile:1,col:'#e8dcc0',kind:'bone'}); sfx('arrow'); } }
    fMove(e,e.vx,e.vy); if(e.bump&&e.ground){ e.vy=-4.3; e.bump=0; }
  }
  if(!FP.inv&&e.x<FP.x+FP.w&&e.x+e.w>FP.x&&e.y<FP.y+FP.h&&e.y+e.h>FP.y) fHurt(e.dmg,e.x+e.w/2);
}
function fSpawnTick(){
  if(FE.length>=7) return; const px=FP.x+3, py=FP.y+7, side=Math.random()<.5?-1:1, sx=px+side*(170+Math.random()*70), tx=Math.floor(sx/TS); if(tx<2||tx>=FW.w-2) return;
  const depth=(py/TS)-FW.surf[Math.floor(px/TS)];
  if(depth<12){ const sy=(FW.surf[tx]-3)*TS; const r=Math.random(); if(fNight()) fSpawn(r<.75?'zomb':'gob',sx,sy); else if(r<.3) fSpawn('slime',sx,sy); else if(r<.4) fSpawn('gob',sx,sy); }
  else { for(let tr=0;tr<8;tr++){ const cx=Math.floor(px/TS+side*(18+Math.random()*12)), cy=Math.floor(py/TS+(Math.random()*16-8)); if(fGet(cx,cy)===0&&fGet(cx,cy-1)===0&&fSol(cx,cy+1)){ fSpawn(Math.random()<.6?'skel':(Math.random()<.5?'slime':'zomb'),cx*TS,cy*TS-4); break; } } }
}
// ----- mineracao e construcao -----
function fMine(tx,ty){
  const id=fGet(tx,ty), t=TP[id], pk=fPick(); if(!id||t.h>=999) { FP.mn=null; return; } if(!pk){ return; }
  if((t.t|0)>pk[0]){ if(T%60===0) fNum(tx*TS,ty*TS-6,'PICARETA FRACA','#ff9a9a'); return; }
  if(!FP.mn||FP.mn.x!==tx||FP.mn.y!==ty) FP.mn={x:tx,y:ty,p:0};
  FP.mn.p+=pk[1]; if(T%8===0){ fPart(tx*TS+4,ty*TS+4,2,t.c||'#fff',1.2); sfx('hit'); }
  if(FP.mn.p>=t.h*18){ fSet(tx,ty,0); if(t.d) fAdd(t.d,1); fPart(tx*TS+4,ty*TS+4,8,t.c||'#fff',1.8); FP.mn=null; sfx('pop');
    // arvores: tronco acima cai junto
    if(id===4){ let y=ty-1; while(fGet(tx,y)===4){ fSet(tx,y,0); fAdd('wood',1); y--; } } }
}
function fPlace(tx,ty,it){
  const pid=PLC[it]; if(!pid||fGet(tx,ty)!==0&&!(fGet(tx,ty)===5)) return;
  const bx=tx*TS, by=ty*TS; if(TP[pid].sol&&bx<FP.x+FP.w&&bx+TS>FP.x&&by<FP.y+FP.h&&by+TS>FP.y) return;
  if(!(fGet(tx-1,ty)||fGet(tx+1,ty)||fGet(tx,ty-1)||fGet(tx,ty+1))) return;
  fSet(tx,ty,pid); fAdd(it,-1); sfx('pop');
}
function fAct(){
  if(FP.cd>0) FP.cd--; const it=fHeld(); let q=FP.ptr, wx,wy;
  if(q){ wx=q.x+FC.x; wy=q.y+FC.y; } else if(keys.a){ const cx=FP.x+3; wx=cx+FP.dir*(TS*1.5); wy=FP.y+8; } else { FP.mn=null; return; }
  if(!it) return; const cx=FP.x+3, cy=FP.y+7; if(Math.hypot(wx-cx,wy-cy)>TS*6.5&&!it.startsWith('w:')) { FP.mn=null; return; }
  if(wx>cx+1) FP.dir=1; else if(wx<cx-1) FP.dir=-1;
  const tx=Math.floor(wx/TS), ty=Math.floor(wy/TS);
  if(it.startsWith('w:')) fUse(it);
  else if(PKT[it]){ if(!q&&keys.a){ const f=FP.dir, bx=Math.floor((FP.x+3)/TS)+f, by=Math.floor((FP.y+7)/TS); let hit=false; for(const [dx2,dy2] of [[0,0],[0,1],[0,-1],[f,0],[f,1]]){ if(fGet(bx+dx2,by+dy2)){ fMine(bx+dx2,by+dy2); hit=true; break; } } if(!hit) FP.mn=null; } else fMine(tx,ty); }
  else if(PLC[it]){ if(T%7===0) fPlace(tx,ty,it); }
}
function fTap(q){
  const wx=q.x+FC.x, wy=q.y+FC.y;
  for(const n of FNPC){ if(Math.abs(wx-(n.x+4))<12&&Math.abs(wy-(n.y+8))<16&&Math.hypot(FP.x-n.x,FP.y-n.y)<60){ freePanel('talk',n.i); FP.ptr=null; return; } }
  const it=fHeld(); if(it&&SUMM[it]){ fAdd(it,-1); fSummon(SUMM[it]); FP.ptr=null; }
}
// ----- laco principal -----
function freeStep(){
  T++; if(!FW) return; if(FUI) return;
  const p=FP; FW.time++; if(p.inv>0) p.inv--; if(p.sp>0) p.sp--; if(p.sw>0) p.sw--;
  const mv=(keys.r?1:0)-(keys.l?1:0); p.vx+=(mv*1.55-p.vx)*.3; if(mv&&!p.ptr) p.dir=mv;
  if(keys.j&&p.ground){ p.vy=-4.4; p.ground=false; sfx('jump'); }
  p.vy=MN(p.vy+.2,5.5); fMove(p,p.vx,p.vy);
  if(p.y>FW.h*TS+20){ p.x=p.spawn.x; p.y=p.spawn.y; p.vy=0; }
  fAct();
  if(T%120===0&&p.hp<p.mhp&&p.hurtT<=0) p.hp=MN(p.mhp,p.hp+1);
  if(T%90===0) fSpawnTick();
  FE.forEach(fEnemyAI); FE=FE.filter(e=>e.hp>0);
  FB.forEach(b=>{ b.x+=b.vx; b.y+=b.vy; b.life--; if(fSol(Math.floor(b.x/TS),Math.floor(b.y/TS))) b.life=0;
    if(b.hostile){ if(!FP.inv&&b.x>FP.x&&b.x<FP.x+FP.w&&b.y>FP.y&&b.y<FP.y+FP.h){ fHurt(b.dmg,b.x); b.life=0; } }
    else FE.forEach(e=>{ if(b.life>0&&e.hp>0&&b.x>e.x&&b.x<e.x+e.w&&b.y>e.y&&b.y<e.y+e.h){ fDmg(e,b.dmg,Math.sign(b.vx)*3); if(!b.pierce) b.life=0; } });
    if(T%2===0) FPA.push({x:b.x,y:b.y,vx:0,vy:0,l:8,c:b.col}); });
  FB=FB.filter(b=>b.life>0);
  FPA.forEach(a=>{ a.x+=a.vx; a.y+=a.vy; a.vy+=.05; a.l--; }); FPA=FPA.filter(a=>a.l>0); FN.forEach(n=>{ n.y-=.3; n.l--; }); FN=FN.filter(n=>n.l>0);
  FW.cats.forEach(c=>{ if(!c.got&&Math.abs(c.x-(p.x+3))<10&&Math.abs(c.y-(p.y+8))<14){ c.got=1; fAdd('gato',1); sfx('coin'); fNum(c.x,c.y-8,'MIAU!','#ffb347'); } });
  FC.x+=((clamp(p.x+3-W/2,0,FW.w*TS-W))-FC.x)*.18; FC.y+=((clamp(p.y+7-H/2,0,FW.h*TS-H))-FC.y)*.18;
  if(shake>0) shake*=.85; if(++FSAVE>900){ FSAVE=0; freeSave(); }
}
// ----- desenho -----
function freeDraw(){
  if(!FW){ rect(0,0,W,H,'#000'); return; }
  const day=fDay(), pr=(FW.time%DAYLEN)/DAYLEN, sk=g.createLinearGradient(0,0,0,H);
  const mix=(a,b,t)=>{ const A=[parseInt(a.slice(1,3),16),parseInt(a.slice(3,5),16),parseInt(a.slice(5,7),16)], B=[parseInt(b.slice(1,3),16),parseInt(b.slice(3,5),16),parseInt(b.slice(5,7),16)]; return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'; };
  const t=(day-.12)/.88; sk.addColorStop(0,mix('#070716','#4aa8ee',t)); sk.addColorStop(1,mix('#141432','#bfe6ff',t)); g.fillStyle=sk; g.fillRect(0,0,W,H);
  if(day<.5){ for(let i=0;i<40;i++) rect((i*53+17)%W,(i*29+7)%90,1,1,'#fff'); }
  const sa=pr*TAU, sx=W/2+Math.cos(sa-Math.PI/2)*140, sy=90-Math.sin(sa-Math.PI/2)*70; if(pr<.5) ell(sx,sy,9,9,'#ffe27a'); else ell(W-sx,sy+140,7,7,'#e8eef8');
  g.save(); g.translate(-R(FC.x)+rnd(-shake,shake),-R(FC.y)+rnd(-shake,shake));
  const tx0=Math.floor(FC.x/TS)-1, ty0=Math.floor(FC.y/TS)-1, nw=Math.ceil(W/TS)+3, nh=Math.ceil(H/TS)+3, lm=fLightMap(tx0,ty0,nw,nh);
  for(let j=0;j<nh;j++) for(let i=0;i<nw;i++){ const x=tx0+i,y=ty0+j,id=fGet(x,y); if(!id&&y<FW.surf[clamp(x,0,FW.w-1)]) continue;
    const l=lm[j*nw+i], px=x*TS, py=y*TS;
    if(id){ const tp=TP[id]; rect(px,py,TS,TS,tp.c||'#888'); if(tp.o){ rect(px+1,py+1,3,3,tp.o); rect(px+5,py+4,2,2,tp.o); }
      if(id===1){ rect(px,py,TS,2,'#6fbf5a'); } if(id===12){ rect(px+3,py+1,2,6,'#6d4c41'); rect(px+2,py-1,4,3,'#ffb347'); } if(id===11){ rect(px,py+3,TS,2,'#b08a5a'); rect(px+1,py+5,2,3,'#6d4c41'); rect(px+5,py+5,2,3,'#6d4c41'); } if(id===13){ rect(px+1,py+2,6,6,'#7a7a82'); rect(px+2,py+4,4,2,'#ff7a1a'); } }
    else rect(px,py,TS,TS,'#14121a');
    const q=clamp(Math.round((1-l)*8),0,8); if(q>0){ g.fillStyle=FDK[q]; g.fillRect(px,py,TS,TS); } }
  FW.cats.forEach(c=>{ if(c.got) return; rect(c.x-3,c.y-2,7,4,'#ffb347'); rect(c.x+2,c.y-4,3,3,'#ffb347'); rect(c.x+2,c.y-5,1,1,'#ffb347'); rect(c.x+4,c.y-5,1,1,'#ffb347'); rect(c.x-4,c.y-3+((T>>3)%2),1,3,'#ffb347'); if((T>>4)%2) rect(c.x-6,c.y-8,1,1,'#fff'); });
  FNPC.forEach(n=>{ drawHero(R(n.x),R(n.y),n.d,{walk:false,air:false},n.lk,1,false); txt(n.n.split(' ')[0],R(n.x+4-tw(n.n.split(' ')[0])/2),R(n.y-8),'#ffd166'); if(Math.hypot(FP.x-n.x,FP.y-n.y)<60) txt('TOQUE NELE',R(n.x+4-tw('TOQUE NELE')/2),R(n.y-15),'#fff'); });
  FE.forEach(e=>{ const x=R(e.x),y=R(e.y);
    if(e.k==='gob') drawGob({x,y:y-3,w:8,dir:e.dir,moving:true,swing:0,hit:e.hit},'g',false);
    else if(e.k==='slime'){ ell(x+5,y+5,6+((T>>3)%2),4,e.hit?'#fff':'#6fd27a'); rect(x+3,y+3,1,2,'#12310f'); rect(x+7,y+3,1,2,'#12310f'); }
    else if(e.k==='king'){ ell(x+14,y+11,15,10+((T>>4)%2),e.hit?'#fff':'#4fd27a'); rect(x+9,y+6,3,4,'#0a2a10'); rect(x+17,y+6,3,4,'#0a2a10'); rect(x+8,y-4,12,4,'#ffd23f'); rect(x+8,y-7,2,3,'#ffd23f'); rect(x+13,y-8,2,4,'#ffd23f'); rect(x+18,y-7,2,3,'#ffd23f'); }
    else if(e.k==='eye'){ ell(x+10,y+10,10,10,e.hit?'#fff':'#e8f0e0'); ell(x+10+e.dir*3,y+10,5,5,'#c62828'); ell(x+10+e.dir*3,y+10,2,2,'#000'); if(e.dash>0) for(let k=1;k<4;k++){ g.globalAlpha=.25; ell(x+10-e.dvx*k*2,y+10-e.dvy*k*2,8,8,'#e8f0e0'); g.globalAlpha=1; } }
    else if(e.k==='skull'){ ell(x+10,y+9,10,9,e.hit?'#fff':'#e8dcc0'); rect(x+5,y+6,4,5,'#1a1a1a'); rect(x+12,y+6,4,5,'#1a1a1a'); rect(x+6,y+15,8,5,'#e8dcc0'); for(let k=0;k<4;k++) rect(x+6+k*2,y+17,1,3,'#1a1a1a'); }
    else { const c=e.hit?'#fff':(e.k==='zomb'?'#4f8a4a':'#e8dcc0'), wk=Math.abs(e.vx)>.1?((T>>3)%2):0; rect(x+1,y,5,5,c); rect(x,y+5,7,6,e.k==='zomb'?'#3a5a8a':c); rect(x+(wk?0:2),y+11,2,3,c); rect(x+(wk?4:3),y+11,2,3,c); rect(x+(e.dir>0?4:1),y+1,1,1,e.k==='zomb'?'#fff':'#000'); rect(e.dir>0?x+6:x-3,y+5,4,2,c); }
    if(e.hp<e.mhp&&!e.boss){ rect(x-1,y-5,e.w+2,2,'#200'); rect(x,y-5,R(e.w*e.hp/e.mhp),1,'#e53935'); } });
  FB.forEach(b=>{ if(b.kind==='bone'){ rect(b.x-2,b.y-1,5,2,'#e8dcc0'); } else { rect(b.x-2,b.y-2,4,4,b.col); rect(b.x-1,b.y-1,2,2,'#fff'); } });
  mp.act.forEach(m=>{ if(m.isMe||!m.presence||m.presence.lv!==12||typeof m.presence.x!=='number') return; const q=m.presence; let sm=mp.sm[m.peer]; if(!sm||Math.abs(sm.x-q.x)>120||Math.abs(sm.y-q.y)>120) sm=mp.sm[m.peer]={x:q.x,y:q.y}; else { sm.x+=(q.x-sm.x)*.3; sm.y+=(q.y-sm.y)*.3; }
    const lk=JSON.stringify(q.lk||0); let c=mp.lc[m.peer]; if(!c||c.k!==lk) c=mp.lc[m.peer]={k:lk,l:mateLook(q.lk)}; drawHero(R(sm.x-1),R(sm.y-1),q.d<0?-1:1,{walk:!!q.w,air:!!q.a},c.l,.95,false); const nm=String(q.n||'?').slice(0,12); txt(nm,R(sm.x+3-tw(nm)/2),R(sm.y-9),'#9be7ff'); });
  if(FP.inv<=0||(T>>2)%2){ const it=fHeld(), w=it&&it.startsWith('w:')?fWeapon(it):null; drawHero(R(FP.x-1),R(FP.y-1),FP.dir,{walk:FP.ground&&Math.abs(FP.vx)>.3,air:!FP.ground},look,1,!!w||!!(it&&PKT[it]));
    if(it&&PKT[it]){ const sw=FP.sw>0||FP.mn?((T>>2)%2?-5:3):0; rect(R(FP.x+3+FP.dir*5),R(FP.y+4+sw),2,8,'#6d4c41'); rect(R(FP.x+3+FP.dir*5)-2,R(FP.y+3+sw),6,2,PKT[it][0]>=3?'#7ad7ff':(PKT[it][0]>=2?'#ffd23f':(PKT[it][0]>=1?'#cfd8dc':'#8a5a2b'))); }
    else if(w){ const sw=FP.sw>0?(10-FP.sw)/10:-1, ex=R(FP.x+3+FP.dir*(6+(sw<0?0:Math.sin(sw*Math.PI)*8))); rect(ex,R(FP.y+4),2,9,w.col||'#fff'); rect(ex-1,R(FP.y+4),4,1,'#fff'); }
    else if(it&&PLC[it]) rect(R(FP.x+3+FP.dir*5),R(FP.y+6),4,4,IC[it]||'#fff'); }
  FPA.forEach(a=>rect(R(a.x),R(a.y),2,2,a.c)); FN.forEach(n=>{ g.globalAlpha=MN(1,n.l/20); txt(n.t,R(n.x),R(n.y),n.c); g.globalAlpha=1; });
  g.restore();
  // HUD
  rect(4,4,64,7,'#000a'); rect(5,5,R(62*MX(0,FP.hp)/FP.mhp),5,FP.hp<FP.mhp*.3?'#c62828':'#e53935'); txt(FP.hp+'/'+FP.mhp,8,5,'#fff');
  const depth=Math.max(0,Math.round(FP.y/TS-FW.surf[clamp(Math.floor(FP.x/TS),0,FW.w-1)])), hh=Math.floor(pr*24+6)%24, tt='PROF '+depth+'M  '+String(hh).padStart(2,'0')+'H'+(fNight()?' NOITE':'');
  txt(tt,4,14,'#cfe8ff');
  const boss=FE.find(e=>e.boss); if(boss){ const bw=140,bx=R(W/2-bw/2); rect(bx-2,20,bw+4,9,'#000b'); rect(bx,22,R(bw*boss.hp/boss.mhp),5,'#c62828'); const nm=boss.nome; for(let i=0;i<nm.length;i++) txt(nm[i],R(W/2-tw(nm)/2)+i*4,12,i%2?'#b388ff':'#ff3b30'); }
  const x0=W/2-68; for(let i=0;i<8;i++){ const it=FW.hb[i], sel=i===FW.sel; rect(x0+i*17,H-20,16,16,sel?'#ffd166':'#000b'); rect(x0+i*17+1,H-19,14,14,'#1c1230');
    if(it){ if(it.startsWith('w:')){ const w=fWeapon(it); if(w){ const im=new Image(); im.src=wico(w.id); g.imageSmoothingEnabled=false; g.drawImage(im,x0+i*17+1,H-19,14,14); } } else { rect(x0+i*17+4,H-16,8,8,IC[it]||'#888'); if(PKT[it]) rect(x0+i*17+7,H-17,2,10,'#6d4c41'); } if(!it.startsWith('w:')&&!PKT[it]) txt(String(FI[it]|0),x0+i*17+2,H-9,'#fff'); } }
  const cur=fHeld(); if(cur){ const nm=cur.startsWith('w:')?(fWeapon(cur)||{}).nome||'':(IN[cur]||''); txt(String(nm).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''),R(W/2-tw(nm)/2),H-26,'#ffd166'); }
  const aq=QUESTS.find(q=>FW.q[q.id]===1&&q.main)||QUESTS.find(q=>FW.q[q.id]===1); if(aq){ const pg=aq.p(), s=aq.nome.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')+' '+MN(pg[0],pg[1])+'/'+pg[1]; txt(s,W-6-tw(s),H-12,'#c9a0ff'); }
  if(mp.r) txt('COOP '+mp.act.length+'/3',4,22,'#7CFC9A'); drawGT();
}
function fLightMap(tx0,ty0,nw,nh){
  const day=fDay(); if(!FL.lm||FL.lm.length<nw*nh) FL.lm=new Float32Array(nw*nh); const L2=FL.lm;
  for(let j=0;j<nh;j++) for(let i=0;i<nw;i++){ const x=clamp(tx0+i,0,FW.w-1), dp=ty0+j-FW.surf[x]; L2[j*nw+i]=dp<=0?day:MX(0,day*(1-dp/7)); }
  const src=(sx,sy,R2)=>{ for(let dj=-R2;dj<=R2;dj++) for(let di=-R2;di<=R2;di++){ const i=sx+di-tx0, j=sy+dj-ty0; if(i<0||j<0||i>=nw||j>=nh) continue; const d=Math.hypot(di,dj); if(d>R2) continue; const l=1-d/R2; if(l>L2[j*nw+i]) L2[j*nw+i]=l; } };
  src(Math.round((FP.x+3)/TS),Math.round((FP.y+7)/TS),6); FW.torches.forEach(([x,y])=>{ if(x>tx0-9&&x<tx0+nw+9&&y>ty0-9&&y<ty0+nh+9) src(x,y,8); });
  mp.act.forEach(m=>{ if(!m.isMe&&m.presence&&m.presence.lv===12&&typeof m.presence.x==='number') src(Math.round((m.presence.x+3)/TS),Math.round((m.presence.y+7)/TS),5); });
  return L2;
}
// ----- paineis (inventario, fabricar, missoes, dialogo) -----
function freePanel(tab,arg){
  FUI=1; sh.className=''; sh.style.display='flex'; keys.l=keys.r=keys.j=keys.a=false;
  const nm=id=>id.startsWith('w:')?((WEAPONS.find(w=>w.id===id.slice(2))||{}).nome||id):(IN[id]||id), ico=id=>id.startsWith('w:')?wi2(id.slice(2)):`<span style="display:inline-block;width:.9em;height:.9em;background:${IC[id]||'#888'};vertical-align:middle"></span>`;
  const top=`<div class="row"><button data-fz="close">✖ Fechar</button><button data-fz="tab:inv">🎒 Itens</button><button data-fz="tab:craft">🔨 Fabricar</button><button data-fz="tab:quest">📜 Missões</button><button data-fz="exit">🚪 Sair</button></div>`;
  let h=top;
  if(tab==='inv'){ const ks=Object.keys(FI); h+=`<b>🎒 Itens</b><div style='font-size:.5rem;text-align:center'>Toque num item para colocá-lo na barra (espaço ${FW.sel+1}).</div><div class="mc" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px">${ks.map(k=>`<button data-fz="eq:${k}">${ico(k)} ${nm(k)}${k.startsWith('w:')||PKT[k]?'':' ×'+FI[k]}</button>`).join('')||'<span>vazio</span>'}</div>`; }
  else if(tab==='craft'){ h+=`<b>🔨 Fabricar</b><div style='font-size:.5rem;text-align:center'>Algumas receitas precisam de bancada ou fornalha por perto.</div>`+RECIPES.map((r,i)=>{ const ok=fCanCraft(r), need=Object.keys(r.n).map(k=>`${r.n[k]} ${IN[k]||k}`).join(', '); return `<button data-fz="cr:${i}"${ok?'':' disabled'}>${ico(r.o[0])} ${nm(r.o[0])}${r.o[1]>1?' ×'+r.o[1]:''}${r.s?' ['+(r.s==='bench'?'bancada':'fornalha')+']':''}<br><span style="font-size:.45rem">${need}</span></button>`; }).join(''); }
  else if(tab==='quest'){ h+=`<b>📜 Missões</b>`+QUESTS.map(q=>{ const st=FW.q[q.id]|0, pg=q.p(); return `<div style='font-size:.5rem;text-align:left;border-bottom:1px solid #fff2;padding:3px'>${q.main?'⭐':'•'} <b>${q.nome}</b> — ${q.d}<br>${st===2?'✅ concluída':(st===1?'em andamento '+MN(pg[0],pg[1])+'/'+pg[1]:'(fale com '+NPCS[q.npc].n+')')}</div>`; }).join(''); }
  else if(tab==='talk'){ const n=NPCS[arg]; h+=`<b>💬 ${n.n}</b><div style='font-size:.55rem;line-height:1.6'>${n.say.join('<br>')}</div>`;
    QUESTS.filter(q=>q.npc===arg).forEach((q,ix)=>{ const prev=QUESTS.filter(x=>x.main&&q.main&&QUESTS.indexOf(x)<QUESTS.indexOf(q)).pop(), locked=q.main&&prev&&FW.q[prev.id]!==2, st=FW.q[q.id]|0, pg=q.p(), done=pg[0]>=pg[1];
      if(st===2) return; if(locked){ h+=`<button disabled>🔒 ${q.nome}</button>`; return; }
      if(st===0) h+=`<button data-fz="qa:${q.id}">📜 Aceitar: ${q.nome}<br><span style="font-size:.45rem">${q.d}</span></button>`;
      else h+=`<button data-fz="qt:${q.id}"${done?'':' disabled'}>${done?'✅ Entregar':'⏳'} ${q.nome} (${MN(pg[0],pg[1])}/${pg[1]})</button>`; }); }
  else if(tab==='menu'){ h+=`<b>⏸ Pausa</b><button data-fz="close">▶ Continuar</button><button data-fz="exit">💾 Salvar e sair</button>`; }
  sh.innerHTML=h;
  sh.querySelectorAll('[data-fz]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); const [a,v]=b.dataset.fz.split(':');
    if(a==='close'){ FUI=0; sh.style.display='none'; } else if(a==='exit'){ freeExit(); } else if(a==='tab') freePanel(v,arg);
    else if(a==='eq'){ FW.hb[FW.sel]=b.dataset.fz.slice(3); freePanel('inv'); } else if(a==='cr'){ fCraft(RECIPES[+v]); freePanel('craft'); }
    else if(a==='qa'){ FW.q[v]=1; gT.push({t:'MISSAO ACEITA',l:150}); freePanel('talk',arg); }
    else if(a==='qt'){ const q=QUESTS.find(x=>x.id===v); if(q){ for(const k in (q.take||{})) fAdd(k,-q.take[k]); for(const k in q.rw) fAdd(k,q.rw[k]); FW.q[v]=2; sfx('coin'); gT.push({t:'MISSAO CONCLUIDA!',l:200}); } freePanel('talk',arg); } });
}
function freeExit(){ freeSave(); FUI=0; sh.style.display='none'; leaveRoom(); document.body.classList.remove('freemode'); FW=null; scene='menu'; started=false; menuEl.style.display='flex'; showMenu(); }
function showFree(msg){
  scene='menu'; buildBackdrop(1); menuEl.style.display='flex';
  let sv='',nm='',cd=''; try{ sv=localStorage.getItem('vc_server')||''; nm=localStorage.getItem('vc_freename')||'Meu Mundo'; cd=localStorage.getItem('vc_freecode')||''; }catch(_){}
  mbox.innerHTML=`<div class="full c1"><div class="row"><button class="fl ghost" id="fback">← Voltar</button><button class="fl big" id="fgo">⛏️ JOGAR</button></div></div>
  <div class="c1"><h2>⛏️ MODO LIVRE</h2><p>Mundo aberto de sobrevivência: minere, construa, fabrique todas as armas, enfrente zumbis, esqueletos e goblins, derrote 3 chefes e faça missões. Toque na tela para minerar/construir/atacar. Até 3 jogadores.</p>${msg?`<p class="msg">${msg}</p>`:''}</div>
  <div class="c2"><input id="fname" maxlength="16" placeholder="nome do mundo" value="${nm}" aria-label="Nome do mundo"><input id="rc" maxlength="8" placeholder="código para jogar com amigos (vazio = solo)" value="${cd}" aria-label="Código da sala"><input id="srv" placeholder="Servidor (só para jogar online)" value="${sv}" aria-label="Servidor"></div>`;
  document.getElementById('fback').onclick=()=>showMenu();
  document.getElementById('fgo').onclick=()=>freeStart(document.getElementById('fname').value||'Meu Mundo',document.getElementById('rc').value);
  prevLoop(); fitMenu();
}
async function freeStart(name,code){
  code=String(code||'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,8);
  try{ localStorage.setItem('vc_freename',name); localStorage.setItem('vc_freecode',code); }catch(_){}
  if(code){ const sv=document.getElementById('srv'); if(sv){ try{ localStorage.setItem('vc_server',sv.value.trim()); }catch(_){} } const RR=(RM&&!(sv&&sv.value.trim()))?RM:WSRM;
    try{ mp.r=await RR.join('livre-'+code); }catch(e){ mp.r=null; const m=String(e&&e.message||''); showFree(m==='full'?'Sala cheia (máx. 3).':m==='noserver'?'Informe o endereço do servidor.':'Não consegui conectar ao servidor.'); return; }
    mp.code=code; mp.t=Date.now(); mp.n=0; mp.seen={}; mp.evl=[]; mp.sm={}; mp.lc={}; mp.r.presence({t:mp.t,n:look.name,lk:lookPack(),lv:0}); mp.r.onPeers(onMates); }
  freeNew(name,code); menuEl.style.display='none'; scene='free'; started=true; canResume=false; FUI=0; document.body.classList.add('freemode'); startMusic();
  gT.push({t:'FALE COM O MARIO DA SILVA NETO PARA COMECAR',l:300});
}
(function(){ const cv=document.getElementById('c'); if(!cv) return;
  const pos=e=>{ const r=cv.getBoundingClientRect(); return {x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}; };
  cv.addEventListener('pointerdown',e=>{ if(scene!=='free'||FUI||!FW) return; const q=pos(e);
    if(q.y>H-22){ const i=Math.floor((q.x-(W/2-68))/17); if(i>=0&&i<8){ FW.sel=i; return; } }
    FP.ptr={x:q.x,y:q.y,id:e.pointerId}; fTap(q); try{ cv.setPointerCapture(e.pointerId); }catch(_){} e.preventDefault(); });
  cv.addEventListener('pointermove',e=>{ if(FP&&FP.ptr&&FP.ptr.id===e.pointerId){ const q=pos(e); FP.ptr.x=q.x; FP.ptr.y=q.y; } });
  ['pointerup','pointercancel'].forEach(ev=>cv.addEventListener(ev,e=>{ if(FP&&FP.ptr&&FP.ptr.id===e.pointerId) FP.ptr=null; }));
  const cap=(id,fn)=>{ const el=document.getElementById(id); if(el) el.addEventListener('click',e=>{ if(scene==='free'){ e.stopImmediatePropagation(); e.preventDefault(); fn(); } else if(DU.on&&id==='bm'){ e.stopImmediatePropagation(); if(confirm('Sair do duelo?')) duelQuit(); } },true); };
  cap('bm',()=>{ if(FUI){ FUI=0; sh.style.display='none'; } else freePanel('menu'); }); cap('bi',()=>{ if(FUI){ FUI=0; sh.style.display='none'; } else freePanel('inv'); }); cap('bt',()=>{ if(FUI){ FUI=0; sh.style.display='none'; } else freePanel('quest'); });
})();
