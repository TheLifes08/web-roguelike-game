class HealthPotion extends Entity {
    constructor(name, type = "health_potion") {
        super(name, type);

        this.points = 50;
        this.unbreakable = true;
    }

    onInteract(object) {
        super.onInteract();

        if (object.health) {
            object.health += this.points;
            this.points = 0;
            this.destroy();
        }
    }
}