class Dispenser extends Entity {
    constructor(name, type = "dispenser") {
        super(name, type);

        this.damage = 40;
        this.shotInterval = setInterval(() => { this.shot() }, getRandomNumber(4000, 8000));
    }

    shot() {
        let bullet = createEntity("bullet");

        bullet.position.x = this.position.x + (this.size.x - bullet.size.x) / 2;
        bullet.position.y = this.position.y + (this.size.y - bullet.size.y) / 2;
        bullet.damage = this.damage;
        bullet.setMovement(Direction.DOWN, bullet.speed);
        shiftPosition(bullet.position, Direction.DOWN, 16);

        gameManager.entities.push(bullet);
        soundManager.playWorldSound("/public/sounds/magic_shot.wav", this.position);
    }
}