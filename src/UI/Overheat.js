export default class Overheat {
    constructor(ctx, x, y, width, height, incrementValue) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.currentLevel = 0; // Current level of overheat (0 to 1)
        this.maxLevel = 1; // Maximum level of overheat
        this.coolDownRate = 0.001; // Rate at which the bar cools down
        this.shakeIntensity = 10; // How much the bar shakes when full
        this.isShaking = false;
        this.shakeTime = 0; // Time to shake
        this.incrementValue = incrementValue;
    }

    increment() {
        this.currentLevel += this.incrementValue; // Increase the level when a bullet is fired
        if (this.currentLevel >= this.maxLevel) {
            this.currentLevel = this.maxLevel;
            this.isShaking = true;
            this.shakeTime = 10; // Duration of the shake
        }
    }

    coolDown() {
        if (this.currentLevel > 0) {
            this.currentLevel -= this.coolDownRate;
            if (this.currentLevel < 0) {
                this.currentLevel = 0;
            }
        }
    }

    draw() {
        this.ctx.save();
    
        // Calculate shake offset if shaking
        let shakeOffsetX = 0;
        let shakeOffsetY = 0;
        if (this.isShaking) {
            shakeOffsetX = Math.random() * this.shakeIntensity - this.shakeIntensity / 2;
            shakeOffsetY = Math.random() * this.shakeIntensity - this.shakeIntensity / 2;
            this.shakeTime -= 1;
            if (this.shakeTime <= 0) {
                this.isShaking = false;
            }
        }
    
        // Position for the thermometer
        const x = this.x + shakeOffsetX;
        const y = this.y + shakeOffsetY;
    
        // Draw the thermometer base
        this.ctx.fillStyle = '#ddd';
        this.ctx.fillRect(x, y, this.width, this.height);
    
        // Draw the overheat level
        this.ctx.fillStyle = this.isShaking ? 'red' : '#f00'; // Change color if shaking
        this.ctx.fillRect(x, y + (1 - this.currentLevel) * this.height, this.width, this.currentLevel * this.height);
    
        // Draw the border around the thermometer
        this.ctx.lineWidth = 2; // Border thickness
        this.ctx.strokeStyle = '#000'; // Border color
        this.ctx.strokeRect(x, y, this.width, this.height);
    
        this.ctx.restore();
    }
    
}
