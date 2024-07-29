export default class GameOver {
    constructor(ctx, canvas, startGame, showHelp, openShop) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.isVisible = false;
        this.startGame = startGame; // Function reference
        this.showHelp = showHelp;   // Function reference for help
        this.openShop = openShop;   // Function reference for shop

        // Set up the restart button
        this.restartButton = document.createElement('button');
        this.restartButton.innerText = 'Restart';
        this.restartButton.style.position = 'absolute';
        this.restartButton.style.top = '50%';
        this.restartButton.style.left = '50%';
        this.restartButton.style.transform = 'translate(-50%, -50%) translateY(50px)';
        this.restartButton.style.padding = '10px 20px';
        this.restartButton.style.fontSize = '20px';
        this.restartButton.style.cursor = 'pointer';
        this.restartButton.style.display = 'none'; // Hide by default
        document.body.appendChild(this.restartButton);

        // Set up the help button
        this.helpButton = document.createElement('button');
        this.helpButton.innerText = 'Help';
        this.helpButton.style.position = 'absolute';
        this.helpButton.style.top = '50%';
        this.helpButton.style.left = '50%';
        this.helpButton.style.transform = 'translate(-50%, -50%) translateY(100px)';
        this.helpButton.style.padding = '10px 20px';
        this.helpButton.style.fontSize = '20px';
        this.helpButton.style.cursor = 'pointer';
        this.helpButton.style.display = 'none'; // Hide by default
        document.body.appendChild(this.helpButton);

        // Set up the shop button
        this.shopButton = document.createElement('button');
        this.shopButton.innerText = 'Shop';
        this.shopButton.style.position = 'absolute';
        this.shopButton.style.top = '50%';
        this.shopButton.style.left = '50%';
        this.shopButton.style.transform = 'translate(-50%, -50%) translateY(150px)';
        this.shopButton.style.padding = '10px 20px';
        this.shopButton.style.fontSize = '20px';
        this.shopButton.style.cursor = 'pointer';
        this.shopButton.style.display = 'none'; // Hide by default
        document.body.appendChild(this.shopButton);

        // Shop UI elements
        this.shopUI = document.createElement('div');
        this.shopUI.style.position = 'absolute';
        this.shopUI.style.top = '50%';
        this.shopUI.style.left = '50%';
        this.shopUI.style.transform = 'translate(-50%, -50%) translateY(200px)';
        this.shopUI.style.padding = '20px';
        this.shopUI.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.shopUI.style.borderRadius = '10px';
        this.shopUI.style.display = 'none'; // Hide by default
        document.body.appendChild(this.shopUI);

        // Tank skin buttons
        this.tankButtons = [];
        const tankSkins = ['tank1.png', 'tank2.png', 'tank3.png']; // Add more skins as needed

        tankSkins.forEach((skin, index) => {
            const button = document.createElement('button');
            button.innerText = `Skin ${index + 1}`;
            button.style.display = 'block';
            button.style.margin = '5px';
            button.style.padding = '10px';
            button.style.fontSize = '16px';
            button.style.cursor = 'pointer';
            button.dataset.skin = skin;
            this.shopUI.appendChild(button);
            this.tankButtons.push(button);

            button.addEventListener('click', () => {
                this.changeTankSkin(skin);
            });
        });

        // Event listeners
        this.restartButton.addEventListener('click', () => {
            console.log("StartGame function:", this.startGame); // Check function reference
            this.startGame(); // Call the function reference
        });

        this.helpButton.addEventListener('click', () => {
            this.showHelp(); // Call the help function reference
        });

        this.shopButton.addEventListener('click', () => {
            this.openShop(); // Call the shop function reference
        });
    }

    changeTankSkin(skin) {
        // Notify the main script to change the tank image
        window.dispatchEvent(new CustomEvent('changeTankSkin', { detail: skin }));
    }

    draw() {
        if (!this.isVisible) return;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Title
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Tanks-A-Heat', this.width / 2, this.height / 2 - 80);

        // Draw "Game Over" text
        this.ctx.font = '36px Arial';
        this.ctx.fillText('Game Over', this.width / 2, this.height / 2);
    }

    show() {
        this.isVisible = true;
        this.restartButton.style.display = 'block'; // Show the button
        this.helpButton.style.display = 'block';    // Show the button
        this.shopButton.style.display = 'block';    // Show the button
        this.shopUI.style.display = 'none';          // Hide the shop UI by default
    }

    hide() {
        this.isVisible = false;
        this.restartButton.style.display = 'none'; // Hide the button
        this.helpButton.style.display = 'none';    // Hide the button
        this.shopButton.style.display = 'none';    // Hide the button
        this.shopUI.style.display = 'none';         // Hide the shop UI
    }
}
