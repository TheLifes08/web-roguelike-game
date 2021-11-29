class SoundManager {
    constructor() {
        this.sounds = {};
        this.context = null;
        this.gainNode = null;
        this.worldGainNode = null;
        this.loaded = false;
    }

    initialize() {
        this.context = new AudioContext();
        this.gainNode = (this.context.createGain)? this.context.createGain() : this.context.createGainNode();
        this.gainNode.connect(this.context.destination);
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

        if (settings) {
            if (settings.looping) {
                loop = settings.loop;
            }
            if (settings.volume) {
                volume = settings.volume;
            }
        }

        let sound = this.sounds[path];
        if (!sound) {
            return false;
        }

        let bufferSource = this.context.createBufferSource();
        bufferSource.connect(this.gainNode);
        bufferSource.buffer = sound.buffer;
        bufferSource.loop = loop;
        this.gainNode.gain.value = volume;
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
            this.play(path, { loop: false, volume: volume });
        }
    }

    toggleMute() {
        if (this.gainNode.gain.value > 0) {
            this.gainNode.gain.value = 0
        } else {
            this.gainNode.gain.value = 1;
        }
    }

    stopAll() {
        this.gainNode.disconnect();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
    }
}