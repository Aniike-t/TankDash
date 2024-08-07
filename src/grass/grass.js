export default class Grass {
    constructor(ctx, canvasWidth, canvasHeight, imageSrc, count) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        // this.image = new Image();
        this.image = imageSrc;
        this.count = count;
        this.positions = [];

        this.generatePositions();
    }

    generatePositions() {
        for (let i = 0; i < this.count; i++) {
            const x = Math.random() * this.canvasWidth;
            const y = Math.random() * this.canvasHeight;
            this.positions.push({ x, y });
        }
    }

    draw() {
        this.positions.forEach(pos => {
            this.ctx.drawImage(this.image, pos.x, pos.y);
        });
    }
}