export default class Explosion {
    constructor(x, y, ctx, imageSrc, duration = 2000, text = "BOOM") {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.image = new Image();
        this.image.src = imageSrc;
        this.opacity = 1;
        this.fadeOutDuration = duration;
        this.startTime = Date.now();
        this.text = text; // "BOOM" text
    }

    draw() {
        const elapsedTime = Date.now() - this.startTime;
        this.opacity = Math.max(1 - elapsedTime / this.fadeOutDuration, 0);

        if (this.opacity <= 0) {
            return false; // Explosion is finished
        }

        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        
        // Draw explosion image
        this.ctx.drawImage(this.image, this.x - this.image.width / 2, this.y - this.image.height / 2);
        
        // Draw "BOOM" text
        this.ctx.font = "bold 40px 'Comic Sans MS', sans-serif";
        this.ctx.fillStyle = `rgba(255, 0, 0, ${this.opacity})`; // Fade out text with the image
        this.ctx.strokeStyle = `rgba(0, 0, 0, ${this.opacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.x, this.y - this.image.height / 2 +175 ); // Adjust the position as needed
        this.ctx.strokeText(this.text, this.x, this.y - this.image.height / 2 +175);
        
        this.ctx.restore();

        return true; // Explosion is still active
    }
}
