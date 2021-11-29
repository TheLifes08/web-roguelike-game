class Bullet extends Entity {
    constructor(name, type = "bullet") {
        super(name, type);

        this.size = new Size(16, 16);
        this.speed = 300;
        this.damage = 10;
        this.animationFrameTimeBound = 0.1;
        this.animationFrameCount = 4;
        this.animation = true;
        this.passable = false;
    }

    touchEntity(object) {
        super.touchEntity(object);

        if (!object.passable) {
            object.onAttack(this.damage);
            this.destroy();
        }
    }
}