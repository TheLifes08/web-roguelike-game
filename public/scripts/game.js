let eventManager = null;
let gameManager = null;
let sceneManager = null;
let sceneInfoManager = null;
let mapManager = null;
let spriteManager = null;
let physicManager = null;
let soundManager = null;
let gameInterval = null;
let gameLoaded = false;

function start() {
    let canvasGame = document.getElementById("canvas-game");
    let canvasInfo = document.getElementById("canvas-info");

    if (canvasGame && canvasInfo) {
        eventManager = new EventManager();
        eventManager.initialize(canvasGame);
        soundManager = new SoundManager();
        soundManager.initialize();
        gameManager = new GameManager();
        physicManager = new PhysicManager();
        mapManager = new MapManager();
        spriteManager = new SpriteManager();
        sceneManager = new SceneManager(canvasGame, new Position(0, 0));
        sceneManager.drawLoadingScene();
        sceneInfoManager = new SceneManager(canvasInfo, new Position(0, 0));

        let audios = ["/public/sounds/background.mp3",
            "/public/sounds/magic_shot.wav",
            "/public/sounds/magic_shot_collapse.wav",
            "/public/sounds/swing1.wav",
            "/public/sounds/swing2.wav",
            "/public/sounds/swing3.wav",
            "/public/sounds/skeleton/shade1.wav",
            "/public/sounds/skeleton/shade2.wav",
            "/public/sounds/skeleton/shade3.wav",
            "/public/sounds/skeleton/shade4.wav",
            "/public/sounds/skeleton/shade5.wav"];

        soundManager.loadSoundArray(audios);

        loadJson("/public/data/sprites/sprites.json", (sprites) => {
            spriteManager.loadSprites(sprites);
        });

        loadJson("/public/data/maps/level1.json", (map) => {
            mapManager.loadMap(map);
        });

        waitForLoad();
        exec();
    }
}

function waitForLoad() {
    if (!spriteManager.spritesLoaded || !mapManager.tileSetImagesLoaded || !gameManager.entities || !soundManager.loaded) {
        setTimeout(() => { waitForLoad(); }, 100);
        return;
    }
    soundManager.play("/public/sounds/background.mp3", { looping: true, volume: 1 });
    gameLoaded = true;
}

function exec() {
    gameInterval = setInterval(() => {
        if (gameLoaded) {
            gameManager.tick(0.01);
        }
    }, 10);
}