class Spikes extends Entity {
    constructor(name, type = "spikes") {
        super(name, type);

        this.damage = 1;
        this.unbreakable = true;
    }

    onTouch(object) {
        super.onTouch(object);
        object.onAttack(this.damage);
    }
}