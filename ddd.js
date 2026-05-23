// ══════════════════════════════════════════════
//  単語リスト（ローマ字入力対応）
//  display: 画面表示用, input: 入力判定用
// ══════════════════════════════════════════════
const WORDS = {
  jp: {
    easy: [
      { display: 'ねこ',   input: 'neko'   },
      { display: 'いぬ',   input: 'inu'    },
      { display: 'そら',   input: 'sora'   },
      { display: 'うみ',   input: 'umi'    },
      { display: 'やま',   input: 'yama'   },
      { display: 'はな',   input: 'hana'   },
      { display: 'つき',   input: 'tuki'   },
      { display: 'ほし',   input: 'hosi'   },
      { display: 'かわ',   input: 'kawa'   },
      { display: 'はる',   input: 'haru'   },
      { display: 'なつ',   input: 'natu'   },
      { display: 'あき',   input: 'aki'    },
      { display: 'ふゆ',   input: 'huyu'   },
      { display: 'あさ',   input: 'asa'    },
      { display: 'よる',   input: 'yoru'   },
      { display: 'くも',   input: 'kumo'   },
      { display: 'かぜ',   input: 'kaze'   },
      { display: 'ゆき',   input: 'yuki'   },
      { display: 'あめ',   input: 'ame'    },
      { display: 'きし',   input: 'kisi'   },
    ],
    normal: [
      { display: 'りんご',   input: 'ringo'    },
      { display: 'みかん',   input: 'mikan'    },
      { display: 'さかな',   input: 'sakana'   },
      { display: 'とり',     input: 'tori'     },
      { display: 'くるま',   input: 'kuruma'   },
      { display: 'でんき',   input: 'denki'    },
      { display: 'えんぴつ', input: 'enpitu'   },
      { display: 'かがみ',   input: 'kagami'   },
      { display: 'ながれ',   input: 'nagare'   },
      { display: 'にわとり', input: 'niwatori' },
      { display: 'たいよう', input: 'taiyou'   },
      { display: 'さくら',   input: 'sakura'   },
      { display: 'うごかす', input: 'ugokasu'  },
      { display: 'こどもの', input: 'kodomono' },
    ],
    hard: [
      { display: 'でんしゃ',   input: 'densya'     },
      { display: 'ひこうき',   input: 'hikouki'    },
      { display: 'たべもの',   input: 'tabemono'   },
      { display: 'のみもの',   input: 'nomimono'   },
      { display: 'おにぎり',   input: 'onigiri'    },
      { display: 'たんぽぽ',   input: 'tanpopo'    },
      { display: 'かんがえる', input: 'kangaeru'   },
      { display: 'はなびら',   input: 'hanabira'   },
      { display: 'うごかない', input: 'ugokanai'   },
      { display: 'ふしぎな',   input: 'husigina'   },
      { display: 'おおきなき', input: 'ookinaki'   },
      { display: 'ゆめをみる', input: 'yumewomiru' },
    ],
  },
  en: {
    easy: [
      { display: 'cat',  input: 'cat'  },
      { display: 'dog',  input: 'dog'  },
      { display: 'sky',  input: 'sky'  },
      { display: 'sea',  input: 'sea'  },
      { display: 'star', input: 'star' },
      { display: 'moon', input: 'moon' },
      { display: 'fire', input: 'fire' },
      { display: 'tree', input: 'tree' },
      { display: 'bird', input: 'bird' },
      { display: 'fish', input: 'fish' },
      { display: 'rain', input: 'rain' },
      { display: 'wind', input: 'wind' },
      { display: 'snow', input: 'snow' },
      { display: 'gold', input: 'gold' },
      { display: 'king', input: 'king' },
    ],
    normal: [
      { display: 'apple',  input: 'apple'  },
      { display: 'barrel', input: 'barrel' },
      { display: 'typing', input: 'typing' },
      { display: 'speed',  input: 'speed'  },
      { display: 'score',  input: 'score'  },
      { display: 'bonus',  input: 'bonus'  },
      { display: 'flame',  input: 'flame'  },
      { display: 'cloud',  input: 'cloud'  },
      { display: 'storm',  input: 'storm'  },
      { display: 'power',  input: 'power'  },
      { display: 'combo',  input: 'combo'  },
      { display: 'magic',  input: 'magic'  },
      { display: 'sword',  input: 'sword'  },
      { display: 'jungle', input: 'jungle' },
      { display: 'monkey', input: 'monkey' },
    ],
    hard: [
      { display: 'keyboard',     input: 'keyboard'     },
      { display: 'mountain',     input: 'mountain'     },
      { display: 'thunderbolt',  input: 'thunderbolt'  },
      { display: 'adventure',    input: 'adventure'    },
      { display: 'destroyer',    input: 'destroyer'    },
      { display: 'challenge',    input: 'challenge'    },
      { display: 'explosion',    input: 'explosion'    },
      { display: 'fantastic',    input: 'fantastic'    },
      { display: 'superhero',    input: 'superhero'    },
      { display: 'blizzard',     input: 'blizzard'     },
      { display: 'overdrive',    input: 'overdrive'    },
    ],
  },
};

