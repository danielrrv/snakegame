const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = "white";
const SNAKE_COLOUR = 'firebrick';
const SNAKE_BORDER_COLOUR = 'black'

let game, food, snake;

class Snake {
    constructor(len, step) {
        this._body = this.generateBody(len)
        this._head = this._body[0];
        this._tail = this._body[-1];
        this._step = step
    }

    set head(coord) {
        this._head = { x: this._head.x + coord.x, y: this._head.y + coord.y };
    }
    /**
     * 
     * @param {number} len
     * @param {number} step
     * @returns {{x:number,y:number}[]} 
     * 
    */
    generateBody(len = 4, step = 16) {
        let array = [];
        for (let i = 0; i < len; i++) {
            array.push({ x: myGame.dimension.x / 2 + myGame.step * i, y: myGame.dimension.y / 2 })
        }
        return array;
    }
    drawSnake(ctx) {
        game = setInterval(() => {
            let oldHead = this.body[0];
            this.add(myGame.dir);
            ctx.fillStyle = "blue";
            ctx.fillRect(this.head.x, this.head.y, this.step, this.step);
            ctx.strokestyle = CANVAS_BORDER_COLOUR;
            //TODO: Evalute the condition to game over.
            if (this.body.slice(4).some((coor) => coor.y == oldHead.y) && this.body.slice(4).some((coor) => coor.x == oldHead.x)) {
                console.log("game Over!")
                clearInterval(game);
            }
            if (food.posi.foodPosX === oldHead.x && food.posi.foodPosY === oldHead.y) this.eat();
            ctx.clearRect(this.tail.x, this.tail.y, this.step, this.step);

            for (let segment of this.body.slice(1)) {//<--- re-paint the  snake every interval
                ctx.fillStyle = SNAKE_COLOUR;
                ctx.fillRect(segment.x, segment.y, this.step, this.step);
                ctx.strokestyle = CANVAS_BORDER_COLOUR;
            }
        }, this._step)

    }
    size() {
        return this.body.length;
    }
    get body() {
        return this._body;
    }
    get head() {
        return this._head;
    }

    get tail() {
        return this._tail;
    }
    get step() {
        return this._step;
    }
    add(coord) {
        let newHead = { x: this.head.x + coord.x, y: this.head.y + coord.y }
        this._head = newHead
        this._tail = this._body[this.size() - 1]
        this._body.unshift(this._head);
        this._body.pop();
    }
    eat() {
        this.body.push({ x: this._tail.x + this.step, y: this._tail.y + this.step })
    }
}

class Food {
    constructor(dimensions, ctx, step) {
        this._maxWidth = dimensions.x;
        this._step = step
        this._maxHeigth = dimensions.y;
        this._foodPosX = 290;
        this._foodPostY = 290;
        this._duration = Math.floor(4 + Math.random() * 6) * 1000;
        this._cxt = ctx;
    }

    get step() {
        return this._step;
    }

    get ctx() {
        return this._cxt;
    }

    get posi() {
        return { foodPosX: this._foodPosX, foodPosY: this._foodPostY }
    }
    duration(n) {
        this._duration = Math.floor(4 + Math.random() * 6) * 1000;

    }
    generateRandom() {
        let foodPosX = Math.floor(Math.random() * this._maxWidth / this.step) * this.step;
        let foodPosY = Math.floor(Math.random() * this._maxHeigth / this.step) * this.step;
        this._foodPosX = foodPosX;
        this._foodPostY = foodPosY;
    }
    drawFood() {
        this.duration()
        this.generateRandom();
        this.ctx.fillStyle = CANVAS_BORDER_COLOUR;
        this.ctx.fillRect(this.posi.foodPosX, this.posi.foodPosY, this.step, this.step);
        setTimeout(() => {
            this.ctx.clearRect(this.posi.foodPosX, this.posi.foodPosY, this.step, this.step);
        }, this._duration + 2000)
    }
    /**
     * @param {number} interval
     * 
    */
    generateFood(interval) {
        setInterval(() => {
            this.drawFood();
        }, this._duration)

    }
}
class Game {
    constructor(dimensiones) {
        this._step = 16;//
        this._score = 10;//<-- rate of score after eat.
        this._speed = 50 //
        this._limit = dimensiones;
        this._duration = 5000;
        this.document = document.getElementById("g");
        this.ctx = this.document.getContext("2d");
        this._dir = { x: 0, y: this._step };
    }
    get dimension() {
        return this._limit;
    }
    get score() {
        return this._score;
    }
    /**
     * @param {object} coord
     * 
     * 
     *  */
    steer(coord) {
        this._dir = coord;
    }
    /**
     * @returns {object} _dir
     */
    get dir() {
        return this._dir;
    }
    get step() {
        return this._step;
    }
    set dimension(dimensions) {
        this._limit = dimensions
    }
    set score(scores) {
        this._score = scores;
    }
    set dir(direcciones) {
        this._dir = direcciones;
    }
    createEnviron() {
        this.document.width = this.dimension.x;
        this.document.height = this.dimension.y;
        this.ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;//<---  Select the colour to fill the canvas
        this.ctx.strokestyle = CANVAS_BORDER_COLOUR;//<---  Select the colour for the border of the canvas
        this.ctx.fillRect(0, 0, this.document.width, this.document.height);//<--- Draw a "filled" rectangle to cover the entire canvas
        this.ctx.strokeRect(0, 0, this.document.width, this.document.height);//<--- Draw a "border" around the entire canvas
    }
    play() {
        this.ctx.fillStyle = CANVAS_BORDER_COLOUR
        this.ctx.fillText(this._score, this.dimension.x * 0.8, 20, 20);
        this.createEnviron();
        snake = new Snake(10, this.step);//<--- Boostrap the snake object.
        food = new Food(this.dimension, this.ctx, this.step);//<---- All snake needs to eat.
        food.generateFood(6000)//<--- Frequency of the feed.
        snake.drawSnake(this.ctx, this.dir);
    }
}


