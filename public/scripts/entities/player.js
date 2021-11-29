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
        if (object.type === "static" && object.name.includes("exit1")) {
            gameManager.changeLevel("/public/data/maps/level2.json");
        } else if (object.type === "static" && object.name.includes("exit2")) {
            gameManager.endGame();
        }

        super.touchEntity(object);
    }

    attack(attackType) {
        if (attackType === AttackType.MELEE && this.meleeAttackEnabled) {
            let num = Math.round(getRandomNumber(1, 3));
            soundManager.play(`/public/sounds/swing${num}.wav`, { volume: 0.8 });
        }
        super.attack(attackType);
    }

    onAttack(damage) {
        super.onAttack(damage);
    }
}