// ══════════════════════════════════════════════
//  足場定義
// ══════════════════════════════════════════════
const FLOOR_H      = 14;
const BARREL_R     = 14;
const FLOOR_MAX_HP = 6;

const FLOOR_DEFS = [
  { x: 20,  y: 100, w: 260, tilt: 18,  dropDir:  1 },
  { x: 200, y: 200, w: 400, tilt: -16, dropDir: -1 },
  { x: 20,  y: 300, w: 380, tilt: 14,  dropDir:  1 },
  { x: 160, y: 390, w: 440, tilt: -12, dropDir: -1 },
  { x: 0,   y: 490, w: 640, tilt: 0,   dropDir:  1 },
];

// ══════════════════════════════════════════════
//  ゲーム状態
// ══════════════════════════════════════════════
const canvas   = document.getElementById('c');
const ctx      = canvas.getContext('2d');
const overlay  = document.getElementById('overlay');
const inputBox = document.getElementById('input-box');
const sScore   = document.getElementById('s-score');
const sLv      = document.getElementById('s-lv');
const sLives   = document.getElementById('s-lives');

let floors = [], barrels = [], particles = [], explosions = [];
let score = 0, lives = 3, level = 1, frame = 0;
let spawnTimer = 0, spawnInterval = 160, baseSpeed = 1.2;
let gameRunning = false, currentInput = '';
let useJP = true, diffIndex = 0;
const DIFFS      = ['easy', 'normal', 'hard'];
const GRAVITY    = 0.35;
const TNT_CHANCE = 0.18;
const TNT_RADIUS = 120;

// ══════════════════════════════════════════════
//  足場初期化
// ══════════════════════════════════════════════
function initFloors() {
  floors = FLOOR_DEFS.map((def, i) => ({
    ...def,
    hp:     (i === 0 || i === 4) ? 999 : FLOOR_MAX_HP,
    broken: false,
    shakeT: 0,
  }));
}

