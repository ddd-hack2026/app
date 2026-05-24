//樽壊した音
const barrelBreakSound = new Audio("sound/0010095.mp3");
document.addEventListener("click", () => {
  barrelBreakSound.play();
  barrelBreakSound.pause();
  barrelBreakSound.currentTime = 0;
}, { once: true });
//爆発音
const explosionSound = new Audio("sound/Explosion04-1(short).mp3");
//gameoverの音
const gameOverSound = new Audio("sound/gameover.mp3");


// ══════════════════════════════════════════════
//  WORD LISTS
// ══════════════════════════════════════════════
const WORDS={
  jp:{
    easy:[
      {display:'ねこ',input:'neko'},{display:'いぬ',input:'inu'},{display:'そら',input:'sora'},
      {display:'うみ',input:'umi'},{display:'やま',input:'yama'},{display:'はな',input:'hana'},
      {display:'つき',input:'tuki'},{display:'ほし',input:'hosi'},{display:'かわ',input:'kawa'},
      {display:'はる',input:'haru'},{display:'なつ',input:'natu'},{display:'あき',input:'aki'},
      {display:'ふゆ',input:'huyu'},{display:'あさ',input:'asa'},{display:'よる',input:'yoru'},
      {display:'くも',input:'kumo'},{display:'かぜ',input:'kaze'},{display:'ゆき',input:'yuki'},
      {display:'あめ',input:'ame'},{display:'きし',input:'kisi'},
    ],
    normal:[
      {display:'りんご',input:'ringo'},{display:'みかん',input:'mikan'},{display:'さかな',input:'sakana'},
      {display:'とり',input:'tori'},{display:'くるま',input:'kuruma'},{display:'でんき',input:'denki'},
      {display:'えんぴつ',input:'enpitu'},{display:'かがみ',input:'kagami'},{display:'ながれ',input:'nagare'},
      {display:'にわとり',input:'niwatori'},{display:'たいよう',input:'taiyou'},{display:'さくら',input:'sakura'},
      {display:'うごかす',input:'ugokasu'},{display:'こどもの',input:'kodomono'},
    ],
    hard:[
      {display:'でんしゃ',input:'densya'},{display:'ひこうき',input:'hikouki'},{display:'たべもの',input:'tabemono'},
      {display:'のみもの',input:'nomimono'},{display:'おにぎり',input:'onigiri'},{display:'たんぽぽ',input:'tanpopo'},
      {display:'かんがえる',input:'kangaeru'},{display:'はなびら',input:'hanabira'},{display:'うごかない',input:'ugokanai'},
      {display:'ふしぎな',input:'husigina'},{display:'おおきなき',input:'ookinaki'},{display:'ゆめをみる',input:'yumewomiru'},
    ],
  },
  en:{
    easy:[
      {display:'cat',input:'cat'},{display:'dog',input:'dog'},{display:'sky',input:'sky'},
      {display:'sea',input:'sea'},{display:'star',input:'star'},{display:'moon',input:'moon'},
      {display:'fire',input:'fire'},{display:'tree',input:'tree'},{display:'bird',input:'bird'},
      {display:'fish',input:'fish'},{display:'rain',input:'rain'},{display:'wind',input:'wind'},
      {display:'snow',input:'snow'},{display:'gold',input:'gold'},{display:'king',input:'king'},
    ],
    normal:[
      {display:'apple',input:'apple'},{display:'barrel',input:'barrel'},{display:'typing',input:'typing'},
      {display:'speed',input:'speed'},{display:'score',input:'score'},{display:'bonus',input:'bonus'},
      {display:'flame',input:'flame'},{display:'cloud',input:'cloud'},{display:'storm',input:'storm'},
      {display:'power',input:'power'},{display:'combo',input:'combo'},{display:'magic',input:'magic'},
      {display:'sword',input:'sword'},{display:'jungle',input:'jungle'},{display:'monkey',input:'monkey'},
    ],
    hard:[
      {display:'keyboard',input:'keyboard'},{display:'mountain',input:'mountain'},
      {display:'thunderbolt',input:'thunderbolt'},{display:'adventure',input:'adventure'},
      {display:'destroyer',input:'destroyer'},{display:'challenge',input:'challenge'},
      {display:'explosion',input:'explosion'},{display:'fantastic',input:'fantastic'},
      {display:'superhero',input:'superhero'},{display:'blizzard',input:'blizzard'},
      {display:'overdrive',input:'overdrive'},{display:'lightning',input:'lightning'},
    ],
  }
};

// ══════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════
const FLOOR_H=14,BARREL_R=14,FLOOR_MAX_HP=6,GRAVITY=0.50;
const TNT_CHANCE=0.12,TNT_RADIUS=120;
const DIFFS=['easy','normal','hard'];
const FLOOR_DEFS=[
  {x:20,y:100,w:260,tilt:18,dropDir:1},
  {x:200,y:200,w:400,tilt:-16,dropDir:-1},
  {x:20,y:300,w:380,tilt:14,dropDir:1},
  {x:160,y:390,w:440,tilt:-12,dropDir:-1},
  {x:0,y:490,w:640,tilt:0,dropDir:1},
];

// barrel type defs
const BARREL_TYPES={
  normal:{color:'#a05020',label:'',hp:1,speed:1,score:1},
  heavy:{color:'#4444aa',label:'HEAVY',hp:2,speed:0.5,score:3},
  split:{color:'#229922',label:'SPLIT',hp:1,speed:0.9,score:1.5},
  fast:{color:'#ff8800',label:'FAST',hp:1,speed:2.2,score:2},
  curse:{color:'#880088',label:'CURSE',hp:1,speed:1,score:4},
  tnt:{color:'#cc1100',label:'TNT',hp:1,speed:1,score:0},
  boss:{color:'#dd2200',label:'BOSS',hp:10,speed:0.4,score:20},
};

