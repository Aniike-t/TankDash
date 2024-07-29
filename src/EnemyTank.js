import randomNumberBetween from './utils/random.js';

export default class EnemyTank {
    constructor(x, y, width, height, speed, ctx, imageSrc, cannonSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed*0.1;
        this.ctx = ctx;
        this.image = new Image();
        this.image.src = imageSrc;
        this.imageLoaded = false; // Flag to track if the image has loaded
        this.image.onload = () => {
            this.imageLoaded = true;
        };

        this.cannon = new Image();
        this.cannon.src = cannonSrc;
        this.cannonLoaded = false; // Flag to track if the cannon image has loaded
        this.cannon.onload = () => {
            this.cannonLoaded = true;
        };

        this.targetX = Math.random() * ctx.canvas.width;
        this.targetY = Math.random() * ctx.canvas.height;
        this.angle = 0; 
        this.cannonAngle = 0;
        this.accuracy = 0.8; 

        this.lastFireTime = Date.now();
        this.UpperCoolDownLimit = 4000;
        this.LowerCoolDownLimit = 6000;
        this.fireCooldown = randomNumberBetween(this.UpperCoolDownLimit,this.LowerCoolDownLimit);

        this.heart = 1;
        this.destroyed = false;

    }

    UpdateUpperAndLowerCoolDown(UpperCoolDownLimit,LowerCoolDownLimit){
        this.UpperCoolDownLimit = UpperCoolDownLimit;
        this.LowerCoolDownLimit = LowerCoolDownLimit;
    }


    setNewTarget() {
        this.targetX = Math.random() * this.ctx.canvas.width;
        this.targetY = Math.random() * this.ctx.canvas.height;
    }

    move() {
        const deltaX = this.targetX - this.x;
        const deltaY = this.targetY - this.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
        if (distance < this.speed) {
            this.setNewTarget();
        } else {
            const angleToTarget = Math.atan2(deltaY, deltaX);
            this.angle = angleToTarget * 180 / Math.PI; // Convert radians to degrees
            this.x += Math.cos(angleToTarget) * this.speed;
            this.y += Math.sin(angleToTarget) * this.speed;
            
            // Align the cannon angle with the tank's movement direction
            this.cannonAngle = this.angle; // This aligns the cannon with the body
        }
    }
    

    calculateFireAngle(playerTank) {
        const deltaX = playerTank.x - this.x;
        const deltaY = playerTank.y - this.y;
        let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

        angle = (angle + 360) % 360;
        this.cannonAngle = angle + (Math.random() * (1 - this.accuracy) - (1 - this.accuracy) / 2) * 360;
    }

    fire(playerTank) {
        this.calculateFireAngle(playerTank);
        const radians = this.cannonAngle * Math.PI / 180;
        
        return new Bullet(
            this.x + this.width / 2,
            this.y + this.height / 2,
            5, // bullet width
            5, // bullet height
            5, // bullet speed
            this.ctx,
            radians // direction
        );
    }

    getFireInfo() {
        const radians = this.cannonAngle * Math.PI / 180;
        const direction = {
            x: Math.cos(radians),
            y: Math.sin(radians)
        };
        return {
            x: this.x + this.width / 2, // Starting x position (adjust based on cannon's actual position)
            y: this.y + this.height / 2, // Starting y position (adjust based on cannon's actual position)
            direction: direction
        };
    }

    // Collision detection method
    checkCollision(otherTank) {
        const dx = this.x - otherTank.x;
        const dy = this.y - otherTank.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If distance is less than the sum of half the widths and half the heights, there's a collision
        return distance < (this.width / 2 + otherTank.width / 2) && distance < (this.height / 2 + otherTank.height / 2);
    }

    // Handle collision by adjusting the direction
    handleCollision() {
        // Slightly adjust position to simulate a bounce off
        const adjustment = 10; // The adjustment distance; tweak as needed
        this.x += (Math.random() - 0.5) * adjustment;
        this.y += (Math.random() - 0.5) * adjustment;

        // Set a new target position away from the current position
        this.setNewTarget();
    }

    draw() {
        this.ctx.save();
    
        // Shadow properties
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        this.ctx.beginPath();
        this.ctx.roundRect(
            this.x + 5, 
            this.y + 5, 
            this.width, 
            this.height, 
            10
        );
        this.ctx.fill();
        this.ctx.closePath();
    
        // Reset alpha and smoothing
        this.ctx.globalAlpha = 1.0;
        this.ctx.imageSmoothingEnabled = false;
    
        // Translate to the tank's center and rotate
        this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.ctx.rotate(this.angle * Math.PI / 180);
        
        // Draw the tank body
        this.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        
        // Draw the cannon on top
        this.ctx.rotate((this.cannonAngle - this.angle) * Math.PI / 180);
        this.ctx.drawImage(this.cannon, -this.width / 2, -this.height / 2, this.width, this.height);
    
        this.ctx.restore();
    }
    BulletHit() {
        this.heart = this.heart -1;
        if(this.heart < 1){
            this.destroyed = true;
        }
        console.log("Enemy Tank was hit! "+this.destroyed+"  lives : "+structuredClone(this.heart));
    }
}
