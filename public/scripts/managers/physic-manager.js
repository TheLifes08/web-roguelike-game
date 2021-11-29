class PhysicManager {
    constructor() {
        this.collisionBoxes = [];
    }

    move(object, elapsedTime) {
        if (object.velocity.x === 0 && object.velocity.y === 0) {
            return Movement.STOP;
        }

        let newX = object.position.x + object.velocity.x * elapsedTime;
        let newY = object.position.y + object.velocity.y * elapsedTime;
        let collisionBox = this.getCollidedWithCollisionBox(new Rect(new Position(newX, newY), object.size));
        let entity = this.getCollidedWithEntity(object, new Position(newX, newY));

        if (entity) object.touchEntity(entity);
        if (collisionBox) object.touchEntity(collisionBox);

        if ((!entity || entity.passable) && (!collisionBox || collisionBox.passable)) {
            object.position.x = newX;
            object.position.y = newY;
            return Movement.MOVE;
        } else {
            return Movement.BREAK;
        }
    }

    getCollidedWithEntity(object, newPosition) {
        if (gameManager.entities) {
            for (let entity of gameManager.entities) {
                if (entity.name !== object.name) {
                    if (isRectsCollided(new Rect(newPosition, object.size), new Rect(entity.position, entity.size))) {
                        return entity;
                    }
                }
            }
        }
        return null;
    }

    getCollidedWithCollisionBox(rect) {
        for (let collisionBox of this.collisionBoxes) {
            if (isRectsCollided(rect, new Rect(collisionBox.position, collisionBox.size))) {
                return collisionBox;
            }
        }
        return null;
    }
}