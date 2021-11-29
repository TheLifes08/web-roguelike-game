class MapManager {
    constructor() {
        this.mapData = null;
        this.loadedTilesetsCount = 0;
    }

    loadMap(mapData) {
        this.loadedTilesetsCount = 0;

        for (let i = 0; i < mapData.tilesets.length; ++i) {
            let tileset = mapData.tilesets[i];
            let image = new Image();

            image.onload = () => {
                ++this.loadedTilesetsCount;
            };
            image.src = tileset.properties[0].value;

            tileset.image = image;
            tileset.size = new Size(tileset.columns, tileset.tilecount / tileset.columns);
        }

        this.mapData = mapData;
        this.parseObjects();
    }

    parseObjects() {
        if (!this.mapDataLoaded || !this.tileSetImagesLoaded) {
            setTimeout(() => {this.parseObjects();}, 100);
            return;
        }

        let entities = [];
        let collisionBoxes = [];

        for (let i = 0; i < this.layers.length; ++i) {
            let layer = this.layers[i];

            if (layer.type === "objectgroup") {
                let objects = layer.objects;

                for (let j = 0; j < objects.length; ++j) {
                    let object = objects[j];

                    try {
                        let entity = createEntity(object.type);
                        entity.name += "_" + object.name;
                        entity.position.x = object.x;
                        entity.position.y = object.y;
                        entity.size.x = object.width;
                        entity.size.y = object.height;

                        if (entity.type === "player") {
                            if (gameManager.player) {
                                gameManager.player.position.x = entity.position.x;
                                gameManager.player.position.y = entity.position.y;
                                entities.push(gameManager.player);
                            } else {
                                gameManager.initializePlayer(entity);
                                entities.push(entity);
                            }
                        } else if (entity.type === "static" || entity.type === "spikes" || entity.type === "dispenser") {
                            entity.position.y -= entity.size.y;
                            entity.gid = object.gid;
                            entities.push(entity);
                        } else if (entity.type === "collision_box") {
                            entity.passable = false;
                            collisionBoxes.push(entity);
                        } else {
                            entities.push(entity);
                        }
                    } catch (ex) {
                        console.log("Error while creating entity.", ex);
                    }
                }
            }
        }

        gameManager.entities = entities;
        physicManager.collisionBoxes = collisionBoxes;
    }

    getTileSetByTile(tileId) {
        if (this.mapDataLoaded) {
            for (let i = this.tileSets.length - 1; i >= 0; --i) {
                let tileSet = this.tileSets[i];
                if (tileId >= tileSet.firstgid) {
                    return tileSet;
                }
            }
        } else {
            return null;
        }
    }

    getTileSetTilePosition(tileId) {
        if (this.mapDataLoaded) {
            let tileSet = this.getTileSetByTile(tileId);
            let id = tileId - tileSet.firstgid;
            let x = id % tileSet.size.x;
            let y = Math.floor(id / tileSet.size.x);
            return new Position(x * tileSet.tilewidth, y * tileSet.tileheight);
        } else {
            return null;
        }
    }

    getTileByPosition(position, layerName) {
        let layer = this.getLayer(layerName, "tilelayer");

        if (layer) {
            let mapPosition = new Position();

            mapPosition.x = Math.floor(position.x / this.tileSize.x);
            mapPosition.y = Math.floor(position.y / this.tileSize.y);

            for (let chunk of layer.chunks) {
                let chunkPosition = new Position(layer.startx + chunk.x, layer.starty + chunk.y);
                let chunkSize = new Size(chunk.width, chunk.height);

                if (isInRect(mapPosition, new Rect(chunkPosition, chunkSize))) {
                    let tileX = mapPosition.x - chunkPosition.x;
                    let tileY = mapPosition.y - chunkPosition.y;
                    let index = tileY * chunkSize.x + tileX;
                    return chunk.data[index];
                }
            }
        }

        return null;
    }

    getLayer(name, type) {
        if (this.mapDataLoaded) {
            for (let layer of this.layers) {
                if (layer.type === type && layer.name === name) {
                    return layer;
                }
            }
        }
        return null;
    }

    get mapDataLoaded() {
        return !!(this.mapData);
    }

    get tileSetImagesLoaded() {
        if (this.mapData) {
            return this.loadedTilesetsCount === this.tileSets.length;
        } else {
            return false;
        }
    }

    get layers() {
        if (this.mapData) {
            return this.mapData.layers;
        } else {
            return null;
        }
    }

    get tileSets() {
        if (this.mapData) {
            return this.mapData.tilesets;
        } else {
            return null;
        }
    }

    get size() {
        if (this.mapData) {
            return new Size(this.mapSize.x * this.tileSize.x, this.mapSize.y * this.tileSize.y);
        } else {
            return new Size(0, 0);
        }
    }

    get tileSize() {
        if (this.mapData && this.mapData.tilewidth && this.mapData.tileheight) {
            return new Size(this.mapData.tilewidth, this.mapData.tileheight);
        } else {
            return new Size(0, 0);
        }
    }

    get mapSize() {
        if (this.mapData && this.mapData.width && this.mapData.height) {
            return new Size(this.mapData.width, this.mapData.height);
        } else {
            return new Size(0, 0);
        }
    }
}