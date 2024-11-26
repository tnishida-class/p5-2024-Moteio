// 最終課題を制作しよう

function setup89{
  createCanvas(windowwidrh,windiowHeight);
}

function draw() {
  background(160, 192, 255);

  if(mouseIsPressed)
  elipse(rondom(width), rondom(height), 50);
 }

function windowResized(){
  resizeCanvas(windowwidth, windowHeight);
}

// 一般・宣言
let player;
let bullets = [];
let enemies = [];
let enemyBullets = [];
let enemyDirection = 1;
let score = 0;
let gameOver = false;
let retryButton
let explosions = [];
let level = 1;
let enemySpeed = 0.5;
let lastKeyPressed = null; 

function setup() {
  createCanvas(600, 500);
  player = createPlayer();
  createEnemies();

  // リトライボタンを作成し、スタイルを適用
  retryButton = createButton('リトライ（もちろん）');
  retryButton.position(width / 2 - 85, height / 2 + 60);
  retryButton.mousePressed(restartGame);
  retryButton.style('padding', '10px 20px');
  retryButton.style('background-color', '#ff4757');
  retryButton.style('color', '#fff');
  retryButton.style('border-radius', '5px');
  retryButton.style('cursor', 'pointer');
  retryButton.hide();

  // ボタンのホバーエフェクト
  retryButton.mouseOver(() => {
    retryButton.style('background-color', '#ff6b81');
  });
  retryButton.mouseOut(() => {
    retryButton.style('background-color', '#ff4757');
  });
}

function draw() {
  background(20);

  if (gameOver) {
    displayGameOver();
    return;
  }

  hideRetryButton();

  movePlayer();
  drawPlayer();

  updateBullets();
  drawBullets();

  moveEnemies();
  drawEnemies();

  updateEnemyBullets();
  drawEnemyBullets();

  updateExplosions();
  drawExplosions();

  checkCollisions();

  // 全ての敵が倒れたら次のレベルへ
  if (enemies.every(enemy => !enemy.alive)) {
    level++;
    createEnemies();
  }

  displayScore();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    lastKeyPressed = 'left';
    player.direction = -1;
  } else if (keyCode === RIGHT_ARROW) {
    lastKeyPressed = 'right';
    player.direction = 1;
  } else if (keyCode === 32) {
    bullets.push(createBullet(player.x + player.w / 2, player.y));
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    if (lastKeyPressed === 'left') {
      if (keyIsDown(RIGHT_ARROW)) {
        lastKeyPressed = 'right';
        player.direction = 1;
      } else {
        lastKeyPressed = null;
        player.direction = 0;
      }
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (lastKeyPressed === 'right') {
      if (keyIsDown(LEFT_ARROW)) {
        lastKeyPressed = 'left';
        player.direction = -1;
      } else {
        lastKeyPressed = null;
        player.direction = 0;
      }
    }
  }
}

// ===== プレイヤー関連の関数 =====
function createPlayer() {
  return {
    x: width / 2 - 20,
    y: height - 60,
    w: 40,
    h: 40,
    speed: 5,
    direction: 0
  };
}

function movePlayer() {
  player.x += player.direction * player.speed;
  player.x = constrain(player.x, 0, width - player.w);
}

function drawPlayer() {
  push();
  translate(player.x + player.w / 2, player.y + player.h / 2);
  noStroke();
  fill(0, 200, 255);
  // メインボディ
  beginShape();
  vertex(0, -player.h / 2); // ノーズ
  vertex(player.w / 2, player.h / 4); // 右翼
  vertex(player.w / 4, player.h / 2); // 右後部
  vertex(-player.w / 4, player.h / 2); // 左後部
  vertex(-player.w / 2, player.h / 4); // 左翼
  endShape(CLOSE);
  // コックピット
  fill(255);
  ellipse(0, -player.h / 4, player.w / 5, player.h / 5);
  pop();
}

// ===== 弾関連の関数 =====
function createBullet(x, y) {
  return {
    x: x - 4,
    y: y,
    w: 8,
    h: 16,
    speed: 7
  };
}

function updateBullets() {
  bullets = bullets.filter(bullet => {
    bullet.y -= bullet.speed;
    return bullet.y > -bullet.h;
  });
}

