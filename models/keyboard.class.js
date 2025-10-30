class Keyboard {
    
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    constructor() {
        this.setupKeyboardControls();
        this.setupTouchControls();
    }

    setupTouchControls() {
        document.getElementById('btn_left').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.LEFT = true;
        });
        document.getElementById('btn_left').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.LEFT = false;
        });

        document.getElementById('btn_right').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.RIGHT = true;
        });
        document.getElementById('btn_right').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.RIGHT = false;
        });

        document.getElementById('btn_jump').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.SPACE = true;
        });
        document.getElementById('btn_jump').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.SPACE = false;
        });

        document.getElementById('btn_throw').addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.D = true;
        });
        document.getElementById('btn_throw').addEventListener('touchend', (event) => {
            event.preventDefault();
            this.D = false;
        });
    }

    setupKeyboardControls() {
        window.addEventListener('keydown', (event) => {
            if (event.keyCode === 32) keyboard.SPACE = true;
            if (event.keyCode === 37) keyboard.LEFT = true;
            if (event.keyCode === 38) keyboard.UP = true;
            if (event.keyCode === 39) keyboard.RIGHT = true;
            if (event.keyCode === 40) keyboard.DOWN = true;
            if (event.keyCode === 68) keyboard.D = true;
        });

        window.addEventListener('keyup', (event) => {
            if (event.keyCode === 32) keyboard.SPACE = false;
            if (event.keyCode === 37) {
                keyboard.LEFT = false;
                character_walking.pause();
                character_walking.currentTime = 0;
            }
            if (event.keyCode === 39) {
                keyboard.RIGHT = false;
                character_walking.pause();
                character_walking.currentTime = 0;
            }
            if (event.keyCode === 38) keyboard.UP = false;
            if (event.keyCode === 40) keyboard.DOWN = false;
            if (event.keyCode === 68) keyboard.D = false;
        });
    }
}