import randomNumberBetween from './utils/random.js';

export default class EnemyTank {
    constructor(x, y, width, height, speed, ctx, imageSrc, cannonSrc, AudioManager) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed*0.1;
        this.ctx = ctx;

        this.image = imageSrc;

        // this.imageLoaded = false; // Flag to track if the image has loaded
        // this.image.onload = () => {
        //     this.imageLoaded = true;
        // };

        this.cannon = cannonSrc;
        // this.cannon.src = cannonSrc;
        // this.cannonLoaded = false; // Flag to track if the cannon image has loaded
        // this.cannon.onload = () => {
        //     this.cannonLoaded = true;
        // };

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

        this.opacity = 0; // Initial opacity for fade-in effect
        this.fadeInDuration = 2000; // Duration of the fade-in in milliseconds
        this.fadeInStart = Date.now(); // Start time of the fade-in

        this.shakeAmplitude = 0.55; // Maximum distance of shake
        this.shakeFrequency = 0.025;

        //For Audio
        this.AudioManager = AudioManager;

    }

    fadeIn() {
        const elapsedTime = Date.now() - this.fadeInStart;
        const fraction = elapsedTime / this.fadeInDuration;
        this.opacity = Math.min(fraction, 1); // Ensure opacity doesn't exceed 1
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
        // Prevent movement during the fade-in duration
        const elapsedTime = Date.now() - this.fadeInStart;
        if (elapsedTime < this.fadeInDuration) {
            return; // Do not move until the fade-in is complete
        }

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
        this.AudioManager.playAudio('fire');
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
        this.fadeIn(); // Apply the fade-in effect

        this.ctx.save();

        // Apply opacity for fading effect
        this.ctx.globalAlpha = this.opacity;

        // Shadow properties
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
        this.ctx.globalAlpha = this.opacity;
        this.ctx.imageSmoothingEnabled = false;

        // Calculate shake offsets
        const shakeX = Math.sin(Date.now() * this.shakeFrequency) * this.shakeAmplitude;
        const shakeY = Math.cos(Date.now() * this.shakeFrequency) * this.shakeAmplitude;

        // Apply shake offsets and draw the tank
        this.ctx.translate(this.x + this.width / 2 + shakeX, this.y + this.height / 2 + shakeY);
        this.ctx.rotate(this.angle * Math.PI / 180);

        // Draw the tank body
        this.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

        let recoilOffset = 0;
        if (this.isRecoiling) {
            recoilOffset = Math.sin((this.recoilProgress / 100) * Math.PI) * this.recoilDistance;
            this.recoilProgress += this.recoilSpeed;

            if (this.recoilProgress >= 100) {
                this.isRecoiling = false;
                this.recoilProgress = 0;
            }
        }

        // Draw the cannon on top
        this.ctx.rotate((this.cannonAngle - this.angle) * Math.PI / 180);
        this.ctx.drawImage(this.cannon, -this.width / 2 + recoilOffset + 20, -this.height / 2 + 5, this.width, this.height - 10);

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
