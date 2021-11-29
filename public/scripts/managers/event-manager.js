class EventManager {
    constructor() {
        this.binds = [];
        this.actions = [];
    }

    initialize(canvas) {
        this.binds[87] = "up";
        this.binds[65] = "left";
        this.binds[83] = "down";
        this.binds[68] = "right";
        this.binds[69] = "interact";
        this.binds[70] = "melee-attack";
        this.binds[71] = "distance-attack";

        document.body.addEventListener("keyup", (event) => {this.onKeyUp(event);});
        document.body.addEventListener("keydown", (event) => {this.onKeyDown(event);});
    }

    onKeyUp(event) {
        let action = this.binds[event.keyCode];

        if (action) {
            this.actions[action] = false;
        }
    }

    onKeyDown(event) {
        let action = this.binds[event.keyCode];

        if (action) {
            this.actions[action] = true;
        }
    }
}