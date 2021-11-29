class SceneManager {
    constructor(canvas, position = new Position(0, 0)) {
        this.canvas = canvas;
        this.viewPosition = position;
    }

    isVisible(position, size) {
        return !(position.x + size.x < this.viewPosition.x || position.y + size.y < this.viewPosition.y ||
            position.x > this.viewPosition.x + this.viewSize.x || position.y > this.viewPosition.y + this.viewSize.y);
    }

    clearScene() {
        if (this.canvas) {
            this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    drawLoadingScene() {
        this.drawText("Загрузка...", this.viewSize.x / 2, this.viewSize.y / 2);
    }

    drawText(text, x, y, color = "white") {
        if (this.loaded) {
            let context = this.canvas.getContext("2d");
            context.fillStyle = color;
            context.font = "20px serif";
            context.textBaseline = "middle";
            context.textAlign = "center";
            context.fillText(text, x, y);
        }
    }

    drawTile(gid, tilePosition) {
        if (this.loaded) {
            let context = this.canvas.getContext("2d");
            let tileSet = mapManager.getTileSetByTile(gid);
            let position = mapManager.getTileSetTilePosition(gid);

            if (!this.isVisible(new Position(tilePosition.x, tilePosition.y), mapManager.tileSize)) {
                return;
            }

            let x = tilePosition.x - this.viewPosition.x;
            let y = tilePosition.y - this.viewPosition.y;

            context.drawImage(tileSet.image, position.x, position.y,
                mapManager.tileSize.x, mapManager.tileSize.y,
                x, y,
                mapManager.tileSize.x, mapManager.tileSize.y);
        }
    }

    drawLayer(name) {
        let layer = mapManager.getLayer(name, "tilelayer");

        if (layer) {
            for (let chunk of layer.chunks) {
                this.drawChunk(chunk);
            }
        }
    }

    drawChunk(chunk) {
        for (let k = 0; k < chunk.data.length; ++k) {
            if (chunk.data[k] > 0) {
                let x = (chunk.x + k % chunk.width) * mapManager.tileSize.x;
                let y = (chunk.y + Math.floor(k / chunk.height)) * mapManager.tileSize.y;

                this.drawTile(chunk.data[k], new Position(x, y));
            }
        }
    }

    drawSprite(name, frame, position) {
        if (!this.loaded || !spriteManager) {
            return;
        }

        let context = this.canvas.getContext("2d");
        let sprite = spriteManager.getSprite(name);

        if (sprite && sprite.frames[frame]) {
            let spriteFrame = sprite.frames[frame];
            let spriteSize = new Size(spriteFrame.width, spriteFrame.height);

            if (this.isVisible(position, spriteSize)) {
                let x = Math.round(position.x) - this.viewPosition.x;
                let y = Math.round(position.y) - this.viewPosition.y;

                context.drawImage(sprite.image, spriteFrame.x, spriteFrame.y, spriteFrame.width, spriteFrame.height,
                    x, y, spriteFrame.width, spriteFrame.height);
            }
        }
    }

    drawEntity(object, spriteName = object.type, spriteFrame = object.direction + "_" + object.animationFrame) {
        if (!object) {
            return;
        }

        this.drawSprite(spriteName, spriteFrame, object.position);
    }

    drawTileEntity(object) {
        if (!object) {
            return;
        }

        this.drawTile(object.gid, object.position);
    }

    drawEntities(entities) {
        for (let entity of entities) {
            switch (entity.type) {
                case "static":
                case "spikes":
                    this.drawTileEntity(entity);
                    break;
                case "bullet":
                    this.drawEntity(entity, "bullets", "bullet1_" + entity.animationFrame);
                    break;
                case "health_potion":
                    this.drawEntity(entity, "items", "health_potion");
                    break;
                case "strength_potion":
                    this.drawEntity(entity, "items", "strength_potion");
                    break;
                case "collision_box":
                    break;
                default:
                    this.drawEntity(entity);
                    break;
            }
        }
    }

    centerAt(object) {
        if (!object) {
            return;
        }

        let position = new Position(object.position.x + object.size.x / 2, object.position.y + object.size.y);

        if (position.x < this.viewSize.x / 2) {
            this.viewPosition.x = 0;
        } else if (position.x > mapManager.size.x - this.viewSize.x / 2)  {
            this.viewPosition.x = mapManager.size.x - this.viewSize.x;
        } else {
            this.viewPosition.x = Math.round(position.x) - this.viewSize.x / 2;
        }

        if (position.y < this.viewSize.y / 2) {
            this.viewPosition.y = 0;
        } else if (position.y > mapManager.size.y - this.viewSize.y / 2)  {
            this.viewPosition.y = mapManager.size.y - this.viewSize.y;
        } else {
            this.viewPosition.y = Math.round(position.y) - this.viewSize.y / 2;
        }
    }

    get loaded() {
        return this.canvas && this.canvas.getContext("2d") && this.viewPosition;
    }

    get viewSize() {
        return new Size(this.canvas.width, this.canvas.height);
    }
}