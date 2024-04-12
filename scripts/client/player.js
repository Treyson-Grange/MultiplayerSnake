//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------
MyGame.components.Player = function () {
  "use strict";
  let that = {};
  let position = {
    x: 0,
    y: 0,
  };
  let size = {
    width: 0.05,
    height: 0.05,
  };
  let direction = 0;
  let rotateRate = Math.PI / 1000;
  let speed = 0.0002;
  let preferedDirection = 0;
  let threshold = 2;
  Object.defineProperty(that, "direction", {
    get: () => direction,
    set: (value) => {
      direction = value;
    },
  });

  Object.defineProperty(that, "speed", {
    get: () => speed,
    set: (value) => {
      speed = value;
    },
  });

  Object.defineProperty(that, "rotateRate", {
    get: () => rotateRate,
    set: (value) => {
      rotateRate = value;
    },
  });

  Object.defineProperty(that, "position", {
    get: () => position,
  });

  Object.defineProperty(that, "size", {
    get: () => size,
  });

  //------------------------------------------------------------------
  //
  // Public function that moves the player in the current direction.
  //
  //------------------------------------------------------------------
  that.move = function (elapsedTime) {
    let vectorX = Math.cos(direction);
    let vectorY = Math.sin(direction);

    position.x += vectorX * elapsedTime * speed;
    position.y += vectorY * elapsedTime * speed;
  };

  //------------------------------------------------------------------
  //
  // Public function that rotates the player right.
  //
  //------------------------------------------------------------------
  that.rotateRight = function (elapsedTime) {
    direction += rotateRate * elapsedTime;
  };
  function rotateRight(elapsedTime) {
    direction += rotateRate * elapsedTime;
  }
  //------------------------------------------------------------------
  //
  // Public function that rotates the player left.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function (elapsedTime) {
    direction -= rotateRate * elapsedTime;
  };

  //------------------------------------------------------------------
  //
  // Functions that given input, change the prefered direction
  // of the player
  //
  //------------------------------------------------------------------
  that.goUp = function (elapsedTime) {
    if (direction == Math.PI / 2) {
      return;
    }
    direction = -Math.PI / 2;
  };
  that.goDown = function (elapsedTime) {
    if (direction == -Math.PI / 2) {
      return;
    }
    direction = Math.PI / 2;
  };
  that.goRight = function (elapsedTime) {
    if (direction == Math.PI) {
      return;
    }
    direction = 0;
  };
  that.goLeft = function (elapsedTime) {
    if (direction == 0) {
      return;
    }
    direction = Math.PI;
  };
  let updateRotateRate = 5000000;

  that.update = function (when) {};

  return that;
};