function drawBullets() {
  fill(173, 216, 230); // 水色
  noStroke();
  bullets.forEach(bullet => {
    ellipse(bullet.x + bullet.w / 2, bullet.y + bullet.h / 2, bullet.w, bullet.h);
  });
}

// ===== 敵関連の関数 =====
function createEnemies() {
  enemySpeed = 0.5 + (level - 1) * 0.2;

  let rows = min(2 + level - 1, 6); // 最大6行
  let cols = min(5 + (level - 1) * 2, 15); // 最大15列
  let enemyW = 30;
  let enemyH = 30;
  let spacing = 10;

  enemies = [];

  // 敵の種類を定義
  const enemyTypes = [
    {
      type: 'star',
      maxHealth: 5,
      colors: [
        [255, 215, 0], // ゴールド
        [255, 165, 0], // オレンジ
        [255, 140, 0], // ダークオレンジ
        [255, 69, 0],  // レッド
        [139, 0, 0]    // ダークレッド
      ]
    },
    {
      type: 'triangle',
      maxHealth: 2,
      colors: [
        [255, 165, 0], // オレンジ
        [255, 69, 0]   // レッド
      ]
    },
    {
      type: 'square',
      maxHealth: 3,
      colors: [
        [0, 255, 0],   // 緑
        [34, 139, 34], // フォレストグリーン
        [0, 100, 0]    // ダークグリーン
      ]
    },
    {
      type: 'pentagon',
      maxHealth: 4,
      colors: [
        [0, 191, 255], // ディープスカイブルー
        [65, 105, 225],// ロイヤルブルー
        [0, 0, 255],   // 青
        [25, 25, 112]  // ミッドナイトブルー
      ]
    },
    {
      type: 'hexagon',
      maxHealth: 5,
      colors: [
        [255, 0, 255],   // マゼンタ
        [138, 43, 226],  // ブルーバイオレット
        [139, 0, 139],   // ダークマゼンタ
        [75, 0, 130],    // インディゴ
        [128, 0, 128]    // 紫
      ]
    }
  ];

  // レベルに応じて敵タイプを選択
  let availableEnemyTypes = enemyTypes.filter(type => type.maxHealth <= level + 2);

  for (let i = 0; i < rows; i++) {
    let y = i * (enemyH + spacing) + 50;
    let typeIndex = i % availableEnemyTypes.length;
    createEnemyRow(y, cols, enemyW, enemyH, spacing, availableEnemyTypes[typeIndex]);
  }
}

function createEnemyRow(y, cols, enemyW, enemyH, spacing, enemyType) {
  for (let j = 0; j < cols; j++) {
    let x = j * (enemyW + spacing) + 50;
    enemies.push(createEnemy(x, y, enemyW, enemyH, enemyType));
  }
}

function createEnemy(x, y, w, h, enemyType) {
  return {
    x: x,
    y: y,
    w: w,
    h: h,
    health: enemyType.maxHealth,
    maxHealth: enemyType.maxHealth,
    type: enemyType.type,
    colors: enemyType.colors,
    alive: true
  };
}

function moveEnemies() {
  let edge = false;

  enemies.forEach(enemy => {
    enemy.x += enemyDirection * enemySpeed;
    if (enemy.x > width - enemy.w || enemy.x < 0) {
      edge = true;
    }
  });

  if (edge) {
    enemyDirection *= -1;
    enemies.forEach(enemy => {
      enemy.y += 20;
    });
  }

  // ランダムに弾を発射
  if (frameCount % max(60 - (level - 1) * 5, 20) === 0) {
    shootEnemyBullet();
  }
}

function shootEnemyBullet() {
  let aliveEnemies = enemies.filter(enemy => enemy.alive);
  if (aliveEnemies.length > 0) {
    let shooter = random(aliveEnemies);
    if (shooter) {
      let isSpecial = random(1) < 0.1; // 10%の確率で特殊な弾を発射
      enemyBullets.push(createEnemyBullet(shooter.x + shooter.w / 2, shooter.y + shooter.h, isSpecial));
    }
  }
}