// 事前ロード用（canvasに直接描画するためのImageオブジェクト）
const START_IMG = new Image(); START_IMG.src = 'images/start_bg.png';
const GAME_IMG  = new Image(); GAME_IMG.src  = 'images/game_bg.png';
const GAMEOVER_IMG = new Image(); GAMEOVER_IMG.src = 'images/gameover_bg.png';

// specials
const SPECIALS=[
  {id:'burst',name:'🔥 FIRE BURST',desc:'全樽を爆発！'},
  {id:'slow',name:'⚡ OVERDRIVE',desc:'5秒間スロー'},
  {id:'auto',name:'🌀 AUTO TYPE',desc:'自動入力補助3秒'},
];

// ══════════════════════════════════════════════
//  DOM
// ══════════════════════════════════════════════
const canvas=document.getElementById('c');
const ctx=canvas.getContext('2d');
const overlay=document.getElementById('overlay');
const inputBox=document.getElementById('input-box');
const sScore=document.getElementById('s-score');
const sLv=document.getElementById('s-lv');
const sLives=document.getElementById('s-lives');
const sCombo=document.getElementById('s-combo');
const sMult=document.getElementById('s-mult');
const sSpecial=document.getElementById('s-special');
const gaugeFill=document.getElementById('gauge-fill');
const comboFlash=document.getElementById('combo-flash');
const rageBanner=document.getElementById('rage-banner');
const specialFlash=document.getElementById('special-flash');
const upgradePanel=document.getElementById('upgrade-panel');

// ══════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════
let floors=[],barrels=[],particles=[],explosions=[],floatingTexts=[];
let score=0,lives=3,level=1,frame=0;
let spawnTimer=0,spawnInterval=40,baseSpeed=1.0;
let gameRunning=false,currentInput='';
let gameScene='title';
let useJP=true,diffIndex=0;
let combo=0,maxCombo=0,comboMult=1,specialGauge=0;
let missStreak=0,rageMode=false;
let slowTimer=0,autoTimer=0;
let missEffectTimer=0;
let bossActive=false,bossHP=10;
let waveKills=0,wavesCleared=0;
let upgradeQueue=[];
let upgrades={comboBonus:0,tntPower:0,slowPower:0,extraLives:0,scoreBoost:0};
let animFrame=null;
let activeSpecial=null;

// ══════════════════════════════════════════════
//  FLOOR INIT
// ══════════════════════════════════════════════
function initFloors(){
  floors=FLOOR_DEFS.map((def,i)=>({
    ...def,
    hp:(i===0||i===4)?999:FLOOR_MAX_HP,
    broken:false,shakeT:0
  }));
}

function floorY(fl,x){return fl.y+((x-fl.x)/fl.w)*fl.tilt;}
function floorAngle(fl){return Math.atan2(fl.tilt,fl.w);}

// ══════════════════════════════════════════════
//  UI HELPERS
// ══════════════════════════════════════════════
function setDiff(i,el){
  diffIndex=i;
  document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
}
function toggleMode(){
  useJP=!useJP;
  document.getElementById('mode-btn').textContent='MODE: '+(useJP?'ひらがな(ROMA)':'ENGLISH');
}
function updateHUD(){
  sScore.textContent='SCORE: '+score;
  sLv.textContent='LV '+level;
  sLives.innerHTML='❤️'.repeat(Math.max(0,lives));
  const comboColor=combo>=30?'#ff4488':combo>=15?'#ff8800':combo>=5?'#ffcc00':'#88ff88';
  sCombo.textContent=combo>1?'COMBO x'+combo:'';
  sCombo.style.color=comboColor;
  sCombo.style.textShadow=`0 0 12px ${comboColor}`;
  sMult.textContent='x'+comboMult.toFixed(1);
  sMult.style.color=comboMult>2?'#ff8844':comboMult>1.5?'#ffcc00':'#88ffcc';
  const gp=Math.min(100,specialGauge);
  gaugeFill.style.width=gp+'%';
  gaugeFill.style.background=gp>=100?'linear-gradient(90deg,#ff8800,#ffff00)':'linear-gradient(90deg,#4488ff,#88ffff)';
  sSpecial.textContent=gp>=100?'▶ SPECIAL READY [Q]':'SPECIAL '+(gp|0)+'%';
  sSpecial.style.color=gp>=100?'#ffff00':'#88ffff';
  if(rageMode){
    rageBanner.style.opacity='1';
    rageBanner.style.animation='none';
  } else {
    rageBanner.style.opacity='0';
  }
}

function showComboFlash(text,color='#ffcc00'){
  comboFlash.textContent=text;
  comboFlash.style.color=color;
  comboFlash.style.opacity='1';
  comboFlash.style.fontSize='22px';
  comboFlash.style.textShadow=`0 0 20px ${color}`;
  clearTimeout(comboFlash._t);
  comboFlash._t=setTimeout(()=>{
    comboFlash.style.opacity='0';
    comboFlash.style.fontSize='0';
  },700);
}

function showSpecialFlash(text){
  specialFlash.textContent=text;
  specialFlash.style.opacity='1';
  specialFlash.style.fontSize='26px';
  clearTimeout(specialFlash._t);
  specialFlash._t=setTimeout(()=>{
    specialFlash.style.opacity='0';
    specialFlash.style.fontSize='0';
  },1200);
}

function addFloatingText(x,y,text,color='#ffcc00',size=14){
  floatingTexts.push({x,y,vy:-2,text,color,size,life:1});
}

// ══════════════════════════════════════════════
//  WORD & SPAWN
// ══════════════════════════════════════════════
function getWordEntry(){
  const lang=useJP?'jp':'en';
  const list=WORDS[lang][DIFFS[diffIndex]];
  const usedInputs=new Set(barrels.map(b=>b.input));
  const avail=list.filter(w=>!usedInputs.has(w.input));
  const pool=avail.length>0?avail:list;
  return pool[Math.floor(Math.random()*pool.length)];
}

