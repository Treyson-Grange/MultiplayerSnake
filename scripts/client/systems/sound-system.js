//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
MyGame.systems.SoundSystem = (function (systems) {
  "use strict";

  function loadSound(source) {
    let sound = new Audio();

    sound.addEventListener("play", function () { });
    sound.src = source;
    return sound;
  }

  function loadAudio() {
    MyGame.sounds = {};
    MyGame.sounds["gulp"] = loadSound("assets/audio/treyson-gulping.mp3");
    MyGame.sounds["end-game"] = loadSound("assets/audio/lily-shortened.m4a");
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
