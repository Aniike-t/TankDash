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
    ReturnCurrentValueOfOverheat(){
        if(this.currentLevel < 1){
            return true;
        }else{
            return false;
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
        const baseX = this.x + shakeOffsetX;
        const baseY = this.y + shakeOffsetY;
        
        // Draw the thermometer base
        this.ctx.fillStyle = '#ddd';
        this.ctx.fillRect(baseX, baseY, this.width, this.height);
        
        // Draw the overheat level
        this.ctx.fillStyle = this.isShaking ? 'red' : '#f00'; // Change color if shaking
        this.ctx.fillRect(baseX, baseY + (1 - this.currentLevel) * this.height, this.width, this.currentLevel * this.height);
        
        // Draw the border around the thermometer
        this.ctx.lineWidth = 2; // Border thickness
        this.ctx.strokeStyle = '#000'; // Border color
        this.ctx.strokeRect(baseX, baseY, this.width, this.height);
        
        // Draw "Overheat" text in Comic Sans if shaking
        if (this.isShaking) {
            // Random position around the thermometer
            const textX = baseX + (Math.random() * 40 - 20); // Random offset within 40 pixels
            const textY = baseY + (Math.random() * 40 - 20); // Random offset within 40 pixels
    
            // Randomly select a color from yellow, red, and black
            const colors = ['yellow', 'red', 'black'];
            const textColor = colors[Math.floor(Math.random() * colors.length)];
            
            this.ctx.font = 'bold 20px Comic Sans MS'; // Font size and type
            this.ctx.textAlign = 'center'; // Center the text
            this.ctx.textBaseline = 'middle'; // Vertically center the text
    
            // Draw the text with a black stroke
            this.ctx.strokeStyle = 'black'; // Stroke color
            this.ctx.lineWidth = 2; // Stroke thickness
            this.ctx.strokeText('Overheat', textX, textY); // Draw stroke
    
            this.ctx.fillStyle = textColor; // Set the random text color
            this.ctx.fillText('Overheat', textX, textY); // Draw text
            
        }
        
        this.ctx.restore();
    }
    
    reset() {
        this.currentValue = 0; // Reset the overheat value to zero
    }
    
    
}
