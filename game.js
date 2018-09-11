var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ballx = (canvas.width / 2) - 30;
var bally = canvas.height / 2;
var ballr = 10;
var dx = -2;
var dy = 2;
var paddleh = 25;
var paddlew = 80;
var paddlex = canvas.width / 2;
var paddley = canvas.height-paddleh - 20;
var rightPressed = false;
var leftPressed = false;
var lifecheat = false;
var startover = false;
var rows = 10;
var cols = 16;
var brickh = 20;
var brickw = 50;
var bmargin = 5;
var i = 0;
var j = 0;
var bricks = [];
var score = 0;
var lives = 5;
var FPS = 50;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", startScreen);

function keyDownHandler(e) {
    if(e.keyCode === 39) {
        rightPressed = true;
    }
    else if(e.keyCode === 37) {
        leftPressed = true;
    }
    else if(e.keyCode === 32) {
        lifecheat = true;
    }
    else if(e.keyCode === 82) {
        startover = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode === 39) {
        rightPressed = false;
    }
    else if(e.keyCode === 37) {
        leftPressed = false;
    }
    else if(e.keyCode === 32) {
        lifecheat = false;
    }
    else if(e.keyCode === 82) {
        startover = false;
    }
}
function mouseMoveHandler(k) {
    var relativeX = k.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddlex = relativeX - paddlew/2;
    }
}
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballx, bally, ballr, 0, Math.PI*2);
    ctx.fillStyle = "#FF1493";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddlex, paddley, paddlew, paddleh);
    ctx.fillStyle = "#FF1493";
    ctx.fill();
    ctx.closePath();
}
function initBricks() {
    for(i=0; i<cols; i+=1) {
        bricks[i] = [];
        for(j=0; j<rows; j+=1) {
            bricks[i][j] = {ballx: 0, bally: 0, status: 1};
        }
    }
}
function drawBricks() {
    for(i=0; i<cols; i+=1) {
        for(j=0; j<rows; j+=1) {
            if(bricks[i][j].status === 1) {
                var bx = (i*(brickw+bmargin))+43;
                var by = (j*(brickh+bmargin))+50;
                bricks[i][j].ballx = bx;
                bricks[i][j].bally = by;
                ctx.beginPath();
                ctx.rect(bx, by, brickw, brickh);
                ctx.fillStyle = "#FF1493";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScores() {
    ctx.font = "22px Georgia";
    ctx.fillStyle = "#FF1493";
    ctx.fillText("Score: " + score, 8, 20);
}
function drawLives() {
    ctx.font = "22px Georgia";
    ctx.fillStyle = "#FF1493";
    ctx.fillText("Lives: " + lives, canvas.width-80, 20);
}
function movePaddle() {
    if (rightPressed && paddlex < canvas.width - paddlew) {
        paddlex += 8;
    }
    else if (leftPressed && paddlex > 0) {
        paddlex -= 8;
    }
}
function moveBall() {
    ballx += dx;
    bally += dy;
}
function checkCheat() {
    if(lifecheat) {
        lives+=1;
    }
}
function checkStartOver() {
    if(startover) {
        document.location.reload();
    }
}
function checkCollisions() {
    for(i=0; i<cols; i+=1) {
        for(j=0; j<rows; j+=1) {
            var b = bricks[i][j];
            if(b.status === 1) {
                if(ballx > b.ballx && ballx < b.ballx+brickw) {
                    if(bally > b.bally && bally < b.bally+brickh) {
                    dy = -dy;
                    b.status = 0;
                    score+=1;
                    if(score === rows*cols) {
                        alert("You Win!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}
}
function hitSides() {
    if(ballx + dx > canvas.width-ballr || ballx + dx < ballr) {
        dx = -dx;
    }
    if(bally + dy < ballr) {
        dy = -dy;
    }
    else if(bally + dy > canvas.height-(ballr+30)) {
        if(ballx > paddlex && ballx < paddlex + paddlew) {
            dy = -(dy+1);
            dx = -(dx+1);
            console.log(dy);
        }
        else {
            lives-=1;
            if(lives===0) {
                alert("Game Over!");
                document.location.reload();
            }
            else {
                ballx = canvas.width/2;
                bally = canvas.height-35;
                dx = 3;
                dy = -3;
                paddlex = (canvas.width-paddlew)/2;
            }
        }
    }
}
function update() {
    checkStartOver();
    checkCheat();
    hitSides();
    moveBall();
    movePaddle();
    checkCollisions();
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScores();
    drawLives();
}
function startScreen() {
initBricks();
setInterval(function() {
    update();
    draw();
}, 1000/FPS);
}