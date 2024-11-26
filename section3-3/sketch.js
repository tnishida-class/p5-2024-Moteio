// テキスト「キーボード操作に反応する」
let x, y;

function setup(){
  createCanvas(windowWidth, windowHeight);
  x = width / 2;
  y = height / 2;
}

function draw(){
  background(160, 192, 255);
  ellipse(x, y, 50);
  if(keyIsDown(LEFT_ARROW)){ x -= 5; }
  if(keyIsDown(RIGHT_ARROW)){ x += 5; }
  if(keyIsDown(UP_ARROW)){ y -= 5; }
  if(keyIsDown(DOWN_ARROW)){ y += 5; }
  if(keyIsDown("A".charCodeAt(0))){ x, y+= 10; }
  if(keyIsDown(" ".charCodeAt(0))){ x-= 10; }
}

// イベントハンドラを使用するパターン
// function keyPressed(){
//   if(keyCode == LEFT_ARROW){ x -= 5; }
//   else if(keyCode == RIGHT_ARROW){ xq+= 5; }
//   else if(keyCode == DOWN_ARROW){ y += 5; }
//   else if(keyCode == UP_ARROW){ y -= 5; }
//   else if(key == "A"){ x += 10; }
// }

let isMovingLeft = false;
let isMovingRight = false;
let isMovingUp = false;
let isMovingDown = false;
let isSpeedUp = false;
const normalSpeed = 5;    // 通常速度
const speedUpValue = 10;  // 加速時の速度

// プレイヤーの位置を示す変数
let playerPositionX = 0;
let playerPositionY = 0;

// キーが押されたときのイベント
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") isMovingLeft = true;
    if (event.key === "ArrowRight") isMovingRight = true;
    if (event.key === "ArrowUp") isMovingUp = true;
    if (event.key === "ArrowDown") isMovingDown = true;
    if (event.key === "a" || event.key === "A") isSpeedUp = true;  // Aキーで加速
});

// キーが離されたときのイベント
document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") isMovingLeft = false;
    if (event.key === "ArrowRight") isMovingRight = false;
    if (event.key === "ArrowUp") isMovingUp = false;
    if (event.key === "ArrowDown") isMovingDown = false;
    if (event.key === "a" || event.key === "A") isSpeedUp = false;  // Aキーを離したら通常速度に戻る
});

function 

// プレイヤーの動きを更新する関数
function updatePlayerPosition() {
    // Aキーが押されている場合は加速速度を使用
    let currentSpeed = isSpeedUp ? speedUpValue : normalSpeed;

    // 各方向に応じて位置を更新
    if (isMovingLeft) playerPositionX -= currentSpeed;   // 左方向
    if (isMovingRight) playerPositionX += currentSpeed;  // 右方向
    if (isMovingUp) playerPositionY -= currentSpeed;     // 上方向
    if (isMovingDown) playerPositionY += currentSpeed;   // 下方向

    // プレイヤーの位置を表示（例: DOM要素のスタイルを更新）
    console.log("Player Position: X =", playerPositionX, ", Y =", playerPositionY);
}

// 定期的にプレイヤーの位置を更新
setInterval(updatePlayerPosition, 1000 / 60);


function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
