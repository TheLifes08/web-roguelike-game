class SpriteManager {
    constructor() {
        this.sprites = [];
        this.loadedImagesCount = 0;
    }

    loadSprites(spritesData) {
        for (let sprite of spritesData) {
            let image = new Image();

            image.onload = () => {
                ++this.loadedImagesCount;
            }
            image.src = sprite.path;

            sprite.image = image;
            this.sprites.push(sprite);
        }
    }

    get spritesLoaded() {
        return this.loadedImagesCount === this.sprites.length;
    }

    getSprite(name) {
        for (let sprite of this.sprites) {
            if (sprite.name === name) {
                return sprite;
            }
        }
        return null;
    }
}