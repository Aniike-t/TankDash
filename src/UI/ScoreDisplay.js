export default class ScoreDisplay {
    constructor(ctx, x, y, iconSrc) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.score = 0;
        this.icon = new Image();
        this.icon.src = iconSrc;
        this.icon.onload = () => {
            this.draw(); // Draw the score once the icon is loaded
        };
    }

    increment() {
        this.score += 1; // Increment score by 1
    }

    draw() {
        // Draw the coin icon
        this.ctx.drawImage(this.icon, this.x, this.y, 30, 30);

        // Draw the score text
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.x + 35, this.y + 20);
    }
}
