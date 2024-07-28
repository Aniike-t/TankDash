import Tank from './src/Tank.js';
import Bullet from './src/Bullet.js';
import HeartsDisplay from './src/UI/heartsdisplay.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800; // Adjust based on your requirements
canvas.height = 600; // Adjust based on your requirements

// Disable image smoothing to keep image quality
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

const tankWidth = 65;
const tankHeight = 55;
const tankSpeed = 2;
const bulletWidth = 50;
const bulletHeight = 50;
const bulletSpeed = 5;


const tank = new Tank(
    canvas.width / 2 - tankWidth / 2,
    canvas.height / 2 - tankHeight / 2,
    tankWidth, 
    tankHeight, 
    tankSpeed, 
    ctx, 
    'assets/tank1.png',
    'assets/tank1asset.png'
);
const heartsDisplay = new HeartsDisplay(ctx, 3, 'assets/heart.png', 20, 20, 30, 30);
let bullets = [];

function keyDownHandler(e) {
    switch(e.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
            tank.setMovingForward(true);
            break;
        case 's':
        case 'S':
        case 'ArrowDown':
            tank.setMovingBackward(true);
            break;
        case 'a':
        case 'A':
        case 'ArrowLeft':
            tank.rotateLeft();
            break;
        case 'd':
        case 'D':
        case 'ArrowRight':
            tank.rotateRight();
            break;
        case 'q':
        case 'Q':
            tank.rotateCannonLeft();
            break;
        case 'e':
        case 'E':
            tank.rotateCannonRight();
            break;
        case ' ':
        case '0':
            tank.fire();
            const fireInfo = tank.getFireInfo();
            console.log(`Firing from x: ${fireInfo.x}, y: ${fireInfo.y}, angle: ${fireInfo.direction}`);
            bullets.push(new Bullet(
                fireInfo.x, 
                fireInfo.y, 
                bulletWidth, 
                bulletHeight, 
                bulletSpeed, 
                fireInfo.direction,
                ctx,
                'assets/bullet.png' // Path to the bullet image
            ));
            break;
    }
}


function keyUpHandler(e) {
    switch(e.key) {
        case 'w':
        case 'ArrowUp':
            tank.setMovingForward(false);
            break;
        case 's':
        case 'ArrowDown':
            tank.setMovingBackward(false);
            break;
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tank.draw();
    tank.move();
    heartsDisplay.draw();

    bullets = bullets.filter(bullet => !bullet.isOutOfBounds());
    bullets.forEach(bullet => {
        bullet.draw();
        bullet.move();
    });

    requestAnimationFrame(draw);
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

draw();