function spawnBarrel(forceType=null){
  const entry=getWordEntry();
  const speed=(baseSpeed+Math.random()*0.5+diffIndex*0.002)*(rageMode?1.5:1);
  const fl0=floors[0];
  const sx=fl0.x+30;
  const sy=floorY(fl0,sx)-BARREL_R;

  let type='normal';
  if(forceType){
    type=forceType;
  } else {
    const r=Math.random();
    if(r<TNT_CHANCE*(rageMode?1.5:1)) type='tnt';
    else if(r<0.3) type='fast';
    else if(r<0.4) type='heavy';
    else if(r<0.5) type='split';
    else if(r<0.6) type='curse';
  }

  const def=BARREL_TYPES[type];
  let display=type==='tnt'?'TNT':entry.display;
  let input=type==='tnt'?'tnt':entry.input;

  if(type==='fast'){
    const lang=useJP?'jp':'en';
    const short=WORDS[lang].easy;
    const w=short[Math.floor(Math.random()*short.length)];
    display=w.display;input=w.input;
  }
  if(type==='heavy'){
    const lang=useJP?'jp':'en';
    const long=WORDS[lang].hard;
    const w=long[Math.floor(Math.random()*long.length)];
    display=w.display;input=w.input;
  }

  barrels.push({
    x:sx,y:sy,vx:speed*def.speed*(def.dropDir||1),vy:0,
    display,input,typed:'',rot:0,
    floorIdx:0,falling:false,vxSet:false,
    type,hp:def.hp,maxHp:def.hp,
    curse:type==='curse',
  });
}

