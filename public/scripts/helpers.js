function loadJson(url, callback) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            callback(JSON.parse(request.responseText));
        }
    }
    request.open("GET", url, true);
    request.send();
}

function isInRect(position, rect) {
    return position.x >= rect.x &&
           position.y >= rect.y &&
           position.x < rect.x + rect.width &&
           position.y < rect.y + rect.height;
}

function isRectsCollided(rect1, rect2) {
    return !(rect1.position.x + rect1.size.x < rect2.position.x ||
           rect1.position.y + rect1.size.y < rect2.position.y ||
           rect1.position.x > rect2.position.x + rect2.size.x ||
           rect1.position.y > rect2.position.y + rect2.size.y);
}

function getRandomNumber(min, max) {
    return min + Math.random() * (max - min);
}

function generateRandomMovementTarget(position, distance) {
    return new Position(position.x + getRandomNumber(-distance, distance),
                        position.y + getRandomNumber(-distance, distance));
}

function distanceBetweenPositions(position1, position2) {
    return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
}

function getEntitiesInRect(rect, type = null) {
    let entities = [];

    for (let entity of gameManager.entities) {
        if ((!type || entity.type === type) && isRectsCollided(rect, new Rect(entity.position, entity.size))) {
            entities.push(entity);
        }
    }

    return entities;
}

function isHorizontalDirection(direction) {
    return direction === Direction.LEFT || direction === Direction.RIGHT;
}

function shiftPosition(position, direction, distance) {
    switch (direction) {
        case Direction.LEFT:
            position.x -= distance;
            break;
        case Direction.RIGHT:
            position.x += distance;
            break;
        case Direction.UP:
            position.y -= distance;
            break;
        case Direction.DOWN:
            position.y += distance;
            break;
    }
    return position
}