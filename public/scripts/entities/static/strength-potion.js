class StrengthPotion extends Entity {
    constructor(name, type = "strength-potion") {
        super(name, type);

        this.points = 5;
        this.unbreakable = true;
    }

    onInteract(object) {
        super.onInteract();

        if (object.damage) {
            object.damage += this.points;
            this.points = 0;
            this.destroy();
        }
    }
}