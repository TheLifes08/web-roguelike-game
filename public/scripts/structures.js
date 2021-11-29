class Size {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const Position = Size;
const Velocity = Size;

class Rect {
    constructor(position, size) {
        this.position = position;
        this.size = size;
    }

    get x() {
        return this.position.x;
    }

    get y() {
        return this.position.y;
    }

    get width() {
        return this.size.x;
    }

    get height() {
        return this.size.y;
    }

    get center() {
        return new Position(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2)
    }
}

const Direction = { UP: "up", DOWN: "down", LEFT: "left", RIGHT: "right" };
const Movement = { STOP: "stop", BREAK: "break", MOVE: "move" };
const AttackType = { MELEE: "melee", DISTANCE: "distance" };
const GainNode = { MAIN: "main", MUSIC: "music", WORLD: "world" };
