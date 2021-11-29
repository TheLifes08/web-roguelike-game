class Skeleton extends Creature {
    constructor(name, type = "skeleton") {
        super(name, type);

        this.health = 50;
        this.damage = 5;
        this.speed = 100;
        this.animationIdleFrame = 2;
        this.animationFrameCount = 3;
        this.animationFrameTimeBound = 0.15;
        this.animationFrame = this.animationIdleFrame;
        this.movementTarget = null;
    }

    update(elapsedTime) {
        super.update(elapsedTime);

        this.animation = !(this.velocity.x === 0 && this.velocity.y === 0);

        if (!this.died) {
            if (distanceBetweenPositions(this.position, gameManager.player.position) < 200) {
                this.movementTarget = gameManager.player.position;
            } else {
                this.movementTarget = null;
                this.stopMovement();
            }

            if (this.movementTarget) {
                this.moveToPosition(this.movementTarget);

                let attackRect = new Rect(new Position(this.position.x + 4, this.position.y + 4), new Size(this.size.x - 8, this.size.y - 8));
                let distance = (isHorizontalDirection(this.direction))? this.size.x : this.size.y;
                shiftPosition(attackRect.position, this.direction, distance);
                let objects = getEntitiesInRect(attackRect, "player");

                if (objects[0]) {
                    this.attack(AttackType.MELEE);
                }
            }
        } else {
            this.destroy();
        }
    }

    moveToPosition(position) {
        this.stopMovement();

        if (getRandomNumber(0, 1) > 0.5) {
            if (Math.abs(position.x - this.position.x) > 40) {
                this.setMovement((position.x > this.position.x)? Direction.RIGHT : Direction.LEFT, this.speed);
                return;
            }
            if (Math.abs(position.y - this.position.y) > 40) {
                this.setMovement((position.y > this.position.y)? Direction.DOWN : Direction.UP, this.speed);
            }
        } else {
            if (Math.abs(position.y - this.position.y) > 40) {
                this.setMovement((position.y > this.position.y)? Direction.DOWN : Direction.UP, this.speed);
                return;
            }
            if (Math.abs(position.x - this.position.x) > 40) {
                this.setMovement((position.x > this.position.x)? Direction.RIGHT : Direction.LEFT, this.speed);
            }
        }
    }
}