// ══════════════════════════════════════════════
//  UI
// ══════════════════════════════════════════════
function setDiff(i, el) {
  diffIndex = i;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function toggleMode() {
  useJP = !useJP;
  document.getElementById('mode-btn').textContent = 'モード: ' + (useJP ? 'ひらがな(roma)' : 'English');
}

function updateHUD() {
  sScore.textContent  = 'SCORE: ' + score;
  sLv.textContent     = 'LV ' + level;
  sLives.innerHTML    = '❤️'.repeat(Math.max(0, lives));
}

// ══════════════════════════════════════════════
//  足場ユーティリティ
// ══════════════════════════════════════════════
function floorY(fl, x) {
  return fl.y + ((x - fl.x) / fl.w) * fl.tilt;
}

function floorAngle(fl) {
  return Math.atan2(fl.tilt, fl.w);
}

// ══════════════════════════════════════════════
//  樽スポーン
// ══════════════════════════════════════════════
function getWordEntry() {
  const lang = useJP ? 'jp' : 'en';
  const list = WORDS[lang][DIFFS[diffIndex]];
  const usedInputs = new Set(barrels.map(b => b.input));
  const avail = list.filter(w => !usedInputs.has(w.input));
  const pool  = avail.length > 0 ? avail : list;
  return pool[Math.floor(Math.random() * pool.length)];
}

function spawnBarrel() {
  const entry  = getWordEntry();
  const speed  = baseSpeed + Math.random() * 0.5 + diffIndex * 0.25;
  const fl0    = floors[0];
  const sx     = fl0.x + 30;
  const sy     = floorY(fl0, sx) - BARREL_R;
  const isTNT  = Math.random() < TNT_CHANCE;
  barrels.push({
    x: sx, y: sy, vx: speed, vy: 0,
    display: isTNT ? 'TNT' : entry.display,
    input:   isTNT ? 'TNT' : entry.input,
    typed: '', rot: 0,
    floorIdx: 0, falling: false, vxSet: false,
    isTNT,
  });
}

// ══════════════════════════════════════════════
//  描画：背景・足場
// ══════════════════════════════════════════════
function drawBG() {
  ctx.fillStyle = '#0a0005';
  ctx.fillRect(0, 0, 640, 560);

  floors.forEach((fl) => {
    if (fl.broken) return;

    const shake = fl.shakeT > 0 ? (Math.random() - 0.5) * 3 : 0;
    const ox = shake, oy = shake;

    const topY  = fl.y + oy,        topYr = fl.y + fl.tilt + oy;
    const botY  = topY + FLOOR_H,   botYr = topYr + FLOOR_H;

    // 影
    ctx.beginPath();
    ctx.moveTo(fl.x + ox, topY + 4); ctx.lineTo(fl.x + fl.w + ox, topYr + 4);
    ctx.lineTo(fl.x + fl.w + ox, botYr + 4); ctx.lineTo(fl.x + ox, botY + 4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fill();

    // 本体（HPで色変化）
    const ratio = fl.hp / FLOOR_MAX_HP;
    const r = Math.floor(204 - (1 - ratio) * 100);
    const g = Math.floor(51  - (1 - ratio) * 40);
    ctx.beginPath();
    ctx.moveTo(fl.x + ox, topY); ctx.lineTo(fl.x + fl.w + ox, topYr);
    ctx.lineTo(fl.x + fl.w + ox, botYr); ctx.lineTo(fl.x + ox, botY);
    ctx.closePath();
    const grad = ctx.createLinearGradient(fl.x, topY, fl.x, botY + FLOOR_H);
    grad.addColorStop(0,   `rgb(${r},${g},0)`);
    grad.addColorStop(0.4, `rgb(${Math.floor(r * 0.75)},${Math.floor(g * 0.75)},0)`);
    grad.addColorStop(1,   `rgb(${Math.floor(r * 0.5)},${Math.floor(g * 0.5)},0)`);
    ctx.fillStyle = grad;
    ctx.fill();

    // ハイライト
    ctx.beginPath();
    ctx.moveTo(fl.x + ox, topY); ctx.lineTo(fl.x + fl.w + ox, topYr);
    ctx.strokeStyle = ratio > 0.5 ? '#ff6644' : '#ff2200';
    ctx.lineWidth = 2;
    ctx.stroke();

    // ヒビ
    if (fl.hp < FLOOR_MAX_HP) {
      const crackA = (1 - ratio) * 0.85;
      ctx.globalAlpha = crackA;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.2;
      for (let ci = 0; ci < Math.floor((1 - ratio) * 5) + 1; ci++) {
        const cx = fl.x + fl.w * (0.15 + ci * 0.17);
        const cy = floorY(fl, cx);
        ctx.beginPath();
        ctx.moveTo(cx + ox, cy + oy);
        ctx.lineTo(cx + 6 + ox, cy + FLOOR_H * 0.6 + oy);
        ctx.lineTo(cx + 2 + ox, cy + FLOOR_H + oy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // リベット
    for (let rx = fl.x + 20; rx < fl.x + fl.w - 10; rx += 40) {
      const ry = floorY(fl, rx) + FLOOR_H / 2;
      ctx.beginPath();
      ctx.arc(rx + ox, ry + oy, 3, 0, Math.PI * 2);
      ctx.fillStyle = ratio > 0.5 ? '#ff9966' : '#ff4400';
      ctx.fill();
    }

    // HP警告
    if (fl.hp <= 2 && fl.hp > 0) {
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#ff0';
      ctx.fillText(`⚠ ${fl.hp}`, fl.x + fl.w / 2 - 10, fl.y - 4);
    }

    if (fl.shakeT > 0) fl.shakeT--;
  });
}

// ══════════════════════════════════════════════
//  描画：コング
// ══════════════════════════════════════════════
function drawKong() {
  const fl = floors[0];
  if (fl.broken) return;
  const kx = fl.x + 10;
  const ky = floorY(fl, kx) - 10;
  ctx.font = '44px serif';
  ctx.fillText('🦍', kx - 10, ky);
}

// ══════════════════════════════════════════════
//  描画：樽
// ══════════════════════════════════════════════
function drawBarrel(b) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.rot);

  if (b.isTNT) {
    const blink = Math.sin(frame * 0.18) > 0;
    ctx.beginPath();
    ctx.arc(0, 0, BARREL_R, 0, Math.PI * 2);
    ctx.fillStyle = blink ? '#ff2200' : '#cc1100';
    ctx.fill();
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.rotate(-b.rot);
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = blink ? '#ffff00' : '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TNT', 0, 0);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, BARREL_R, 0, Math.PI * 2);
    const bg = ctx.createRadialGradient(-4, -4, 2, 0, 0, BARREL_R);
    bg.addColorStop(0, '#a05020');
    bg.addColorStop(1, '#5a2800');
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = '#2a1000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    [-6, 0, 6].forEach(dy => {
      ctx.beginPath();
      ctx.ellipse(0, dy, BARREL_R, 4, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(60,20,0,0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    [-7, 7].forEach(dy => {
      ctx.beginPath();
      ctx.moveTo(-BARREL_R, dy);
      ctx.lineTo(BARREL_R, dy);
      ctx.strokeStyle = '#ddaa44';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
  ctx.restore();

  // 単語ラベル：display（ひらがな or 英語）を表示、input で判定
  const fSize = b.isTNT ? 12 : (useJP ? 13 : 10);
  ctx.font = `bold ${fSize}px ${useJP && !b.isTNT ? 'sans-serif' : "'Press Start 2P'"}`;
  const tw = ctx.measureText(b.display).width;

  // 入力済み文字数に対応するdisplay文字を緑で表示
  const typedLen  = b.typed.length; // input上の入力済み文字数
  // jpモードではinputとdisplayの文字数が異なるため比率で判断
  const ratio     = b.input.length > 0 ? typedLen / b.input.length : 0;
  const doneChars = Math.round(b.display.length * ratio);
  const donePart  = b.display.slice(0, doneChars);
  const restPart  = b.display.slice(doneChars);
  const dw        = ctx.measureText(donePart).width;

  const lx = b.x - tw / 2;
  const ly = b.y - BARREL_R - 8;

  ctx.fillStyle = b.isTNT ? 'rgba(60,0,0,0.9)' : 'rgba(0,0,0,0.78)';
  ctx.beginPath();
  roundRect(lx - 5, ly - 13, tw + 10, 18, 3);
  ctx.fill();

  ctx.fillStyle = '#44ff88';
  ctx.fillText(donePart, lx, ly);
  ctx.fillStyle = b.isTNT ? '#ffcc00' : '#fff';
  ctx.fillText(restPart, lx + dw, ly);

  // 入力中のローマ字をサブ表示（JPモードのみ）
  if (useJP && b.typed.length > 0 && !b.isTNT) {
    ctx.font = 'bold 9px monospace';
    const subW = ctx.measureText(b.typed).width;
    const sx   = b.x - subW / 2;
    const sy   = b.y + BARREL_R + 14;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath();
    roundRect(sx - 3, sy - 10, subW + 6, 13, 2);
    ctx.fill();
    ctx.fillStyle = '#88ffcc';
    ctx.fillText(b.typed, sx, sy);
  }
}

function roundRect(x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ══════════════════════════════════════════════
//  パーティクル・爆発
// ══════════════════════════════════════════════
function addParticles(x, y, big = false) {
  const n   = big ? 40 : 16;
  const spd = big ? 12 : 8;
  for (let i = 0; i < n; i++) {
    particles.push({
      x, y,
      vx:    (Math.random() - 0.5) * spd,
      vy:    (Math.random() - 0.5) * spd - (big ? 4 : 2),
      life:  1,
      size:  big ? (3 + Math.random() * 4) : 3,
      color: `hsl(${big ? Math.random() * 60 : 20 + Math.random() * 50},100%,${big ? 70 : 60}%)`,
    });
  }
}

function addExplosion(x, y) {
  explosions.push({ x, y, r: 0, life: 1 });
}

function drawExplosions() {
  explosions = explosions.filter(e => {
    e.r += 8; e.life -= 0.07;
    ctx.globalAlpha = e.life * 0.5;
    const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r);
    grad.addColorStop(0,   '#ffff88');
    grad.addColorStop(0.4, '#ff6600');
    grad.addColorStop(1,   'rgba(255,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    return e.life > 0;
  });
}

function drawParticles() {
  particles = particles.filter(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life -= 0.04;
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle   = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    return p.life > 0;
  });
}

// ══════════════════════════════════════════════
//  TNT爆発処理
// ══════════════════════════════════════════════
function triggerTNT(tntBarrel) {
  addParticles(tntBarrel.x, tntBarrel.y, true);
  addExplosion(tntBarrel.x, tntBarrel.y);
  score += 500;

  barrels = barrels.filter(b => {
    if (b === tntBarrel) return false;
    const dist = Math.hypot(b.x - tntBarrel.x, b.y - tntBarrel.y);
    if (dist < TNT_RADIUS) {
      addParticles(b.x, b.y, false);
      score += b.display.length * 5;
      return false;
    }
    return true;
  });

  floors.forEach(fl => {
    if (fl.broken) return;
    const dist = Math.hypot(fl.x + fl.w / 2 - tntBarrel.x, fl.y + fl.tilt / 2 - tntBarrel.y);
    if (dist < TNT_RADIUS * 1.2) damageFloor(fl, 2);
  });

  updateHUD();
}

// ══════════════════════════════════════════════
//  足場ダメージ
// ══════════════════════════════════════════════
function damageFloor(fl, dmg = 1) {
  if (fl.broken || fl.hp >= 999) return;
  fl.hp     = Math.max(0, fl.hp - dmg);
  fl.shakeT = 8;
  if (fl.hp <= 0) {
    fl.broken = true;
    for (let i = 0; i < 20; i++) {
      particles.push({
        x:     fl.x + Math.random() * fl.w,
        y:     fl.y + Math.random() * FLOOR_H,
        vx:    (Math.random() - 0.5) * 6,
        vy:    -Math.random() * 4,
        life:  1, size: 4, color: '#cc3300',
      });
    }
  }
}

// ══════════════════════════════════════════════
//  樽物理更新
// ══════════════════════════════════════════════
function updateBarrel(b) {
  b.vy += GRAVITY;
  b.x  += b.vx;
  b.y  += b.vy;

  let landed = false;
  for (let i = 0; i < floors.length; i++) {
    const fl = floors[i];
    if (fl.broken) continue;
    if (b.x < fl.x - BARREL_R || b.x > fl.x + fl.w + BARREL_R) continue;
    const fy = floorY(fl, b.x) - BARREL_R;
    if (b.y >= fy && b.y <= fy + 30 && b.vy >= 0) {
      b.y = fy; b.vy = 0; b.floorIdx = i; b.falling = false;
      const angle        = floorAngle(fl);
      const gravity_along = Math.sin(angle) * 9.8 * 0.04;
      if (!b.vxSet) {
        b.vx    = fl.tilt >= 0 ? Math.abs(b.vx) : -Math.abs(b.vx);
        b.vxSet = true;
        damageFloor(fl, 1);
      }
      b.vx += gravity_along * Math.sign(b.vx || 1);
      b.vx  = Math.max(-5, Math.min(5, b.vx));
      landed = true;
      break;
    }
  }

  if (!landed) { b.falling = true; b.vxSet = false; }

  if (!b.falling && b.floorIdx >= 0) {
    const fl = floors[b.floorIdx];
    if (fl.broken || b.x > fl.x + fl.w + BARREL_R || b.x < fl.x - BARREL_R) {
      b.falling = true; b.floorIdx = -1; b.vxSet = false; b.vy = 1;
    }
  }

  b.rot += b.vx * 0.06;
  if (b.y > 580 || b.x < -60 || b.x > 700) return 'miss';
  return 'ok';
}

// ══════════════════════════════════════════════
//  タイピング判定（input文字列で判定）
// ══════════════════════════════════════════════
function checkTyping() {
  let target = null;
  for (const b of barrels) {
    if (b.input.startsWith(currentInput) && currentInput.length > 0) {
      if (!target || currentInput.length > target.typed.length) target = b;
    }
  }
  barrels.forEach(b => b.typed = '');
  if (target) {
    target.typed = currentInput;
    if (target.typed === target.input) {
      if (target.isTNT) {
        triggerTNT(target);
        barrels = barrels.filter(b => b !== target);
      } else {
        addParticles(target.x, target.y);
        score += target.input.length * 10 * (diffIndex + 1);
        barrels = barrels.filter(b => b !== target);
        updateHUD();
      }
      currentInput = '';
      inputBox.textContent = '　';
    }
  }
}

document.addEventListener('keydown', e => {
  if (!gameRunning) return;
  if (e.key === 'Backspace') currentInput = currentInput.slice(0, -1);
  else if (e.key.length === 1) currentInput += e.key;
  else return;
  inputBox.textContent = currentInput || '　';
  checkTyping();
});

// ══════════════════════════════════════════════
//  メインループ
// ══════════════════════════════════════════════
function loop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, 640, 560);
  drawBG();
  drawKong();
  frame++;
  spawnTimer++;

  if (spawnTimer >= spawnInterval) {
    spawnTimer = 0;
    spawnBarrel();
    spawnInterval = Math.max(50, spawnInterval - 3);
    baseSpeed     = Math.min(3.5, baseSpeed + 0.05);
    level         = Math.floor(frame / 400) + 1;
    updateHUD();
  }

  for (let i = barrels.length - 1; i >= 0; i--) {
    const b   = barrels[i];
    const res = updateBarrel(b);
    if (res === 'miss') {
      barrels.splice(i, 1);
      lives--;
      currentInput = '';
      inputBox.textContent = '　';
      barrels.forEach(b => b.typed = '');
      updateHUD();
      if (lives <= 0) { endGame(); return; }
    }
  }

  drawExplosions();
  barrels.forEach(b => drawBarrel(b));
  drawParticles();
  requestAnimationFrame(loop);
}

// ══════════════════════════════════════════════
//  開始・終了
// ══════════════════════════════════════════════
function startGame() {
  initFloors();
  barrels = []; particles = []; explosions = [];
  score = 0; lives = 3; level = 1; frame = 0;
  spawnTimer = 0; spawnInterval = 160; baseSpeed = 1.2;
  currentInput = '';
  inputBox.textContent = '　';
  gameRunning = true;
  overlay.style.display = 'none';
  updateHUD();
  loop();
}

function endGame() {
  gameRunning = false;
  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <h1>GAME<br>OVER</h1>
    <p style="font-family:'Press Start 2P',monospace;font-size:15px;color:#fff;">SCORE: ${score}</p>
    <p class="sub">LV ${level} まで到達！</p>
    <button onclick="location.reload()">▶ もう一度</button>
  `;
}
