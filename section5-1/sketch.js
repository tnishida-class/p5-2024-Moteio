// テキスト「関数を使う」
// 練習問題：このプログラムを改造してEUの旗を描いてみよう
function setup()｛
  createCanvas(200, 200);
  background(192);
  for(let i = 0; i < 12; i++){
    let theta = TWO_PI * i / 12;
    let x = 100 + cos(theta) * 50;
    let y = 100 + sin(theta) * 50;
    ellipse(x, y, 10);
    ｝
}
// ヒント：section5-2 にある star 関数をここにコピーして、 draw 内で ellipse の代わりに使おう
