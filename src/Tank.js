// tank.js
export default class Tank {
    constructor(x, y, width, height, speed, ctx, imageSrc, cannon1Src) {
        // Existing properties...
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
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
    }

    draw() {
        this.ctx.save();
    
        // Shadow properties
        this.ctx.globalAlpha = 0.5; // Semi-transparent shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Shadow color
        const shadowOffsetX = 5; // Horizontal offset for the shadow
        const shadowOffsetY = 5; // Vertical offset for the shadow
        const shadowRadius = 10; // Radius for rounded corners of the shadow
    
        // Draw the rounded shadow
        this.ctx.beginPath();
        this.ctx.roundRect(
            this.x + shadowOffsetX, 
            this.y + shadowOffsetY, 
            this.width, 
            this.height, 
            shadowRadius // Rounded corner radius
        );
        
        this.ctx.fill();
        this.ctx.closePath();
    
        // Reset alpha to full opacity for drawing the tank
        this.ctx.globalAlpha = 1.0;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
    
        // Draw the tank body
        this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
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
    
        // Draw the cannon on top of the tank
        this.ctx.rotate((this.cannonAngle - this.angle) * Math.PI / 180);
        this.ctx.drawImage(this.cannon1, -this.width / 2 + recoilOffset + 20, -this.height / 2 + 5, this.width, this.height - 10);
    
        this.ctx.restore();
    }
    

    move() {
        const radians = this.angle * Math.PI / 180;
    
        if (this.movingForward) {
            this.x += this.speed * Math.cos(radians);
            this.y += this.speed * Math.sin(radians);
        }
        if (this.movingBackward) {
            this.x -= this.speed * Math.cos(radians);
            this.y -= this.speed * Math.sin(radians);
        }

        this.x = Math.max(0, Math.min(this.x, this.ctx.canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, this.ctx.canvas.height - this.height));
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

    // Method to get the fire direction of the tank's cannon
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
}
