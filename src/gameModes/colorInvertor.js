export default class ColorInverter {
    constructor(ctx, minDuration, maxDuration, minCooldown, maxCooldown) {
        this.ctx = ctx;
        this.minDuration = minDuration;
        this.maxDuration = maxDuration;
        this.minCooldown = minCooldown;
        this.maxCooldown = maxCooldown;
        this.invertColors = false;
        this.inversionDuration = 0;
        this.inversionCooldown = 0;
    }

    startInversion() {
        if (this.inversionCooldown <= 0) {
            this.invertColors = true;
            this.inversionDuration = Math.random() * (this.maxDuration - this.minDuration) + this.minDuration;
            this.inversionCooldown = Math.random() * (this.maxCooldown - this.minCooldown) + this.minCooldown;
        }
    }

    updateInversion() {
        if (this.invertColors) {
            this.inversionDuration -= 16.67; // Approximately 1 frame duration at 60fps
            if (this.inversionDuration <= 0) {
                this.invertColors = false;
            }
        } else {
            this.inversionCooldown -= 16.67;
            if (this.inversionCooldown <= 0) {
                this.startInversion();
            }
        }
    }

    applyInversion() {
        if (this.invertColors) {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'difference';
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }
    }

    resetInversion() {
        if (this.invertColors) {
            this.ctx.restore();
        }
        this.invertColors = false;
        this.inversionDuration = 0;
        this.inversionCooldown = 0;
    }

    restoreInversion() {
        if (this.invertColors) {
            this.ctx.restore();
        }
    }
}