// ══════════════════════════════════════════════
//  BACKGROUND
// ══════════════════════════════════════════════
function drawBG(){
  // 描画用背景画像がロードされていればそれを表示（タイトル/ゲーム/ゲームオーバー別）
  function drawImageCover(img){
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if(!iw||!ih) return;
    const canvasRatio = 640/560;
    const imgRatio = iw/ih;
    let dw,dh,dx,dy;
    if(imgRatio>canvasRatio){
      dh = 560; dw = dh*imgRatio; dx = (640-dw)/2; dy = 0;
    } else {
      dw = 640; dh = dw/imgRatio; dx = 0; dy = (560-dh)/2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  if(gameScene==='title' && START_IMG && START_IMG.complete){ drawImageCover(START_IMG); return; }
  if(gameScene==='gameover' && GAMEOVER_IMG && GAMEOVER_IMG.complete){ drawImageCover(GAMEOVER_IMG); return; }
  if(GAME_IMG && GAME_IMG.complete){ drawImageCover(GAME_IMG); }
  else if(START_IMG && START_IMG.complete){ drawImageCover(START_IMG); }
  // フォールバックのグリッド背景
  ctx.fillStyle='#0a0005';
  ctx.fillRect(0,0,640,560);
  ctx.strokeStyle='rgba(80,20,120,.12)';
  ctx.lineWidth=1;
  for(let x=0;x<640;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,560);ctx.stroke();}
  for(let y=0;y<560;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(640,y);ctx.stroke();}
  for(let y=0;y<560;y+=3){ ctx.fillStyle='rgba(0,0,0,.18)'; ctx.fillRect(0,y,640,1); }
}

function drawFloors(){
  floors.forEach((fl)=>{
    if(fl.broken)return;
    const shake=fl.shakeT>0?(Math.random()-.5)*3:0;
    const ox=shake,oy=shake;
    const topY=fl.y+oy,topYr=fl.y+fl.tilt+oy;
    const botY=topY+FLOOR_H,botYr=topYr+FLOOR_H;

    ctx.beginPath();
    ctx.moveTo(fl.x+ox,topY+4);ctx.lineTo(fl.x+fl.w+ox,topYr+4);
    ctx.lineTo(fl.x+fl.w+ox,botYr+4);ctx.lineTo(fl.x+ox,botY+4);
    ctx.closePath();
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fill();

    const ratio=fl.hp/FLOOR_MAX_HP;
    const r=Math.floor(204-(1-ratio)*100);
    const g=Math.floor(51-(1-ratio)*40);
    ctx.beginPath();
    ctx.moveTo(fl.x+ox,topY);ctx.lineTo(fl.x+fl.w+ox,topYr);
    ctx.lineTo(fl.x+fl.w+ox,botYr);ctx.lineTo(fl.x+ox,botY);
    ctx.closePath();
    const grad=ctx.createLinearGradient(fl.x,topY,fl.x,botY+FLOOR_H);
    grad.addColorStop(0,`rgb(${r},${g},0)`);
    grad.addColorStop(0.4,`rgb(${Math.floor(r*.75)},${Math.floor(g*.75)},0)`);
    grad.addColorStop(1,`rgb(${Math.floor(r*.5)},${Math.floor(g*.5)},0)`);
    ctx.fillStyle=grad;ctx.fill();

    ctx.beginPath();
    ctx.moveTo(fl.x+ox,topY);ctx.lineTo(fl.x+fl.w+ox,topYr);
    ctx.strokeStyle=ratio>.5?'#ff6644':'#ff2200';ctx.lineWidth=2;ctx.stroke();

    if(fl.hp<FLOOR_MAX_HP){
      const crackA=(1-ratio)*.85;
      ctx.globalAlpha=crackA;ctx.strokeStyle='#000';ctx.lineWidth=1.2;
      for(let ci=0;ci<Math.floor((1-ratio)*5)+1;ci++){
        const cx=fl.x+fl.w*(.15+ci*.17);
        const cy=floorY(fl,cx);
        ctx.beginPath();ctx.moveTo(cx+ox,cy+oy);ctx.lineTo(cx+6+ox,cy+FLOOR_H*.6+oy);ctx.lineTo(cx+2+ox,cy+FLOOR_H+oy);ctx.stroke();
      }
      ctx.globalAlpha=1;
    }
    for(let rx=fl.x+20;rx<fl.x+fl.w-10;rx+=40){
      const ry=floorY(fl,rx)+FLOOR_H/2;
      ctx.beginPath();ctx.arc(rx+ox,ry+oy,3,0,Math.PI*2);
      ctx.fillStyle=ratio>.5?'#ff9966':'#ff4400';ctx.fill();
    }
    if(fl.hp<=2&&fl.hp>0){
      ctx.font='bold 9px monospace';ctx.fillStyle='#ff0';
      ctx.fillText('⚠ '+fl.hp,fl.x+fl.w/2-10,fl.y-4);
    }
    if(fl.shakeT>0)fl.shakeT--;
  });
}

function drawKong(){
  const fl=floors[0];if(fl.broken)return;
  const kx=fl.x+10,ky=floorY(fl,kx)-10;
  if(rageMode){
    ctx.save();
    ctx.translate(kx+10,ky-10);
    ctx.scale(1.15,1.15);
    ctx.shadowColor='#ff0000';ctx.shadowBlur=15;
    ctx.font='44px serif';ctx.fillText('🦍',-22,0);
    ctx.restore();
  } else {
    ctx.font='44px serif';ctx.fillText('🦍',kx-10,ky);
  }
}

// ══════════════════════════════════════════════
//  BARREL DRAW
// ══════════════════════════════════════════════
function roundRect(x,y,w,h,r){
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();
}

function drawBarrel(b){
  const def=BARREL_TYPES[b.type];
  const isTNT=b.type==='tnt';
  const isFast=b.type==='fast';
  const isHeavy=b.type==='heavy';
  const isSplit=b.type==='split';
  const isCurse=b.type==='curse';
  const isBoss=b.type==='boss';

  ctx.save();
  ctx.translate(b.x,b.y);
  ctx.rotate(b.rot);

  const blink=Math.sin(frame*.2)>.2;
  const R=isBoss?22:BARREL_R;

  if(isTNT){
    ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);
    ctx.fillStyle=blink?'#ff2200':'#cc1100';ctx.fill();
    ctx.strokeStyle='#ffcc00';ctx.lineWidth=2;ctx.stroke();
    ctx.rotate(-b.rot);
    ctx.font='bold 10px monospace';ctx.fillStyle=blink?'#ffff00':'#fff';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('TNT',0,0);
  } else if(isBoss){
    ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);
    const bg=ctx.createRadialGradient(-6,-6,3,0,0,R);
    bg.addColorStop(0,'#ff4422');bg.addColorStop(1,'#660000');
    ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle='#ffaa00';ctx.lineWidth=3;ctx.stroke();
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+frame*.03;
      ctx.beginPath();ctx.moveTo(Math.cos(a)*R,Math.sin(a)*R);
      ctx.lineTo(Math.cos(a)*(R+8),Math.sin(a)*(R+8));
      ctx.strokeStyle='#ff4400';ctx.lineWidth=2;ctx.stroke();
    }
    ctx.rotate(-b.rot);
    ctx.font='bold 8px monospace';ctx.fillStyle='#ffff00';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('BOSS',0,0);
  } else {
    ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);
    const baseCol=isFast?'#ff6600':isHeavy?'#5555cc':isSplit?'#22aa22':isCurse?'#aa00cc':'#a05020';
    const darkCol=isFast?'#883300':isHeavy?'#222266':isSplit?'#115511':isCurse?'#550066':'#5a2800';
    const bg=ctx.createRadialGradient(-4,-4,2,0,0,R);
    bg.addColorStop(0,baseCol);bg.addColorStop(1,darkCol);
    ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.5;ctx.stroke();
    if(!isCurse){
      [-6,0,6].forEach(dy=>{
        ctx.beginPath();ctx.ellipse(0,dy,R,4,0,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=1;ctx.stroke();
      });
      [-7,7].forEach(dy=>{
        ctx.beginPath();ctx.moveTo(-R,dy);ctx.lineTo(R,dy);
        ctx.strokeStyle=isFast?'#ffcc44':isHeavy?'#aaaaff':isSplit?'#88ff88':'#ddaa44';
        ctx.lineWidth=2;ctx.stroke();
      });
    } else {
      ctx.beginPath();
      for(let t=0;t<Math.PI*6;t+=0.1){
        const rs=t/18;const xa=Math.cos(t+frame*.1)*rs*R*.8,ya=Math.sin(t+frame*.1)*rs*R*.8;
        t===0?ctx.moveTo(xa,ya):ctx.lineTo(xa,ya);
      }
      ctx.strokeStyle='rgba(255,0,255,.6)';ctx.lineWidth=1.5;ctx.stroke();
    }
  }
  ctx.restore();

  if((isHeavy||isBoss)&&b.hp<b.maxHp){
    const bw=R*2+10;
    const bx=b.x-bw/2,by=b.y+R+4;
    ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(bx,by,bw,5);
    ctx.fillStyle=isBoss?'#ff4400':'#4488ff';
    ctx.fillRect(bx,by,bw*(b.hp/b.maxHp),5);
  }

  const fSize=isBoss?12:(useJP&&!isTNT?18:13);
  ctx.font=`bold ${fSize}px ${useJP&&!isTNT?'sans-serif':"'Press Start 2P'"}`;

  let displayStr=b.display;
  if(isCurse&&b.hp>0){
    if(!b.typed.length){
      const chars=[...'abcdefghijklmnopqrstuvwxyz'];
      displayStr=[...b.display].map(c=>Math.random()<.4?chars[Math.floor(Math.random()*chars.length)]:c).join('');
    }
  }
  const tw=ctx.measureText(displayStr).width;
  const typedLen=b.typed.length;
  const ratio=b.input.length>0?typedLen/b.input.length:0;
  const doneChars=Math.round(displayStr.length*ratio);
  const donePart=displayStr.slice(0,doneChars);
  const restPart=displayStr.slice(doneChars);
  const dw=ctx.measureText(donePart).width;
  const lx=b.x-tw/2,ly=b.y-BARREL_R-12;

  ctx.fillStyle=isTNT?'rgba(60,0,0,.9)':isBoss?'rgba(80,0,0,.95)':'rgba(0,0,0,.8)';
  ctx.beginPath();roundRect(lx-6,ly-16,tw+12,24,4);ctx.fill();

  if(b.type!=='normal'&&b.type!=='tnt'&&b.type!=='boss'){
    ctx.font='bold 7px monospace';
    const lbl=def.label;
    const lw=ctx.measureText(lbl).width;
    const lcol=isFast?'#ff8800':isHeavy?'#8888ff':isSplit?'#44ff44':isCurse?'#ff44ff':'#fff';
    ctx.fillStyle=lcol;ctx.fillText(lbl,b.x-lw/2,b.y+BARREL_R+10);
    ctx.font=`bold ${fSize}px ${useJP&&!isTNT?'sans-serif':"'Press Start 2P'"}`;
  }

  ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=5;
  ctx.fillStyle='#44ff88';ctx.fillText(donePart,lx,ly);
  ctx.fillStyle=isTNT?'#ffcc00':isBoss?'#ff8844':'#fff';ctx.fillText(restPart,lx+dw,ly);
  ctx.shadowBlur=0;

  if(useJP&&b.typed.length>0&&!isTNT){
    ctx.font='bold 9px monospace';
    const subW=ctx.measureText(b.typed).width;
    const sx=b.x-subW/2,sy=b.y+BARREL_R+22;
    ctx.fillStyle='rgba(0,0,0,.75)';ctx.beginPath();roundRect(sx-3,sy-10,subW+6,13,2);ctx.fill();
    ctx.fillStyle='#88ffcc';ctx.fillText(b.typed,sx,sy);
  }

  ctx.textAlign='left';ctx.textBaseline='alphabetic';
}