const myGame = new Game({ x: 800, y: 800 });//<--- Boostrap the game.
myGame.play();//<--- Dale play!!

document.addEventListener('keydown', function (event) {
    /**
     * TODO:Replace keyCode.
     * !keyCode is deprecated!
    */
    let key = event.keyCode,coord;
    switch (key) {
        case 37:
            d = "LEFT";
            coord = { x: -myGame.step, y: 0 }
            myGame.steer(coord)
            break;
        case 38:
            d = "UP";
            coord = { x: 0, y: -myGame.step }
            myGame.steer(coord)
            break;
        case 39:
            d = "RIGHT";
            coord = { x: myGame.step, y: 0 }
            myGame.steer(coord)
            break;
        case 40:
            d = "DOWN";
            coord = { x: 0, y: myGame.step }
            myGame.steer(coord)
            break;
        default:
            d = "RIGHT";
            return;
    }
});


















// let scoreId = document.getElementById('score');






// function drawSnake() {
//     ctx.fillText(score.toString(), gameCanvas.width * 0.8, 20, 20);
//     let body = initial.slice(4);
//     oldTail = initial.pop();
//     oldHead = initial[0];
//     if (foodPosX === oldHead.x && foodPosY === oldHead.y) {
//         console.log('toco')
//         initial.push({ x: oldTail.x + step, y: oldTail.y + step })
//         score++;
//         foodPosX = null;
//         foodPosY = null;
//     }


//     if (body.some((coor) => coor.y == oldHead.y) && body.some((coor) => coor.x == oldHead.x)) {
//         clearInterval(game);

//     };
//     if (oldHead.x > limit.x || oldHead.y > limit.y || oldHead.x < 0 || oldHead.y < 0) {
//         limit.x -= 113;
//         limit.y -= 113;
//         ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
//         //  Select the colour for the border of the canvas
//         ctx.strokestyle = CANVAS_BORDER_COLOUR;
//         ctx.fillRect(0, 0, limit.x, limit.y);
//         ctx.strokeRect(0, 0, limit.x, limit.y);
//         initial.unshift({ x: limit.x / 2, y: limit.x / 2 })

//     }
//     let newHead = { x: initial[0].x + coord.x, y: initial[0].y + coord.y };

//     initial.unshift(newHead)
//     ctx.clearRect(oldTail.x, oldTail.y, step, step);
//     ctx.fillStyle = "blue";
//     ctx.fillRect(newHead.x, newHead.y, step, step);
//     ctx.strokestyle = CANVAS_BORDER_COLOUR

//     for (segment of initial.slice(1)) {


//         ctx.fillStyle = SNAKE_COLOUR;
//         ctx.fillRect(segment.x, segment.y, step, step);
//         ctx.strokestyle = CANVAS_BORDER_COLOUR;

//     }

// }

// function createDot() {
//     foodPosX = Math.floor(Math.random() * limit.x / step) * step;
//     foodPosY = Math.floor(Math.random() * limit.y / step) * step;
//     ctx.fillStyle = CANVAS_BORDER_COLOUR;
//     ctx.fillRect(foodPosX, foodPosY, step, step);
//     // ctx.beginPath();
//     // ctx.arc(foodPosX, foodPosY, 5, 0, 2 * Math.PI, true);
//     // ctx.fill();

// }
// function removeDot() {
//     ctx.clearRect(foodPosX, foodPosY, 20.0, 20.0);

// }
// function drawFood() {
//     duration = Math.floor(4 + Math.random() * 6)
//     createDot();
//     setTimeout(() => {
//         removeDot();
//         foodPosX = null;
//         foodPosY = null;
//     }, duration + 2000)

// }
// setInterval(() => {
//     drawFood();
// }, duration);


// function eatFood() {

// }
// let d;
// document.addEventListener('keydown', function (event) {
//     let key = event.keyCode;

//     switch (key) {
//         case 37:
//             d = "LEFT";
//             coord = { x: -step, y: 0 }
//             break;
//         case 38:
//             d = "UP";
//             coord = { x: 0, y: -step }
//             break;
//         case 39:
//             d = "RIGHT";
//             coord = { x: step, y: 0 }
//             break;
//         case 40:
//             d = "DOWN";
//             coord = { x: 0, y: step }
//             break;
//         default:
//             d = "RIGHT";
//             break;
//     }
//     return coord;
// });




