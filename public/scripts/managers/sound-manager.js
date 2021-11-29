class SoundManager {
    constructor() {
        this.sounds = {};
        this.context = null;
        this.mainGainNode = null;
        this.worldGainNode = null;
        this.musicGainNode = null;
        this.loaded = false;
    }

    initialize() {
        this.context = new AudioContext();

        this.mainGainNode = this.context.createGain();
        this.musicGainNode = this.context.createGain();
        this.worldGainNode = this.context.createGain();

        this.mainGainNode.connect(this.context.destination);
        this.musicGainNode.connect(this.mainGainNode);
        this.worldGainNode.connect(this.mainGainNode);
    }

    loadSound(path, callback) {
        let sound = { path: path, buffer: null, loaded: false };

        sound.play = function (volume, loop) {
            soundManager.play(this.path, {looping: (loop)? loop : false, volume: (volume)? volume : 1});
        };

        this.sounds[path] = sound;

        let request = new XMLHttpRequest();
        request.open("GET", path, true);
        request.responseType = "arraybuffer";
        request.onload = function () {
            soundManager.context.decodeAudioData(request.response, (buffer) => {
               sound.buffer = buffer;
               sound.loaded = true;
               callback(sound);
            });
        };
        request.send();
    }

    loadSoundArray(paths) {
        for (let path of paths) {
            this.loadSound(path, () => {
                if (paths.length === Object.keys(this.sounds).length) {
                    for (let soundPath in this.sounds) {
                        if (!this.sounds[soundPath].loaded) {
                            return;
                        }
                    }
                    this.loaded = true;
                }
            });
        }
    }

    play(path, settings) {
        if (!soundManager.loaded) {
            setTimeout(() => { this.play(path, settings); }, 1000);
            return;
        }

        let loop = false;
        let volume = 1;
        let gainNodeType = GainNode.MAIN;

        if (settings) {
            if (settings.looping) {
                loop = settings.loop;
            }
            if (settings.volume) {
                volume = settings.volume;
            }
            if (settings.gainNodeType) {
                gainNodeType = settings.gainNodeType;
            }
        }

        let sound = this.sounds[path];
        if (!sound) {
            return false;
        }

        let gainNode;
        switch (gainNodeType) {
            case GainNode.MUSIC:
                gainNode = this.musicGainNode;
                break;
            case GainNode.WORLD:
                gainNode = this.worldGainNode;
                break;
            default:
                gainNode = this.mainGainNode;
        }

        let bufferSource = this.context.createBufferSource();
        bufferSource.connect(gainNode);
        bufferSource.buffer = sound.buffer;
        bufferSource.loop = loop;
        gainNode.gain.value = volume;
        bufferSource.start(0);

        return true;
    }

    playWorldSound(path, position) {
        if (!gameManager.player) {
            return;
        }

        let viewSize = 0.8 * Math.max(sceneManager.viewSize.x, sceneManager.viewSize.y);
        let distance = distanceBetweenPositions(gameManager.player.position, position);
        let norm = distance / viewSize;
        if (norm > 1) norm = 1;
        let volume = 1.0 - norm;

        if (volume > 0) {
            this.play(path, { loop: false, volume: volume, gainNodeType: GainNode.WORLD });
        }
    }

    toggleMute() {
        if (this.mainGainNode.gain.value > 0) {
            this.mainGainNode.gain.value = 0
        } else {
            this.mainGainNode.gain.value = 1;
        }
    }

    stopAll() {
        this.mainGainNode.disconnect();
        this.musicGainNode.disconnect();
        this.worldGainNode.disconnect();

        this.mainGainNode = this.context.createGain();
        this.musicGainNode = this.context.createGain();
        this.worldGainNode = this.context.createGain();

        this.mainGainNode.connect(this.context.destination);
        this.musicGainNode.connect(this.mainGainNode);
        this.worldGainNode.connect(this.mainGainNode);
    }
}