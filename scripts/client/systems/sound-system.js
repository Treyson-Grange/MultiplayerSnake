//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
MyGame.systems.SoundSystem = (function (systems) {
  "use strict";

  function loadSound(source) {
    let sound = new Audio();
    // sound.addEventListener('canplay', function() {
    //     // console.log(`${source} is ready to play`);
    // });
    sound.addEventListener("play", function () {});
    // sound.addEventListener('pause', function() {
    //     // console.log(`${source} paused`);
    // });
    // sound.addEventListener('canplaythrough', function() {
    //     // console.log(`${source} can play through`);
    // });
    // sound.addEventListener('progress', function() {
    //     // console.log(`${source} progress in loading`);
    // });
    // sound.addEventListener('timeupdate', function() {
    //     // console.log(`${source} time update: ${this.currentTime}`);
    // });
    sound.src = source;
    return sound;
  }

  function loadAudio() {
    MyGame.sounds = {};
    MyGame.sounds["gulp"] = loadSound("assets/audio/treyson-gulping.mp3");
    MyGame.sounds["end-game"] = loadSound("assets/audio/Lily-end-game.m4a");
  }

  console.log("initializing...");

  loadAudio();

  //------------------------------------------------------------------
  //
  // Plays the specified audio
  //
  //------------------------------------------------------------------
  function playSound(whichSound) {
    console.log("playing: ", whichSound);
    MyGame.sounds[whichSound].play();
  }

  let api = {
    playSound: playSound,
  };

  return api;
})(MyGame.systems);
