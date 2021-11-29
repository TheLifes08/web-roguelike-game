let entityId = 0;

function createEntity(type) {
    if (type === "player") {
        return new Player(entityId++, type);
    } else if (type === "spikes") {
        return new Spikes(entityId++, type);
    } else if (type === "bullet") {
        return new Bullet(entityId++, type);
    } else if (type === "health_potion") {
        return new HealthPotion(entityId++, type);
    } else if (type === "strength_potion") {
        return new StrengthPotion(entityId++, type);
    } else if (type === "skeleton") {
        return new Skeleton(entityId++, type);
    } else if (type === "dispenser") {
        return new Dispenser(entityId++, type);
    }

    return new Entity(entityId++, type);
}