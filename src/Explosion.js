import Particle from './Particle.js'; // Make sure to import the Particle class

export default class Explosion {
    constructor(x, y, ctx, imageSrc, duration = 2000, text = "BOOM") {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.image = imageSrc;
        this.opacity = 1;
        this.fadeOutDuration = duration;
        this.startTime = Date.now();
        this.text = text; // "BOOM" text


        this.particles = [];
        this.density = 50;
        this.spreadRadius = 0.1;
        this.paticleSpeed = 0.75;

        // Generate particles with spreadRadius and density
        for (let i = 0; i < this.density; i++) {
            this.particles.push(new Particle(
                this.x, this.y, ctx, 
                Math.random() * 2 -this.paticleSpeed, // speed
                Math.random() * 2 * Math.PI, // angle
                'rgba(255, 255, 0, 1)', // color
                Math.random() * 4 + 2, // size
                1000 + Math.random() * 2000, // lifespan
                this.spreadRadius // spread radius for initial particle distribution
            ));
        }
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
        this.ctx.fillText(this.text, this.x, this.y - this.image.height / 2 + 175); // Adjust the position as needed
        this.ctx.strokeText(this.text, this.x, this.y - this.image.height / 2 + 175);
        
        this.ctx.restore();

        // Draw particles
        this.particles = this.particles.filter(particle => particle.draw());

        return true; // Explosion is still active
    }
}
