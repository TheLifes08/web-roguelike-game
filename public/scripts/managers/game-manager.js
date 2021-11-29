class GameManager {
    constructor() {
        this.entities = null;
        this.player = null;
        this.score = 0;
    }

    initializePlayer(player) {
        this.player = player;
    }

    endGame() {
        soundManager.stopAll();
        clearInterval(gameInterval);

        let username = window.localStorage["game.username"];
        let records = (window.localStorage["game.records"])? JSON.parse(window.localStorage["game.records"]) : {};

        if (!records[username] || records[username] < this.score) {
            records[username] = this.score;
        }

        window.localStorage["game.records"] = JSON.stringify(records);
        document.location.href = "/records";
    }

    checkEvents() {
        if (!this.player || this.player.died) {
            return;
        }

        this.player.velocity.x = 0;
        this.player.velocity.y = 0;

        if (eventManager.actions["up"]) {
            this.player.setMovement(Direction.UP, this.player.speed);
        }
        if (eventManager.actions["down"]) {
            this.player.setMovement(Direction.DOWN, this.player.speed);
        }
        if (eventManager.actions["left"]) {
            this.player.setMovement(Direction.LEFT, this.player.speed);
        }
        if (eventManager.actions["right"]) {
            this.player.setMovement(Direction.RIGHT, this.player.speed);
        }
        if (eventManager.actions["interact"]) {
            this.player.interact();
        }
        if (eventManager.actions["melee-attack"]) {
            this.player.attack(AttackType.MELEE);
        }
        if (eventManager.actions["distance-attack"]) {
            this.player.attack(AttackType.DISTANCE);
        }
    }

    update(elapsedTime) {
        if (this.player.died) {
            this.endGame();
            return;
        }

        for (let entity of this.entities) {
            try {
                if (entity.destroyed) {
                    let index = this.entities.indexOf(entity);
                    if (index >= 0) {
                        this.entities.splice(index, 1);
                    }
                } else {
                    entity.update(elapsedTime);
                }
            } catch (ex) {
                console.log("Error in update entity method.");
            }
        }
    }

    draw() {
        sceneManager.clearScene();
        sceneManager.centerAt(this.player);
        sceneManager.drawLayer("floor");
        sceneManager.drawLayer("floor_sprites");
        sceneManager.drawLayer("walls_lower");
        sceneManager.drawLayer("walls_sprites");
        sceneManager.drawEntities(this.entities);
        sceneManager.drawEntity(this.player);
        sceneManager.drawLayer("walls_higher");
    }

    drawUI() {
        sceneInfoManager.clearScene();
        sceneInfoManager.drawSprite("items", "heard", new Position(16, 16));
        sceneInfoManager.drawText(gameManager.player.health, 72, 32);
        sceneInfoManager.drawSprite("items", "sword", new Position(16, 48));
        sceneInfoManager.drawText(gameManager.player.damage, 72, 64);
    }

    tick(elapsedTime) {
        this.checkEvents();
        this.update(elapsedTime);
        this.draw();
        this.drawUI();
    }

    changeLevel(path) {
        soundManager.stopAll();
        sceneInfoManager.clearScene();
        sceneManager.clearScene();
        sceneManager.drawLoadingScene();
        gameLoaded = false;

        loadJson(path, (map) => {
            mapManager.loadMap(map);
            waitForLoad();
        });
    }
}
