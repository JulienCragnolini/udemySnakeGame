var canvasWidth = 900;
var canvasHeight = 600;
var blockSize = 30;
var ctx;
var delay = 100;
var snakee;
var applee;
var widthInBlock = canvasWidth/blockSize;
var heightInBlock = canvasHeight/blockSize;
var score;
var timeout;

class Snake {
    constructor(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = () => {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (let i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advence = () => {
            var nextPosition = this.body[0].slice();
            switch (this.direction) {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw('Invalide direction.');
            }
            this.body.unshift(nextPosition);
            if (!this.ateApple) {
                this.body.pop();
            } else {
                this.ateApple = false;
            }
        };
        this.setDirection = (newDirection) => {
            var allowedDirection;

            switch (this.direction) {
                case "left":
                case "right":
                    allowedDirection = ['up', 'down'];
                    break;
                case "down":
                case "up":
                    allowedDirection = ['left', 'right'];
                    break;
                default:
                    throw('Invalide direction.');
            }
            if (allowedDirection.indexOf(newDirection > -1)) {
                this.direction = newDirection;
            }
        };
        this.checkCollision = () => {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlock - 1;
            var maxY = heightInBlock - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                wallCollision = true;
            }

            for (let i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }                
            }
        return wallCollision || snakeCollision;
        }
        this.eatingApple = (appleToEat) => {
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                return true;
            }
            else {
                return false;
            }
        } 
    }
}

class Apple {
    constructor(position) {
        this.position = position;
        this.draw = () => {
            ctx.save();
            ctx.fillStyle = '#33cc33';
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = () => {
            var newX = Math.round(Math.random() * (widthInBlock - 1));
            var newY = Math.round(Math.random() * (heightInBlock - 1));
            this.position= [newX, newY];
        }
        this.isOnSnake = (snakeToCheck) => {
            var isOnSnake = false;
            for (let i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }; 
            }
            return isOnSnake;
        }
    }
}

document.onkeydown = function handleKey(e) {
    var key = e.keyCode;
    var newDirection;

    switch (key) {
        case 37:
            newDirection = "left";
            break;
        case 38:
            newDirection = "up";
            break;
        case 39:
            newDirection = "right";
            break;
        case 40:
            newDirection = "down";
            break;
        case 32:
            restart();
            return;
        default:
            return;
    }
    snakee.setDirection(newDirection);
}

function init() {
    canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "30px solid grey";
    canvas.style.margin = "100px auto";
    canvas.style.brackgroundColor = "#ddd"
    canvas.style.display = "block";
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    snakee = new Snake([[6,4], [5,4], [4,4]], 'right');
    applee = new Apple([10,10]);
    score = 0;
    refreshCanvas();
}

function refreshCanvas() {
    snakee.advence();
    if (snakee.checkCollision()) {
        gameOver();
    }
    else {
        if (snakee.eatingApple(applee)) {
            score++;
            snakee.ateApple = true;
            do {
            applee.setNewPosition();
            } while(applee.isOnSnake(snakee));
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScore();
        snakee.draw();
        applee.draw();
        timeout = setTimeout(refreshCanvas, delay);
    }
}

function gameOver() {
    ctx.save();
    ctx.font = "bold 70px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    var centerX = canvasWidth/2;
    var centerY = canvasHeight/2;
    ctx.strokeText('Game Over', centerX, centerY - 180);
    ctx.fillText('Game Over', centerX, centerY - 180);
    ctx.font = "bold 30px sans-serif";
    ctx.strokeText('Appuyez sur la touche ESPACE pour rejouer.', centerX, centerY - 120);
    ctx.fillText('Appuyez sur la touche ESPACE pour rejouer.', centerX, centerY - 120);
    ctx.restore();
}

function restart() {
    snakee = new Snake([[6,4], [5,4], [4,4]], 'right');
    applee = new Apple([10,10]);
    score = 0;
    clearTimeout(timeout);
    refreshCanvas();
}

function drawScore() {
    ctx.save();
    ctx.font = "bold 200px sans-serif";
    ctx.fillStyle = "grey";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var centerX = canvasWidth/2;
    var centerY = canvasHeight/2;
    ctx.fillText(score.toString(), centerX, centerY);
    ctx.restore();
}

function drawBlock(ctx, pos) {
    var x = pos[0] * blockSize;
    var y = pos[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);

}

init();