import('https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js');

let Game;
let canvasWidth;
let canvasHeight;

function setup() {
    createCanvas(windowWidth, windowHeight);
    canvasHeight = windowHeight;
    canvasWidth = windowWidth;

    console.log(canvasWidth, canvasHeight);
}

function draw() {
    Game.render();
}