// ══════════════════════════════════════════════
//  PARTICLES & FX
// ══════════════════════════════════════════════
function addParticles(x,y,big=false,color=null){
  const n=big?40:16,spd=big?12:8;
  for(let i=0;i<n;i++){
    particles.push({
      x,y,vx:(Math.random()-.5)*spd,vy:(Math.random()-.5)*spd-(big?4:2),
      life:1,size:big?(3+Math.random()*4):3,
      color:color||`hsl(${big?Math.random()*60:20+Math.random()*50},100%,${big?70:60}%)`
    });
  }
}
function addExplosion(x,y,big=false){
  explosions.push({x,y,r:0,life:1,big});
}
function drawExplosions(){
  explosions=explosions.filter(e=>{
    e.r+=(e.big?14:8);e.life-=0.07;
    ctx.globalAlpha=e.life*.5;
    const grad=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r);
    grad.addColorStop(0,'#ffff88');grad.addColorStop(.4,'#ff6600');grad.addColorStop(1,'rgba(255,0,0,0)');
    ctx.fillStyle=grad;ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;return e.life>0;
  });
}
function drawParticles(){
  particles=particles.filter(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=.2;p.life-=.04;
    ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;
    ctx.beginPath();ctx.arc(p.x,p.y,p.size||3,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;return p.life>0;
  });
}
function drawFloatingTexts(){
  floatingTexts=floatingTexts.filter(t=>{
    t.y+=t.vy;t.life-=.025;
    ctx.globalAlpha=Math.max(0,t.life);
    ctx.font=`bold ${t.size}px 'Press Start 2P'`;
    ctx.fillStyle=t.color;
    ctx.textAlign='center';
    ctx.fillText(t.text,t.x,t.y);
    ctx.textAlign='left';ctx.globalAlpha=1;
    return t.life>0;
  });
}

// ══════════════════════════════════════════════
//  TNT & DAMAGE
// ══════════════════════════════════════════════
function triggerTNT(tntBarrel){
  const bigExplosion=upgrades.tntPower>=1;
  addParticles(tntBarrel.x,tntBarrel.y,true);
  addExplosion(tntBarrel.x,tntBarrel.y,bigExplosion);
  const r=TNT_RADIUS*(bigExplosion?1.5:1);
  score+=500;
  // find up to 2 nearest barrels in range
  const inRange=barrels
    .filter(b=>b!==tntBarrel&&Math.hypot(b.x-tntBarrel.x,b.y-tntBarrel.y)<r)
    .sort((a,b)=>Math.hypot(a.x-tntBarrel.x,a.y-tntBarrel.y)-Math.hypot(b.x-tntBarrel.x,b.y-tntBarrel.y))
    .slice(0,2);
  const destroySet=new Set(inRange);
  barrels=barrels.filter(b=>{
    if(b===tntBarrel)return false;
    if(destroySet.has(b)){addParticles(b.x,b.y,false);addExplosion(b.x,b.y,false);score+=b.display.length*5;return false;}
    return true;
  });
  floors.forEach(fl=>{
    if(fl.broken)return;
    const dist=Math.hypot(fl.x+fl.w/2-tntBarrel.x,fl.y+fl.tilt/2-tntBarrel.y);
    if(dist<r*1.2)damageFloor(fl,2);
  });
  comboKill();updateHUD();
}

function damageFloor(fl,dmg=1){
  if(fl.broken||fl.hp>=999)return;
  fl.hp=Math.max(0,fl.hp-dmg);fl.shakeT=8;
  if(fl.hp<=0){
    fl.broken=true;
    for(let i=0;i<20;i++){
      particles.push({x:fl.x+Math.random()*fl.w,y:fl.y+Math.random()*FLOOR_H,vx:(Math.random()-.10)*6,vy:-Math.random()*4,life:1,size:4,color:'#cc3300'});
    }
  }
}

// ══════════════════════════════════════════════
//  COMBO SYSTEM
// ══════════════════════════════════════════════
function comboKill(){
  combo++;waveKills++;
  if(combo>maxCombo)maxCombo=combo;
  missStreak=0;
  comboMult=1+Math.floor(combo/5)*.25+(upgrades.comboBonus*.15);
  comboMult=Math.min(comboMult,4.0);
  specialGauge=Math.min(100,specialGauge+8+(combo>10?4:0));
  if(combo===5)showComboFlash('COMBO x5! 🔥','#ffcc00');
  else if(combo===10)showComboFlash('COMBO x10!! ⚡','#ff8800');
  else if(combo===15)showComboFlash('COMBO x15!!! 🌀','#ff4488');
  else if(combo===20)showComboFlash('COMBO x20!!!! 💥','#ff2244');
  else if(combo===30)showComboFlash('★ OVERDRIVE ★','#ff00ff');
  else if(combo>=5&&combo%10===0)showComboFlash('COMBO x'+combo+'!!!','#ff00aa');
  updateHUD();
}

