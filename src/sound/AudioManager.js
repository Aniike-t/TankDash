export default class AudioManager {
    constructor() {
        this.audioFiles = {};
    }

    loadAudio(key, src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(src);
            audio.oncanplaythrough = () => {
                console.log(`${key} audio loaded`);
                this.audioFiles[key] = audio;
                resolve(audio);  // Resolve the promise when the audio is loaded
            };
            audio.onerror = (error) => {
                console.error(`Error loading audio: ${src}`, error);
                reject(error);  // Reject the promise if there's an error
            };
        });
    }

    playAudio(key) {
        const audio = this.audioFiles[key];
        if (audio) {
            audio.currentTime = 0; 
            audio.play();
        } else {
            console.warn(`Audio file for key '${key}' not loaded.`);
        }
    }

    pauseAudio(key) {
        const audio = this.audioFiles[key];
        if (audio) {
            audio.pause();
        } else {
            console.warn(`Audio file for key '${key}' not loaded.`);
        }
    }

    stopAudio(key) {
        const audio = this.audioFiles[key];
        if (audio) {
            audio.pause();
            audio.currentTime = 0; 
        } else {
            console.warn(`Audio file for key '${key}' not loaded.`);
        }
    }

    loopAudio(key, volume = 0.2) {
        const audio = this.audioFiles[key];
        if (audio) {
            audio.loop = true;
            audio.volume = volume;
            audio.currentTime = 0;
            audio.play();
        } else {
            console.warn(`Audio file for key '${key}' not loaded.`);
        }
    }
}
