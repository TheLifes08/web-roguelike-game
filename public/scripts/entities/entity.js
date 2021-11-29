class Entity {
    constructor(name, type = "entity") {
        this.name = name;
        this.type = type;
        this.durability = 100;
        this.position = new Position(0, 0);
        this.velocity = new Velocity(0, 0);
        this.size = new Size(0, 0);
        this.passable = true;
        this.unbreakable = false;
        this.animation = false;
        this.animationIdleFrame = 1;
        this.animationFrameTimeBound = 0.25;
        this.animationFrameTime = 0.0;
        this.animationFrame = this.animationIdleFrame;
        this.animationFrameCount = 1;
    }

    update(elapsedTime) {
        let action = physicManager.move(this, elapsedTime);

        if (this.animation) {
            this.animationFrameTime += elapsedTime;

            if (this.animationFrameTime > this.animationFrameTimeBound) {
                this.animationFrameTime = 0.0;
                this.animationFrame = this.animationFrame % this.animationFrameCount + 1;
            }
        } else {
            this.animationFrame = this.animationIdleFrame;
        }

        return action;
    }

    setMovement(direction, velocity) {
        switch (direction) {
            case Direction.LEFT:
                this.velocity.x = -velocity;
                this.velocity.y = 0;
                break;
            case Direction.RIGHT:
                this.velocity.x = velocity;
                this.velocity.y = 0;
                break;
            case Direction.UP:
                this.velocity.x = 0;
                this.velocity.y = -velocity;
                break;
            case Direction.DOWN:
                this.velocity.x = 0;
                this.velocity.y = velocity;
                break;
        }
    }

    destroy() {
        this.durability = 0;
    }

    touchEntity(object) {
        object.onTouch(this);
    }

    onTouch(object) {}

    onInteract(object) {}

    onAttack(damage) {
        if (!this.unbreakable) {
            this.durability -= damage;
        }
    }

    get destroyed() {
        return this.durability <= 0;
    }
}