function breakCombo(){
  combo=0;comboMult=1;
  missStreak++;
  if(missStreak>=3){
    rageMode=true;
    showComboFlash('💢 RAGE MODE','#ff0000');
  }
  updateHUD();
}

// ══════════════════════════════════════════════
//  SPECIALS
// ══════════════════════════════════════════════
function fireSpecial(){
  if(specialGauge<100)return;
  specialGauge=0;
  const sp=SPECIALS[Math.floor(Math.random()*SPECIALS.length)];
  activeSpecial=sp.id;
  showSpecialFlash(sp.name+'\n'+sp.desc);

  if(sp.id==='burst'){
    let bossKilled=false;
    barrels.forEach(b=>{
      addParticles(b.x,b.y,true);addExplosion(b.x,b.y,true);
      score+=b.input.length*20;
      if(b.type==='boss')bossKilled=true;
    });
    barrels=[];
    if(bossKilled){
      score+=5000;
      bossActive=false;rageMode=false;
      combo+=10;comboKill();
      addFloatingText(320,180,'★ BOSS DOWN ★','#ffff00',20);
      setTimeout(showUpgrade,500);
    }
    addFloatingText(320,200,'🔥 FIRE BURST!',`#ff4400`,20);
  } else if(sp.id==='slow'){
    slowTimer=300+(upgrades.slowPower*120);
    addFloatingText(320,200,'⚡ OVERDRIVE!','#88ffff',18);
  } else if(sp.id==='auto'){
    autoTimer=180;
    addFloatingText(320,200,'🌀 AUTO TYPE','#aaffcc',18);
  }
  updateHUD();
}

// ══════════════════════════════════════════════
//  BARREL PHYSICS
// ══════════════════════════════════════════════
function updateBarrel(b){
  const speedMult=slowTimer>0?.25:1;
  b.vy+=GRAVITY*speedMult;
  b.x+=b.vx*speedMult;
  b.y+=b.vy*speedMult;

  let landed=false;
  for(let i=0;i<floors.length;i++){
    const fl=floors[i];
    if(fl.broken)continue;
    if(b.x<fl.x-BARREL_R||b.x>fl.x+fl.w+BARREL_R)continue;
    const fy=floorY(fl,b.x)-BARREL_R;
    if(b.y>=fy&&b.y<=fy+30&&b.vy>=0){
      b.y=fy;b.vy=0;b.floorIdx=i;b.falling=false;
      if(!b.vxSet){
        b.vx=fl.tilt>=0?Math.abs(b.vx):-Math.abs(b.vx);
        b.vxSet=true;damageFloor(fl,1);
      }
      b.vx=Math.max(-7.5,Math.min(7.5,b.vx));
      landed=true;break;
    }
  }
  if(!landed){b.falling=true;b.vxSet=false;}
  if(!b.falling&&b.floorIdx>=0){
    const fl=floors[b.floorIdx];
    if(fl.broken||b.x>fl.x+fl.w+BARREL_R||b.x<fl.x-BARREL_R){
      b.falling=true;b.floorIdx=-1;b.vxSet=false;b.vy=.35;
    }
  }
  b.rot+=b.vx*.05;
  if(b.y>590||b.x<-80||b.x>720){
     // 樽が壊れた音を鳴らす
    barrelBreakSound.currentTime = 0;
    barrelBreakSound.play();
    if(b.type==='boss'){bossActive=false;return'bossmiss';}
    return'miss';
  }
  return'ok';
}

// ══════════════════════════════════════════════
//  TYPING
// ══════════════════════════════════════════════
function normalizeN(s){return s.replace(/nn/g,'n');}
function inputMatches(typed,target){
  if(!typed.length)return false;
  const nt=normalizeN(target);
  if(nt.startsWith(normalizeN(typed)))return true;
  if(typed.endsWith('n')&&nt.startsWith(normalizeN(typed.slice(0,-1)+'nn')))return true;
  return false;
}
function inputComplete(typed,target){
  const nt=normalizeN(target);
  if(normalizeN(typed)===nt)return true;
  if(typed.endsWith('n')&&normalizeN(typed.slice(0,-1)+'nn')===nt)return true;
  return false;
}

function checkTyping(){
  let target=null;
  for(const b of barrels){
    if(inputMatches(currentInput,b.input)){
      if(!target||currentInput.length>target.typed.length)target=b;
    }
  }
  barrels.forEach(b=>b.typed='');
  if(target){
    target.typed=currentInput;
    if(inputComplete(target.typed,target.input)&&currentInput.length>=1){
      const def=BARREL_TYPES[target.type];
      target.hp--;
      if(target.hp>0){
        addFloatingText(target.x,target.y-20,'HIT!','#4488ff',12);
        addParticles(target.x,target.y,false,'#4488ff');
        currentInput='';inputBox.textContent='　';
        barrels.forEach(b=>b.typed='');
        return;
      }
      // ★★★ 樽が壊れる瞬間（ここで音を鳴らす）★★★
        barrelBreakSound.currentTime = 0;
        barrelBreakSound.play();
      if(target.type==='tnt'){
         // ★ 爆発音を鳴らす
    explosionSound.currentTime = 0;
    explosionSound.play();
        triggerTNT(target);
        barrels=barrels.filter(b=>b!==target);
      } else if(target.type==='split'){
        barrels=barrels.filter(b=>b!==target);
        addParticles(target.x,target.y,false,'#22ff22');
        addFloatingText(target.x,target.y,'SPLIT!','#44ff44',14);
        for(let i=0;i<3;i++){spawnMini(target.x,target.y);}
        comboKill();score+=Math.round(target.input.length*10*comboMult*def.score);
      } else if(target.type==='boss'){
        bossHP--;
        addParticles(target.x,target.y,true,'#ff4400');
        addExplosion(target.x,target.y);
        if(bossHP<=0){
          score+=5000;
          addFloatingText(target.x,target.y-30,'★ BOSS DOWN ★','#ffff00',20);
          barrels=barrels.filter(b=>b!==target);
          bossActive=false;rageMode=false;
          combo+=10;comboKill();
          setTimeout(showUpgrade,500);
        } else {
          target.hp=1;
          addFloatingText(target.x,target.y,bossHP+' HP LEFT!','#ff8800',12);
          barrels.forEach(b=>b.typed='');
          currentInput='';inputBox.textContent='　';
          return;
        }
      } else {
        addParticles(target.x,target.y);
        const pts=Math.round(target.input.length*10*comboMult*def.score*(1+upgrades.scoreBoost*.2));
        score+=pts;
        addFloatingText(target.x,target.y-20,'+'+pts,'#ffcc00',12);
        barrels=barrels.filter(b=>b!==target);
        comboKill();
        if(target.type==='curse')rageMode=false;
      }
      updateHUD();
      currentInput='';inputBox.textContent='　';
      barrels.forEach(b=>b.typed='');
    }
  } else {
    missEffectTimer=8;
    inputBox.classList.add('miss');
    setTimeout(()=>inputBox.classList.remove('miss'),300);
    breakCombo();
    currentInput='';inputBox.textContent='　';
    barrels.forEach(b=>b.typed='');
  }
}

