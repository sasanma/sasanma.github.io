let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

//プレイ状況の設定
let gameMode = "gameWaiting";
//ゲーム進行時の描画
let interval;
let score = 0;

//パドルの初期設定
let paddleHeight = canvas.height / 100;
let paddleWidth = canvas.width / 6;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = (canvas.height - paddleHeight - 10);
let rightPressed = false;
let leftPressed = false;

//ボールの初期設定
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - paddleHeight - ballRadius - 10;
//速度の最大値の設定
let dx_1 = 3;
let dy_1 = -3;
//発射角度の決定に使う数値の設定
const firstAng = 25;
const endAng = 75;
let ang = firstAng;
let addAng = 1;
let angInterval;
//ボールの速度
let dx;
let dy;

//ブロックの初期設定
let brickRowCount=5;
let brickColumnCount=5;
let brickWidth=75;
let brickHeight=20;
let brickPadding=10;
//キャンバスの上端からのブロック相対位置
let brickOffsetTop=30;
//キャンバスの左端からのブロックの相対位置
let brickOffsetLeft=(canvas.width - (brickColumnCount * (brickWidth + brickPadding)) + brickPadding) / 2;
//1次元目の配列を宣言
let bricks = [];
let item = [];
let itemSpeed = [];
//アイテムの抽選に使う数値の設定
let random;
let num;
//アイテム
const itemWidth = 30;
const itemHeight = 30;
let itemCount = 0;


//キーの操作で呼ばれる関数の設定
document.addEventListener("keydown",keyDownHundler,false);
document.addEventListener("keyup",keyUpHundler,false);
document.addEventListener("keydown",modeChange,false);
document.addEventListener("keydown",backTitle,false);



//発射角度の決定
function setAng() {
    ang = addAng + ang;
    //発射角度の範囲
    if(ang == endAng && addAng > 0) {
        addAng = -addAng;
    }
    if(ang == firstAng && addAng < 0) {
        addAng = -addAng;
    }
    //速度
    dx = Math.cos(ang*(Math.PI / 180)) * dx_1;
    dy = Math.sin(ang*(Math.PI / 180)) * dy_1;
    title();
    drawBall();
    drawPaddle();
    drawBricks();
    ctx.save();
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.rotate(-ang * (Math.PI / 180));
    ctx.moveTo(0,0);
    ctx.lineTo(0,1);
    ctx.lineTo(60,5);
    ctx.lineTo(60,10);
    ctx.lineTo(80,0);
    ctx.lineTo(60,-10);
    ctx.lineTo(60,-5);
    ctx.lineTo(0,-1);
    ctx.closePath();
    ctx.fillStyle = "lime";
    ctx.fill();
    ctx.translate(-x,-y);
    ctx.restore();
}

//ブロックの設定
function firstBricks() {
    for (c = 0; c < brickColumnCount; c ++) {
        bricks[c] = [];
        item[c] = [];
        itemSpeed[c] = [];
        for (r = 0; r < brickRowCount; r ++) {
            bricks[c][r] = {x:0, y:0, status:1 };
            item[c][r] = {x:0, y:0, status:1};
            itemSpeed[c][r] = 0;
        }
    }
}

//最初に一度だけ描画する
function setup() {
    title();
    angInterval = setInterval(setAng, 15);
    drawBall();
    drawPaddle();
    firstBricks();
    drawBricks();
    score = 0;
    itemCount = 0;
    paddleWidth = canvas.width / 6;
    paddleX = (canvas.width - paddleWidth) / 2;

}
setup();

//スタート画面
function title() {
    if(gameMode == "gameWaiting") {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        //テキストの表示
        ctx.font = "50px impact";
        ctx.textAlign = "center";
        ctx.fillStyle = "#A16EFF";
        ctx.fillText("Press Space To Start",canvas.width / 2 , canvas.height / 2);
    }
}

//ボールの描画
function drawBall() {
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI * 2);
    ctx.fillStyle = "#FFFF00";
    ctx.fill();
    ctx.closePath(); 
}

//パドルの描画
function drawPaddle() {
    ctx.beginPath();
    //パドル(x座標,y座標,幅,高さ)
    ctx.rect(paddleX,paddleY,paddleWidth,paddleHeight);
    ctx.fillStyle = "#FFFF00";
    ctx.fill();
    ctx.closePath();

}

function start() {
    //一定間隔でdraw関数を呼び出す
    interval = setInterval(draw, 10);
}

//ゲームスタート時の処理
function modeChange(e) {
    //ゲームが始まっていない時にスペースキーが押されたらゲームを始める
    if(e.keyCode == 32 && gameMode == "gameWaiting") {
        //ゲームをプレイ中にする
        gameMode = "gamePlaying";
        //角度決定の処理を止める
        clearInterval(angInterval);
        setTimeout(start ,300);
    }
    else if(e.keyCode == 32 && gameMode == "gameOver" || e.keyCode == 32 && gameMode == "gameClear") {
        //ゲームをスタート画面にする
        gameMode = "gameWaiting";
        x = canvas.width / 2;
        y = canvas.height - paddleHeight - ballRadius - 10;
        dx_1 = 3;
        dy_1 = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
        
        setup();
    }
}

//タイトルに戻る
function backTitle(e) {
    //プレイ中にエンターキーを押されたとき
    if (e.keyCode == 13 && gameMode == "gamePlaying") {
        //待機画面に戻る
        gameMode = "gameWaiting";
        //プレイ中の処理を停止する
        clearInterval(interval);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        x = canvas.width / 2;
        y = canvas.height - paddleHeight - ballRadius - 10;
        dx_1 = 3;
        dy_1 = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
        setup();
    }    
}

