export default class Tank {
    constructor(x, y, width, height, maxSpeed, ctx, imageSrc, cannon1Src, hearts) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxSpeed = maxSpeed; // Maximum speed
        this.currentSpeed = 0; // Current speed of the tank
        this.ctx = ctx;
        this.angle = 0; // Tank's angle in degrees
        this.cannonAngle = 0; // Cannon's angle in degrees
        this.image = new Image();
        this.image.src = imageSrc;
        this.movingForward = false;
        this.movingBackward = false;
        this.rotationSpeed = 5; // Degrees per frame
        this.cannon1 = new Image();
        this.cannon1.src = cannon1Src;

        // Recoil properties...
        this.recoilDistance = -10;
        this.recoilSpeed = 5;
        this.recoilProgress = 0;
        this.isRecoiling = false;

        this.heart = hearts;

        // Shaking parameters
        this.shakeMagnitude = 0.60; 
        this.shakeFrequency = 0.025; 

        // Acceleration and deceleration properties
        this.acceleration = 0.025; // Increase in speed per frame
        this.deceleration = 0.025; // Decrease in speed per frame
    }

    draw() {
        this.ctx.save();

        // Shadow and shake properties (same as before)
        this.ctx.globalAlpha = 0.5; // Semi-transparent shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Shadow color
        const shadowOffsetX = 5; // Horizontal offset for the shadow
        const shadowOffsetY = 5; // Vertical offset for the shadow
        const shadowRadius = 10; // Radius for rounded corners of the shadow

        this.ctx.beginPath();
        this.ctx.roundRect(
            this.x + shadowOffsetX, 
            this.y + shadowOffsetY, 
            this.width, 
            this.height, 
            shadowRadius
        );
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.globalAlpha = 1.0;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        const shakeX = Math.sin(Date.now() * this.shakeFrequency) * this.shakeMagnitude;
        const shakeY = Math.cos(Date.now() * this.shakeFrequency) * this.shakeMagnitude;

        this.ctx.translate(this.x + this.width / 2 + shakeX, this.y + this.height / 2 + shakeY);
        this.ctx.rotate(this.angle * Math.PI / 180);
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

        this.ctx.rotate((this.cannonAngle - this.angle) * Math.PI / 180);
        this.ctx.drawImage(this.cannon1, -this.width / 2 + recoilOffset + 20, -this.height / 2 + 5, this.width, this.height - 10);

        this.ctx.restore();
    }

    move(enemyTanks) {
        const radians = this.angle * Math.PI / 180;
        let newX = this.x;
        let newY = this.y;

        if (this.movingForward) {
            this.currentSpeed = Math.min(this.currentSpeed + this.acceleration, this.maxSpeed);
        } else if (this.movingBackward) {
            this.currentSpeed = Math.max(this.currentSpeed - this.acceleration, -this.maxSpeed);
        } else {
            this.applyDeceleration();
        }

        newX += this.currentSpeed * Math.cos(radians);
        newY += this.currentSpeed * Math.sin(radians);

        if (!this.checkCollisions(newX, newY, enemyTanks)) {
            this.x = Math.max(0, Math.min(newX, this.ctx.canvas.width - this.width));
            this.y = Math.max(0, Math.min(newY, this.ctx.canvas.height - this.height));
        }
    }

    applyDeceleration() {
        if (this.currentSpeed > 0) {
            this.currentSpeed = Math.max(this.currentSpeed - this.deceleration, 0);
        } else if (this.currentSpeed < 0) {
            this.currentSpeed = Math.min(this.currentSpeed + this.deceleration, 0);
        }
    }

    checkCollisions(newX, newY, enemyTanks) {
        for (let enemy of enemyTanks) {
            if (this !== enemy) {
                const dx = newX - enemy.x;
                const dy = newY - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = (this.width / 2 + enemy.width / 2);
                if (distance < minDistance) {
                    return true; // Collision detected
                }
            }
        }
        return false; // No collision
    }

    rotateLeft() {
        this.angle -= this.rotationSpeed;
        this.angle = (this.angle + 360) % 360; 
    }

    rotateRight() {
        this.angle += this.rotationSpeed;
        this.angle = (this.angle + 360) % 360; 
    }

    setMovingForward(isMoving) {
        this.movingForward = isMoving;
    }

    setMovingBackward(isMoving) {
        this.movingBackward = isMoving;
    }

    rotateCannonLeft() {
        this.cannonAngle -= this.rotationSpeed;
        this.cannonAngle = (this.cannonAngle + 360) % 360; 
    }

    rotateCannonRight() {
        this.cannonAngle += this.rotationSpeed;
        this.cannonAngle = (this.cannonAngle + 360) % 360; 
    }

    fire() {
        if (!this.isRecoiling) {
            this.isRecoiling = true;
            this.recoilProgress = 0;
        }
    }

    getFireInfo() {
        const radians = this.cannonAngle * Math.PI / 180;
        const direction = {
            x: Math.cos(radians),
            y: Math.sin(radians)
        };
        return {
            x: this.x + this.width / 2, 
            y: this.y + this.height / 2, 
            direction: direction
        };
    }

    BulletHit() {
        this.heart = this.heart - 1;
        console.log("Tank was hit!");
    }

    ReturnLifeValue() {
        return this.heart;
    }
}