function drawEnemies() {
  enemies.forEach(enemy => {
    if (enemy.alive) {
      drawEnemy(enemy);
    }
  });
}

function drawEnemy(enemy) {
  push();
  translate(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
  noStroke();

  // 耐久値に応じて色を設定
  let colorIndex = enemy.maxHealth - enemy.health;
  let color = enemy.colors[colorIndex];
  fill(color[0], color[1], color[2]);

  rotate(frameCount / 50);

  // 形状を描画
  switch (enemy.type) {
    case 'star':
      drawStar(enemy.w / 2, enemy.w / 4);
      break;
    case 'triangle':
      triangle(
        -enemy.w / 2, enemy.h / 2,
        0, -enemy.h / 2,
        enemy.w / 2, enemy.h / 2
      );
      break;
    case 'square':
      rectMode(CENTER);
      rect(0, 0, enemy.w, enemy.h);
      break;
    case 'pentagon':
      drawPolygon(5, enemy.w / 2);
      break;
    case 'hexagon':
      drawPolygon(6, enemy.w / 2);
      break;
    default:
      ellipse(0, 0, enemy.w, enemy.h);
  }

  pop();
}

function drawPolygon(n, radius) {
  beginShape();
  for (let i = 0; i < n; i++) {
    let angle = TWO_PI / n * i - HALF_PI;
    vertex(cos(angle) * radius, sin(angle) * radius);
  }
  endShape(CLOSE);
}

function drawStar(outerRadius, innerRadius) {
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = TWO_PI / 10 * i - HALF_PI;
    let radius = i % 2 === 0 ? outerRadius : innerRadius;
    vertex(cos(angle) * radius, sin(angle) * radius);
  }
  endShape(CLOSE);
}

// ===== 敵の弾関連の関数 =====
function createEnemyBullet(x, y, isSpecial = false) {
  return {
    x: x - 4,
    y: y,
    w: 8,
    h: 16,
    speed: isSpecial ? 1 : 2, // 特殊な弾は遅い
    isSpecial: isSpecial
  };
}

function updateEnemyBullets() {
  enemyBullets = enemyBullets.filter(bullet => {
    bullet.y += bullet.speed;
    return bullet.y < height + bullet.h;
  });
}

function drawEnemyBullets() {
  noStroke();
  enemyBullets.forEach(bullet => {
    if (bullet.isSpecial) {
      fill(255, 0, 255); // マゼンタ色の特殊な弾
    } else {
      fill(144, 238, 144); // 黄緑色の通常の弾
    }
    ellipse(bullet.x + bullet.w / 2, bullet.y + bullet.h / 2, bullet.w, bullet.h);
  });
}

// ===== 爆発エフェクト関連の関数 =====
function createExplosion(x, y, color = [255, 150, 0]) {
  let numParticles = 50; // パーティクルの数を増加
  for (let i = 0; i < numParticles; i++) {
    let angle = random(TWO_PI);
    let speed = random(2, 6); // スピードを増加
    let particleColor = [
      constrain(color[0] + random(-50, 50), 0, 255),
      constrain(color[1] + random(-50, 50), 0, 255),
      constrain(color[2] + random(-50, 50), 0, 255)
    ];
    explosions.push({
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      alpha: 255,
      size: random(6, 12), // サイズを増加
      color: particleColor
    });
  }
}

function updateExplosions() {
  explosions = explosions.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 5;
    return p.alpha > 0;
  });
}

function drawExplosions() {
  noStroke();
  blendMode(ADD);
  explosions.forEach(p => {
    fill(p.color[0], p.color[1], p.color[2], p.alpha);
    ellipse(p.x, p.y, p.size);
  });
  blendMode(BLEND);
}

// ===== 衝突判定の関数 =====
function checkCollisions() {
  checkBulletHits();
  checkPlayerHit();
}

function checkBulletHits() {
  bullets = bullets.filter(bullet => ) {
    let hit = false;
    enemies.forEach(enemy =>) {
      if (enemy.alive && bulletHitsEnemy(bullet, enemy)) {
        enemy.health -= 1;
        if (enemy.health <= 0) {
          enemy.alive = false;
          score += 10;
          createExplosion(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, enemy.colors[enemy.colors.length])
 }