function spawnMini(ox,oy){
  const entry=getWordEntry();
  barrels.push({
    x:ox+(Math.random()-.5)*30,y:oy,
    vx:(Math.random()-.5)*3,vy:-3,
    display:entry.display,input:entry.input,
    typed:'',rot:0,floorIdx:-1,falling:true,vxSet:false,
    type:'fast',hp:1,maxHp:1,curse:false,
  });
}

// ══════════════════════════════════════════════
//  AUTO TYPE helper
// ══════════════════════════════════════════════
function doAutoType(){
  if(!autoTimer||!barrels.length)return;
  let target=barrels[0];
  for(const b of barrels){if(b.y>target.y)target=b;}
  if(target&&frame%12===0){
    const nextChar=target.input[target.typed?target.typed.length:currentInput.length];
    if(nextChar){
      currentInput+=nextChar;
      inputBox.textContent=currentInput;
      checkTyping();
    }
  }
}

// ══════════════════════════════════════════════
//  UPGRADE PANEL
// ══════════════════════════════════════════════
const UPGRADE_DEFS=[
  {id:'comboBonus',name:'⚡ COMBO BOOST',desc:'コンボ倍率+15%'},
  {id:'tntPower',name:'💥 BIG BANG',desc:'TNT爆発範囲+50%'},
  {id:'slowPower',name:'🌀 SLOW EX',desc:'スロー時間+2秒'},
  {id:'extraLives',name:'❤️ EXTRA LIFE',desc:'ライフ+1'},
  {id:'scoreBoost',name:'💰 SCORE UP',desc:'スコア倍率+20%'},
];
function showUpgrade(){
  wavesCleared++;
  const opts=[];
  const avail=[...UPGRADE_DEFS];
  for(let i=0;i<3;i++){
    if(!avail.length)break;
    const idx=Math.floor(Math.random()*avail.length);
    opts.push(avail.splice(idx,1)[0]);
  }
  upgradePanel.style.display='flex';
  gameRunning=false;
  opts.forEach((o,i)=>{
    const btn=document.getElementById('upg'+i);
    btn.textContent=o.name+'\n'+o.desc+(upgrades[o.id]>0?' (Lv '+(upgrades[o.id]+1)+')':'');
    btn.onclick=()=>{
      upgrades[o.id]++;
      if(o.id==='extraLives'){lives=Math.min(lives+1,5);}
      upgradePanel.style.display='none';
      gameRunning=true;
      updateHUD();
    };
  });
}

// ══════════════════════════════════════════════
//  BOSS SPAWN
// ══════════════════════════════════════════════
function spawnBoss(){
  if(bossActive)return;
  bossActive=true;bossHP=5+diffIndex*2;
  const fl0=floors[0];
  const sx=fl0.x+50,sy=floorY(fl0,sx)-22;
  const lang=useJP?'jp':'en';
  const words=WORDS[lang].hard;
  const w=words[Math.floor(Math.random()*words.length)];
  barrels.push({
    x:sx,y:sy,vx:.35,vy:0,
    display:w.display,input:w.input,
    typed:'',rot:0,floorIdx:0,falling:false,vxSet:false,
    type:'boss',hp:1,maxHp:1,curse:false,
  });
  showComboFlash('⚠ BOSS APPEARS ⚠','#ff0000');
}

