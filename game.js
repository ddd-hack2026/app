const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const enemyDownSound = new Audio("enemy_down.mp3");
const homeScreen = document.getElementById("homeScreen");
const startButton = document.getElementById("startButton");
const retryButton = document.getElementById("retryButton");

let gameStarted = false;
let gameOver = false;
let gameClear = false;
let canShoot = true;
// スタートボタン
startButton.addEventListener("click", () => {
    homeScreen.style.display = "none";
    canvas.style.display = "block";
    gameStarted = true;
    gameLoop();
});

// 自機
let player = {
    x: 180,
    y: 550,
    width: 40,
    height: 20,
    speed: 5,
    life: 3
};

// キー入力
let keys = {};
document.addEventListener("keydown", (e) => {
    if (e.key === " " && canShoot) {
        shoot();        // ← 1回押した瞬間だけ撃つ
        canShoot = false;
    }
    keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === " ") {
        canShoot = true;   // ← 離したら次の1発が撃てる
    }
    keys[e.key] = false;
});


// 自機の弾
let bullets = [];
function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 4
    });
}

// 敵
let enemies = [];
let enemyBullets = [];
let score = 0;

// ボス関連
let boss = null;
let bossBullets = [];
let bossHP = 10;
let bossAppeared = false;

// 敵出現
function spawnEnemy() {
    if (!gameStarted || gameOver || gameClear) return;
    if (bossAppeared) return; // ボス出現中は雑魚を出さない

    enemies.push({
        x: Math.random() * 360,
        y: -20,
        width: 30,
        height: 30,
        speed: 2
    });
}

let enemySpawnInterval = setInterval(spawnEnemy, 800);

// 敵の弾
function enemyShoot(enemy) {
    enemyBullets.push({
        x: enemy.x + enemy.width / 2 - 2,
        y: enemy.y + enemy.height,
        width: 4,
        height: 10,
        speed: 7
    });
}

// ボス出現
function spawnBoss() {
    boss = {
        x: 150,
        y: -100,
        width: 100,
        height: 60,
        speed: 1.5
    };
    bossAppeared = true;
}

// ボスの弾
function bossShoot() {
    bossBullets.push({
        x: boss.x + boss.width / 2 - 4,
        y: boss.y + boss.height,
        width: 8,
        height: 15,
        speed: 5
    });
}

function update() {
    if (!gameStarted || gameOver || gameClear) return;

    // 自機移動
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    // 自機の弾
    if (keys[" "]) shoot();
    bullets.forEach((b, i) => {
        b.y -= b.speed;
        if (b.y < -10) bullets.splice(i, 1);
    });

    // 雑魚敵の動き
    enemies.forEach((e, i) => {
        e.y += e.speed;

        if (Math.random() < 0.01) enemyShoot(e);

        if (e.y > 600) enemies.splice(i, 1);
    });

    // 敵の弾
    enemyBullets.forEach((b, i) => {
        b.y += b.speed;
        if (b.y > 600) enemyBullets.splice(i, 1);
    });

    // 自機の弾 vs 雑魚敵
    enemies.forEach((e, ei) => {
        bullets.forEach((b, bi) => {
            if (
                b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y
            ) {
                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
                score++;
// 敵に当たった瞬間（この中に書く）
enemyDownSound.currentTime = 0;
enemyDownSound.play();

                // 10体倒したらボス出現
                if (score === 10 && !bossAppeared) {
                    spawnBoss();
                }
            }
        });
    });

    // 敵の弾 vs 自機
    enemyBullets.forEach((b, bi) => {
        if (
            b.x < player.x + player.width &&
            b.x + b.width > player.x &&
            b.y < player.y + player.height &&
            b.y + b.height > player.y
        ) {
            enemyBullets.splice(bi, 1);
            player.life--;
            if (player.life <= 0) gameOver = true;
        }
    });

    // ボスの動き
    if (bossAppeared && boss) {
        if (boss.y < 50) boss.y += boss.speed;

        // ボスの弾
        if (Math.random() < 0.03) bossShoot();

        bossBullets.forEach((b, i) => {
            b.y += b.speed;
            if (b.y > 600) bossBullets.splice(i, 1);
        });

        // 自機の弾 vs ボス
        bullets.forEach((b, bi) => {
            if (
                b.x < boss.x + boss.width &&
                b.x + b.width > boss.x &&
                b.y < boss.y + boss.height &&
                b.y + b.height > boss.y
            ) {
                bullets.splice(bi, 1);
                bossHP--;

                if (bossHP <= 0) {
                    gameClear = true;
                }
            }
        });

        // ボスの弾 vs 自機
        bossBullets.forEach((b, bi) => {
            if (
                b.x < player.x + player.width &&
                b.x + b.width > player.x &&
                b.y < player.y + player.height &&
                b.y + b.height > player.y
            ) {
                bossBullets.splice(bi, 1);
                player.life--;
                if (player.life <= 0) gameOver = true;
            }
        });
    }
}

function draw() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ゲームクリア
    if (gameClear) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("GAME CLEAR!", 70, 300);
        ctx.font = "25px Arial";
        ctx.fillText("Score: " + score, 140, 350);
     retryButton.style.display = "block"; // ←追加  
        return;
    }

    // ゲームオーバー
    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", 70, 300);
        ctx.font = "25px Arial";
        ctx.fillText("Score: " + score, 140, 350);
        retryButton.style.display = "block"; // ←追加
       
        return;
    }

    // 自機
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 自機の弾
ctx.fillStyle = "yellow";
bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));


    // 雑魚敵
    ctx.fillStyle = "red";
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));

    // 敵の弾
    ctx.fillStyle = "orange";
    enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    // ボス
    if (bossAppeared && boss) {
        ctx.fillStyle = "purple";
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);

        // ボスHPバー
        ctx.fillStyle = "white";
        ctx.fillRect(100, 10, 200, 10);
        ctx.fillStyle = "purple";
        ctx.fillRect(100, 10, (bossHP / 10) * 200, 10);
    }

    // スコア
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    // ライフ
    ctx.fillText("Life: " + player.life, 320, 30);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

retryButton.addEventListener("click", () => {
    // ゲーム状態リセット
    gameStarted = false;
    gameOver = false;
    gameClear = false;
    bossAppeared = false;
    boss = null;
    bossHP = 10;

    // 配列リセット
    bullets = [];
    enemies = [];
    enemyBullets = [];
    bossBullets = [];

    // プレイヤー初期位置
    player.x = 180;
    player.y = 550;
    player.life = 3;

    // スコアリセット
    score = 0;
    //敵出現の intervalをリセット
    clearInterval(enemySpawnInterval);
    enemySpawnInterval = setInterval(spawnEnemy, 800);

    // 画面切り替え
    canvas.style.display = "none";
    homeScreen.style.display = "block";
    retryButton.style.display = "none";
});
