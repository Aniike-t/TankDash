export default class Bullet {
    constructor(x, y, width, height, speed, direction, ctx, bulletImageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = direction;
        this.ctx = ctx;
        this.bulletImage = new Image();
        this.bulletImage.src = bulletImageSrc;
    }

    draw() {
        this.ctx.save(); // Save the current state of the context
        this.ctx.translate(this.x, this.y); // Translate to the bullet's position

        // Calculate the angle for rotation based on the direction vector
        const angle = Math.atan2(this.direction.y, this.direction.x);
        this.ctx.rotate(angle); // Rotate the context

        // Draw the bullet image, adjusting for its own width and height
        this.ctx.drawImage(
            this.bulletImage,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        this.ctx.restore(); // Restore the context to its original state
    }

    move() {
        // Update bullet's position based on its speed and direction
        this.x += this.speed * this.direction.x;
        this.y += this.speed * this.direction.y;
    }

    isOutOfBounds() {
        // Check if the bullet is out of canvas bounds
        return (
            this.x < 0 ||
            this.x > this.ctx.canvas.width ||
            this.y < 0 ||
            this.y > this.ctx.canvas.height
        );
    }
}
