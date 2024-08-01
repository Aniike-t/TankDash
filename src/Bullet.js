// Bullet.js
import Explosion from './Explosion.js';

export default class Bullet {
    constructor(x, y, width, height, speed, direction, ctx, bulletImage, boomImage, AudioManager) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = direction;
        this.ctx = ctx;
        this.bulletImage = bulletImage;
        this.creationTime = Date.now(); // Track when the bullet was created
        this.lifespan = 250; // Bullet lifespan in milliseconds (e.g., 250ms = 0.25s)
        this.boomImage = boomImage;
        this.AudioManager = AudioManager;
    }

    draw() {
        if (this.bulletImage && this.bulletImage.complete) {
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            const angle = Math.atan2(this.direction.y, this.direction.x);
            this.ctx.rotate(angle);
            this.ctx.drawImage(
                this.bulletImage,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
            this.ctx.restore();
        } else {
            console.error("Bullet image is not loaded or invalid");
        }
 
    }

    move() {
        this.x += this.speed * this.direction.x;
        this.y += this.speed * this.direction.y;
    }

    isOutOfBounds() {
        return (
            this.x < 0 ||
            this.x > this.ctx.canvas.width ||
            this.y < 0 ||
            this.y > this.ctx.canvas.height
        );
    }

    shouldCheckCollision() {
        // Check if the bullet has lived longer than its lifespan
        return (Date.now() - this.creationTime) > this.lifespan;
    }
    
    // Modified checkCollisionWithTank method
    checkCollisionWithTank(tank, explosions) {
        if (!this.shouldCheckCollision()) {
            return false;
        }

        const padding = 10;
        const bulletBounds = {
            left: this.x - this.width / 2 - padding,
            right: this.x + this.width / 2 + padding,
            top: this.y - this.height / 2 - padding,
            bottom: this.y + this.height / 2 + padding
        };

        const tankBounds = {
            left: tank.x - tank.width / 2 - padding,
            right: tank.x + tank.width / 2 + padding,
            top: tank.y - tank.height / 2 - padding,
            bottom: tank.y + tank.height / 2 + padding
        };

        if (
            bulletBounds.left < tankBounds.right &&
            bulletBounds.right > tankBounds.left &&
            bulletBounds.top < tankBounds.bottom &&
            bulletBounds.bottom > tankBounds.top
        ) {
            this.AudioManager.playAudio('explosion');
            tank.BulletHit();
            
            // Create a new explosion at the collision point
            explosions.push(new Explosion(tank.x, tank.y, this.ctx, this.boomImage));
            
            return true;
        }

        return false;
    }
    
}
