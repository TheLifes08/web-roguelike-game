class Creature extends Entity {
    constructor(name, type = "creature") {
        super(name, type);

        this.passable = false;
        this.direction = Direction.DOWN;
        this.health = 200;
        this.damage = 0;
        this.speed = 150;
        this.meleeAttackTimeout = 1000.0;
        this.distanceAttackTimeout = 1000.0;
        this.meleeAttackEnabled = true;
        this.distanceAttackEnabled = true;
    }

    kill() {
        this.health = 0;
    }

    attack(attackType) {
        if (this.distanceAttackEnabled && attackType === AttackType.DISTANCE) {
            this.distanceAttackEnabled = false;
            setTimeout(() => { this.distanceAttackEnabled = true; }, this.distanceAttackTimeout);

            let bullet = createEntity("bullet");

            bullet.position.x = this.position.x + (this.size.x - bullet.size.x) / 2;
            bullet.position.y = this.position.y + (this.size.y - bullet.size.y) / 2;
            bullet.damage = this.damage;
            bullet.setMovement(this.direction, bullet.speed);

            let distance = (isHorizontalDirection(this.direction))? this.size.x : this.size.y;
            shiftPosition(bullet.position, this.direction, distance);

            gameManager.entities.push(bullet);
            soundManager.playWorldSound("/public/sounds/magic_shot.wav", this.position);
        } else if (this.meleeAttackEnabled && attackType === AttackType.MELEE) {
            this.meleeAttackEnabled = false;
            setTimeout(() => { this.meleeAttackEnabled = true; }, this.meleeAttackTimeout);

            let attackRect = new Rect(new Position(this.position.x + 8, this.position.y + 8), new Size(this.size.x - 16, this.size.y - 16));
            let distance = (isHorizontalDirection(this.direction))? this.size.x : this.size.y;
            shiftPosition(attackRect.position, this.direction, distance);
            let objects = getEntitiesInRect(attackRect);

            if (objects[0]) {
                objects[0].onAttack(this.damage);
            }
        }
    }

    interact() {
        let object = physicManager.getCollidedWithEntity(this, this.position);

        if (object) {
            object.onInteract(this);
        }
    }

    onAttack(damage) {
        if (this.died) {
            super.onAttack(damage);
        } else {
            this.health -= damage;
        }
    }

    setMovement(direction, velocity) {
        this.direction = direction;
        super.setMovement(direction, velocity);
    }

    stopMovement() {
        super.setMovement(this.direction, 0);
    }

    get died() {
        return this.health <= 0;
    }
}