// ══════════════════════════════════════════════
//  MAIN LOOP
// ══════════════════════════════════════════════
function loop(){
  ctx.save();
  if(missEffectTimer>0){
    ctx.translate((Math.random()-.5)*14,(Math.random()-.5)*14);
  }
  ctx.clearRect(0,0,640,560);
  drawBG();

  if(gameScene==='gameover'){ctx.restore();return;}
  if(!gameRunning){ctx.restore();animFrame=requestAnimationFrame(loop);return;}

  drawFloors();drawKong();

  frame++;
  if(slowTimer>0)slowTimer--;
  if(autoTimer>0){autoTimer--;doAutoType();}

  spawnTimer++;
  const si=Math.max(70,spawnInterval-(frame/120|0));
  if(spawnTimer>=si){
    spawnTimer=0;
    if(!bossActive)spawnBarrel();
    baseSpeed=Math.min(.8,baseSpeed+.003);
    level=(frame/350|0)+1;
    updateHUD();
  }

  if(waveKills>=30&&!bossActive){
    waveKills=0;spawnBoss();
  }

  for(let i=barrels.length-1;i>=0;i--){
    const b=barrels[i];
    const res=updateBarrel(b);
    if(res==='miss'||res==='bossmiss'){
      const dmg=res==='bossmiss'?3:1;
      barrels.splice(i,1);
      lives-=dmg;missEffectTimer=12;
      if(res==='bossmiss'){
        addFloatingText(320,280,'💀 BOSS ESCAPED! -3','#ff0000',16);
        showComboFlash('💀 BOSS ESCAPED!','#ff0000');
      }
      inputBox.classList.add('miss');
      setTimeout(()=>inputBox.classList.remove('miss'),350);
      breakCombo();
      currentInput='';inputBox.textContent='　';
      barrels.forEach(b=>b.typed='');
      updateHUD();
      if(lives<=0){endGame();ctx.restore();return;}
    }
  }

  if(slowTimer>0){
    ctx.fillStyle=`rgba(0,100,255,${.04+Math.sin(frame*.1)*.02})`;
    ctx.fillRect(0,0,640,560);
    ctx.font='bold 8px monospace';ctx.fillStyle='rgba(100,200,255,.8)';
    ctx.textAlign='center';ctx.fillText('OVERDRIVE',320,20);ctx.textAlign='left';
  }
  if(autoTimer>0){
    ctx.fillStyle='rgba(0,255,120,.04)';ctx.fillRect(0,0,640,560);
  }
  if(rageMode&&Math.sin(frame*.15)>.5){
    ctx.fillStyle='rgba(255,0,0,.04)';ctx.fillRect(0,0,640,560);
  }

  drawExplosions();
  barrels.forEach(b=>drawBarrel(b));
  drawParticles();drawFloatingTexts();

  if(missEffectTimer>0){
    ctx.fillStyle=`rgba(255,0,0,${missEffectTimer/20})`;
    ctx.fillRect(-50,-50,740,660);
    missEffectTimer--;
  }

  ctx.restore();
  animFrame=requestAnimationFrame(loop);
}

// ══════════════════════════════════════════════
//  START / END
// ══════════════════════════════════════════════
function startGame(){
  initFloors();
  barrels=[];particles=[];explosions=[];floatingTexts=[];
  score=0;lives=3;level=1;frame=0;
  spawnTimer=0;spawnInterval=160;baseSpeed=9.9;
  currentInput='';missEffectTimer=0;
  combo=0;maxCombo=0;comboMult=1;specialGauge=0;
  missStreak=0;rageMode=false;
  slowTimer=0;autoTimer=0;
  bossActive=false;bossHP=0;waveKills=0;wavesCleared=0;
  upgrades={comboBonus:0,tntPower:0,slowPower:0,extraLives:0,scoreBoost:0};
  inputBox.textContent='　';inputBox.classList.remove('miss');
  gameRunning=true;gameScene='playing';
  overlay.style.display='none';
  upgradePanel.style.display='none';
  updateHUD();
  if(animFrame)cancelAnimationFrame(animFrame);
  loop();
}

function endGame(){
  gameOverSound.currentTime = 0;
    gameOverSound.play();
  gameRunning=false;gameScene='gameover';
  ctx.clearRect(0,0,640,560);
  // 可能なら gameover 画像をキャンバス全面に描画
  if(typeof GAMEOVER_IMG !== 'undefined' && GAMEOVER_IMG.complete){
    const iw = GAMEOVER_IMG.naturalWidth || GAMEOVER_IMG.width;
    const ih = GAMEOVER_IMG.naturalHeight || GAMEOVER_IMG.height;
    if(iw && ih){
      const canvasRatio = 640/560;
      const imgRatio = iw/ih;
      let dw,dh,dx,dy;
      if(imgRatio>canvasRatio){ dh = 560; dw = dh*imgRatio; dx = (640-dw)/2; dy = 0; }
      else { dw = 640; dh = dw/imgRatio; dx = 0; dy = (560-dh)/2; }
      ctx.drawImage(GAMEOVER_IMG, dx, dy, dw, dh);
    } else {
      ctx.fillStyle='#000';ctx.fillRect(0,0,640,560);
      for(let y=0;y<560;y+=3){ctx.fillStyle='rgba(80,0,0,.15)';ctx.fillRect(0,y,640,1);} 
    }
  } else {
    ctx.fillStyle='#000';ctx.fillRect(0,0,640,560);
    for(let y=0;y<560;y+=3){ctx.fillStyle='rgba(80,0,0,.15)';ctx.fillRect(0,y,640,1);} 
  }
  overlay.style.display='flex';
  overlay.innerHTML=`
    <h1 style="font-size:32px;color:#ff2200;text-shadow:0 0 24px #ff4400,2px 2px #000;text-align:center;">GAME<br>OVER</h1>
    <p style="font-family:'Press Start 2P',monospace;font-size:11px;color:#ffcc00;margin-top:8px;">SCORE: ${score}</p>
    <p style="font-family:'Press Start 2P',monospace;font-size:8px;color:#ff8844;margin-top:4px;">MAX COMBO: ${maxCombo}</p>
    <p style="font-family:'Press Start 2P',monospace;font-size:8px;color:#88ffcc;margin-top:2px;">LV ${level} まで到達！</p>
    <button onclick="location.reload()" style="font-family:'Press Start 2P',monospace;font-size:9px;background:linear-gradient(180deg,#ff9a32,#db4400);color:#fff;border:none;border-radius:8px;padding:12px 24px;cursor:pointer;margin-top:14px;">▶ もう一度</button>
  `;
}

// ══════════════════════════════════════════════
//  INPUT
// ══════════════════════════════════════════════
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    e.preventDefault();
    currentInput='';inputBox.textContent='　';
    barrels.forEach(b=>b.typed='');return;
  }
  if(e.key==='q'||e.key==='Q'){
    if(gameRunning)fireSpecial();return;
  }
  if(!gameRunning)return;
  if(e.key==='Backspace'){
    e.preventDefault();currentInput=currentInput.slice(0,-1);
  } else if(e.key.length===1&&e.key>=' '){
    currentInput+=e.key.toLowerCase();
  } else return;
  inputBox.textContent=currentInput||'　';
  checkTyping();
});

// start title loop
loop();