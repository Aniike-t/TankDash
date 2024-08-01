export default class ScoreDisplay {
    constructor(ctx, x, y, iconSrc) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.score = 0;
        this.icon = new Image();
        this.icon.src = iconSrc;
        this.icon.onload = () => {
            this.draw();
        };
        this.highScore =0;
    }

    increment() {
        this.score += 1; // Increment score by 1
    }

    resetScore(){
        if(this.score > this.highScore){
            this.highScore = this.score;
        }
        this.score = 0;
    }

    draw() {
        this.ctx.drawImage(this.icon, this.x, this.y, 30, 30);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.x + 35, this.y + 20);
    }
}