//矢印キーを押したときの処理
function keyDownHundler(e) {
    //右向き矢印キー
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    //左向き矢印キー
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
//矢印キーを離したときの処理
function keyUpHundler(e) {
    //右向き矢印キー
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    //左向き矢印キー
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

//パドルの移動
function movePaddle() {
    //右移動
    if(rightPressed&&paddleX < canvas.width - paddleWidth){
        paddleX += 6;
    }
    //左移動
    if (leftPressed&&paddleX > 0) {
        paddleX -= 6;
    }
}


//ボールの挙動
function judge() {
    //両サイドの壁に当たったら跳ね返る
    if(x + dx > canvas.width){
        dx = -dx;
    }
    else if(x + dx < 0){
        dx = -dx;
    }
    //上の壁に当たったら跳ね返る
    if(y + dy < 0) {
        dy = -dy;
    }
    //パドルの位置に来た時の処理
    else if(y + dy > paddleY && y + dy < paddleY + 10)  {
        //パドルに当たったら跳ね返る
        if(paddleX < x && paddleX + paddleWidth > x ) {
            dy = -dy;
            //アイテムの効果が残っているとき
            if (itemCount > 0) {
                itemCount --;
                paddleWidth = paddleWidth / 2;
                paddleX = paddleX + paddleWidth / 2;
            }
        }
    }
    //下の壁に当たったらゲームオーバー
    if (y + dy - ballRadius - 10 > canvas.height) {
        //繰り返しの処理を停止する
        clearInterval(interval);
        gameMode = "gameOver";
        ctx.beginPath();
        ctx.font = "70px impact";
        ctx.textAlign = "center";
        ctx.fillStyle = "#FF3333";
        ctx.fillText("GAME OVER", canvas.width / 2 , canvas.height / 2);
        ctx.closePath();
    }
    //スコアが1000でゲームクリア
    if (score == 1000) {
        //繰り返しの処理を停止する
        clearInterval(interval);
        gameMode = "gameClear";
        ctx.beginPath();
        ctx.font = "70px impact";
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFCC33";
        ctx.fillText("GAME CLEAR", canvas.width / 2 , canvas.height / 2);
        ctx.closePath();
    }

}


//衝突判定
function collisionDetection() {
    //横の列
    for (c = 0; c < brickColumnCount; c ++) {
        //縦の列
        for (r = 0; r < brickRowCount; r ++) {
            let b = bricks[c][r];
            let i = item[c][r];
            //statusが１かつブロックに当たった時ブロックを消す
            if (b.status == 1) {
                if (x > bricks[c][r].x && x < bricks[c][r].x + brickWidth && y > bricks[c][r].y && y < bricks[c][r].y + brickHeight) {
                dy = -dy;
                dx = 1.05 * dx;
                dy = 1.05 * dy;
                b.status = 0;
                //スコアの加算
                score +=40;
                //アイテムの抽選
                random = Math.random();
                num = Math.floor(100 * random);
                    if (num >= 80) {
                        i.status = 0;
                        i.x = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                        i.y = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    }
                }
                
            }
        }
    }
}
 
//ブロックの描画
function drawBricks() {
    for (c = 0; c < brickColumnCount; c ++) {
        for (r = 0; r < brickRowCount; r ++) {
            if(bricks[c][r].status == 1 ) {
                //それぞれのブロックの座標の設定
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if (r == 0) {
                    ctx.fillStyle = "red";
                }
                else if (r == 1) {
                    ctx.fillStyle = "yellow";
                }
                else if (r == 2) {
                    ctx.fillStyle = "green";
                }
                else if (r == 3) {
                    ctx.fillStyle = "blue";
                }
                else if (r == 4) {
                    ctx.fillStyle = "purple";
                }
                ctx.fill();
                ctx.closePath();
            }
            //アイテムの描画
            if (item[c][r].status == 0) {
                ctx.beginPath();
                ctx.rect(item[c][r].x + brickWidth / 2 - itemWidth / 2, item[c][r].y + itemSpeed[c][r], itemWidth,itemHeight);
                ctx.fillStyle = "#33FF33";
                ctx.fill();
                ctx.closePath();
                if (item[c][r].x + itemWidth > paddleX && item[c][r].x  < paddleX + paddleWidth  && item[c][r].y + itemSpeed[c][r] + itemHeight > paddleY && item[c][r].y + itemSpeed[c][r] < paddleY + paddleHeight) {
                    item[c][r].status = 1;
                    if (itemCount < 2) {
                        paddleX = paddleX - paddleWidth / 2;
                        paddleWidth = paddleWidth * 2;
                        //アイテムの効果を1反射分増やす
                        itemCount ++;
                    }
                }
                itemSpeed[c][r] ++;
            }
        }    
    }
}

//スコア表示の処理
function displayScore() {
    ctx.font = "40px impact";
    ctx.textAlign = "center";
    ctx.fillStyle = "navy";
    ctx.fillText("score : " + score,canvas.width - (canvas.width / 5) , canvas.height / 10);
}

//10ミリ秒ごとに呼び出される処理
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    movePaddle();
    judge();
    collisionDetection();
    displayScore();
    x += dx;
    y += dy;
}

//操作説明欄
$("#button").click(function(){
    $(".back, .background_1, #close, .exp").fadeIn(300);
    clearInterval(angInterval);
    clearInterval(interval);
    gameMode = "explaining";

});
$("#close").click(function(){
    $(".back, .background_1, #close, .exp").fadeOut(300);
    gameMode = "gameWaiting"
    clearInterval(interval);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    x = canvas.width / 2;
    y = canvas.height - paddleHeight - ballRadius - 10;
    dx_1 = 3;
    dy_1 = -3;
    paddleX = (canvas.width - paddleWidth) / 2;
    setup();
});
