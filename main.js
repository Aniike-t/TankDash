import Tank from './src/Tank.js';
import Bullet from './src/Bullet.js';
import HeartsDisplay from './src/UI/heartsdisplay.js';
import EnemyTank from './src/EnemyTank.js';
import Overheat from './src/UI/Overheat.js';
import randomNumberBetween from './src/utils/random.js'

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

//UI Elements
const heartsDisplay = new HeartsDisplay(ctx, 3, 'assets/heart.png', 20, 20, 30, 30);
const overheat = new Overheat(ctx, canvas.width - 60, canvas.height - 150, 30, 100, 0.2);


let bullets = [];

// Spawn enemies
const numEnemies = 5;
let enemies = spawnEnemies(numEnemies, ctx, tank);

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
            overheat.increment();
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

function spawnEnemies(numEnemies, ctx, playerTank) {
    const enemies = [];
    for (let i = 0; i < numEnemies; i++) {
        const enemy = new EnemyTank(
            Math.random() * ctx.canvas.width,
            Math.random() * ctx.canvas.height,
            65, // enemy tank width
            55, // enemy tank height
            0.5, // enemy tank speed
            ctx,
            'assets/tank1.png',
            'assets/tank1asset.png'
        );
        enemies.push(enemy);
    }
    return enemies;
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

//New Enemies Spawning
var UpperTimeLimitForEnemySpawn = 6000;
var UpperTimeLimitForEnemySpawn = 4000;
var TimeLimitForEnemySpawn = randomNumberBetween(UpperTimeLimitForEnemySpawn,UpperTimeLimitForEnemySpawn);
var EnemyCountFlag = false;
function spawnEnemiesIfNeeded() {
    if(EnemyCountFlag){
        const maxEnemies = 6;
        const currentEnemyCount = enemies.length;
    
        if (currentEnemyCount < maxEnemies) {
            const enemiesToSpawn = maxEnemies - currentEnemyCount;
            const newEnemies = spawnEnemies(enemiesToSpawn, ctx, tank);
            enemies = enemies.concat(newEnemies); 
        }
        TimeLimitForEnemySpawn = randomNumberBetween(UpperTimeLimitForEnemySpawn,UpperTimeLimitForEnemySpawn);
        EnemyCountFlag = false;
    }
}

setInterval(spawnEnemiesIfNeeded, TimeLimitForEnemySpawn); 


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tank.draw();
    tank.move(enemies);
    


    enemies = enemies.filter(enemy => !enemy.destroyed);
    if(enemies.length < 5){
        EnemyCountFlag = true;
    }
    // Draw and update enemies
    enemies.forEach(enemy => {
        enemy.draw();
        enemy.move();

        // Check for collisions with player tank
        if (enemy.checkCollision(tank)) {
            enemy.handleCollision();
        }

        // Check for collisions with other enemies
        enemies.forEach(otherEnemy => {
            if (enemy !== otherEnemy && enemy.checkCollision(otherEnemy)) {
                enemy.handleCollision();
                otherEnemy.handleCollision();
            }
        });

        // Enemy firing logic
        enemies.forEach(enemy => {
            enemy.draw();
            enemy.move();
        
            // Enemy firing logic
            if (Date.now() - enemy.lastFireTime >= enemy.fireCooldown) {
                const enemyFireInfo = enemy.getFireInfo();
                bullets.push(new Bullet(
                    enemyFireInfo.x, 
                    enemyFireInfo.y, 
                    bulletWidth, 
                    bulletHeight, 
                    bulletSpeed, 
                    enemyFireInfo.direction,
                    ctx,
                    'assets/bullet.png' // Path to the enemy bullet image
                ));
                enemy.lastFireTime = Date.now(); // Reset the fire time
            }
        });
    });
   

    // Draw and update bullets
    // Draw and update bullets
    bullets = bullets.filter(bullet => {
        bullet.move();
        bullet.draw();

        // Debugging information
        // console.log(`Bullet Position: x=${bullet.x}, y=${bullet.y}`);
        // console.log(`Tank Position: x=${tank.x}, y=${tank.y}`);
        // console.log(`Enemy Positions: ${enemies.map(e => `x=${e.x}, y=${e.y}`).join(", ")}`);

        if (bullet.checkCollisionWithTank(tank)) {
            console.log("Bullet hit player tank");
            // Handle collision with player tank (e.g., reduce health)
            return false;
        }

        for (const enemy of enemies) {
            if (bullet.checkCollisionWithTank(enemy)) {
                console.log("Bullet hit enemy tank");
                // Handle collision with enemy tank (e.g., reduce health)
                return false;
            }
        }

        return !bullet.isOutOfBounds();
    });


    overheat.coolDown();
    overheat.draw();
    heartsDisplay.draw();
    requestAnimationFrame(draw);
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

draw();
