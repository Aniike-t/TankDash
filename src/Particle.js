export default class Particle {
    constructor(x, y, ctx, speed, angle, color, size, lifespan, spreadRadius) {
        // Initialize particle position with a random offset within the spread radius
        this.x = x + (Math.random() - 0.5) * 2 * spreadRadius;
        this.y = y + (Math.random() - 0.5) * 2 * spreadRadius;
        this.ctx = ctx;
        this.speed = speed;
        this.angle = angle;
        this.color = color;
        this.size = size;
        this.lifespan = lifespan;
        this.creationTime = Date.now();
    }

    draw() {
        const elapsedTime = Date.now() - this.creationTime;
        const lifeProgress = elapsedTime / this.lifespan;

        if (lifeProgress >= 1) {
            return false; // Particle is finished
        }

        // Update particle position
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        // Draw the particle
        this.ctx.save();
        this.ctx.globalAlpha = 1 - lifeProgress; // Fade out particle
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.size, this.size); // 8-bit style square particle
        this.ctx.restore();

        return true; // Particle is still active
    }
}
