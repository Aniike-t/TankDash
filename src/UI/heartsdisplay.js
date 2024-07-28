export default class HeartsDisplay {
    constructor(ctx, maxLives, heartImageSrc, x, y, heartWidth, heartHeight) {
        this.ctx = ctx;
        this.maxLives = maxLives;
        this.lives = maxLives;
        this.heartImage = new Image();
        this.heartImage.src = heartImageSrc;
        this.x = x;
        this.y = y;
        this.heartWidth = heartWidth * 2;
        this.heartHeight = heartHeight * 2;
        this.bounceAmplitude = 5; // The amount of bounce in pixels
        this.bounceSpeed = 0.05; // Speed of the bounce animation
        this.bounceOffset = 0; // To track the bounce progress
    }

    draw() {
        this.bounceOffset += this.bounceSpeed;
        for (let i = 0; i < this.lives; i++) {
            const bounce = Math.sin(this.bounceOffset + i * 0.5) * this.bounceAmplitude;
            this.ctx.drawImage(
                this.heartImage,
                this.x + i * 0.75 * (this.heartWidth + 10), // 10px space between hearts
                this.y + bounce,
                this.heartWidth,
                this.heartHeight
            );
        }
    }

    setLives(lives) {
        this.lives = Math.max(0, Math.min(lives, this.maxLives)); // Clamp between 0 and maxLives
    }

    decrementLife() {
        this.setLives(this.lives - 1);
    }

    incrementLife() {
        this.setLives(this.lives + 1);
    }
}
