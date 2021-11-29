class Player extends Creature {
    constructor(name, type = "player") {
        super(name, type);

        this.damage = 10;
        this.animationIdleFrame = 2;
        this.animationFrameCount = 3;
        this.animationFrameTimeBound = 0.15;
        this.animationFrame = this.animationIdleFrame;
    }

    update(elapsedTime) {
        super.update(elapsedTime);

        this.animation = !(this.velocity.x === 0 && this.velocity.y === 0);
    }

    touchEntity(object) {
        if (object.type === "static" && object.name === "exit") {
            console.log("EXIT!")
        }

        super.touchEntity(object);
    }

    onAttack(damage) {
        super.onAttack(damage);
        console.log("OUCH:", damage);
    }
}