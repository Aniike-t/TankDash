// Bullet.js
export default class Bullet {
    constructor(x, y, width, height, speed, direction, ctx, bulletImageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = direction;
        this.ctx = ctx;
        this.bulletImage = new Image();
        this.bulletImage.src = '../assets/bullet.png';
        this.creationTime = Date.now(); // Track when the bullet was created
        this.lifespan = 500; // Bullet lifespan in milliseconds (e.g., 500ms = 0.5s)
    }

    draw() {
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
    
    checkCollisionWithTank(tank) {
        if (!this.shouldCheckCollision()) {
            return false; // Skip collision check if the bullet is too young
        }
    
        const padding = 5; // Adjust this value to increase or decrease the bounding box size
    
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
            tank.BulletHit(); // Call BulletHit() on the tank that was hit
            return true; // Bullet hit the tank
        }
    
        return false; // No collision
    }
    
}
