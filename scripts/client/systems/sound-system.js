//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
MyGame.systems.SoundSystem = (function(spec) {
    'use strict';

    function loadSound(source, label, idButton) {
        let sound = new Audio();
        sound.addEventListener('canplay', function() {
            // console.log(`${source} is ready to play`);
        });
        sound.addEventListener('play', function() {
            // let elementButton = document.getElementById(idButton);
            // elementButton.innerHTML = label + ' - Pause!'
            // console.log(`${source} started playing`);
        });
        sound.addEventListener('pause', function() {
            // console.log(`${source} paused`);
        });
        sound.addEventListener('canplaythrough', function() {
            // console.log(`${source} can play through`);
        });
        sound.addEventListener('progress', function() {
            // console.log(`${source} progress in loading`);
        });
        sound.addEventListener('timeupdate', function() {
            // console.log(`${source} time update: ${this.currentTime}`);
        });
        sound.src = source;
        return sound;
    }

    function loadAudio() {
        MyGame.sounds = {}
        // Reference: https://freesound.org/data/previews/156/156031_2703579-lq.mp3
        MyGame.sounds['audio/sound-1'] = loadSound('audio/sound-1.mp3', 'Sound 1', 'id-play1');
        // Reference: https://freesound.org//data/previews/109/109662_945474-lq.mp3
        MyGame.sounds['audio/sound-2'] = loadSound('audio/sound-2.mp3', 'Sound 2', 'id-play2');
        MyGame.sounds['audio/sound-3'] = loadSound('audio/sound-3.wav', 'Sound 3', 'id-play3');
        // Reference: https://www.bensound.com/royalty-free-music/track/extreme-action
        // MyGame.sounds['audio/bensound-extremeaction'] = loadSound('audio/bensound-extremeaction.mp3', 'Music', 'id-play3');
    }

    console.log('initializing...');

    loadAudio();

    //------------------------------------------------------------------
    //
    // Pauses the specified audio
    //
    //------------------------------------------------------------------
    function pauseSound(whichSound, label, idButton, idStatus) {
        MyGame.sounds[whichSound].pause();

        let elementStatus = document.getElementById(idStatus);
        elementStatus.innerHTML = 'paused';

        let elementButton = document.getElementById(idButton);
        elementButton.innerHTML = `${label} - Continue!`;
        elementButton.onclick = function() { playSound(whichSound, label, idButton, idStatus); };
    }

    //------------------------------------------------------------------
    //
    // Plays the specified audio
    //
    //------------------------------------------------------------------
    function playSound(whichSound) {
        MyGame.sounds[whichSound].play();
    }

    spec = {
        playSound: playSound
    }

    return spec;
});
