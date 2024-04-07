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
  let rotateRate = 0;
  let speed = 0;
  let preferedDirection = 0;
  let threshold = 1;
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

  //------------------------------------------------------------------
  //
  // Public function that rotates the player left.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function (elapsedTime) {
    direction -= rotateRate * elapsedTime;
  };
  that.goUp = function (elapsedTime) {
    preferedDirection = -Math.PI / 2;
    console.log("go up");
  };
  that.goDown = function (elapsedTime) {
    preferedDirection = Math.PI / 2;
  };
  that.goRight = function (elapsedTime) {
    preferedDirection = 0;
  };
  that.goLeft = function (elapsedTime) {
    preferedDirection = Math.PI;
  };

  function rotateToDirection(elapsedTime) {
    console.log(rotateRate * elapsedTime);
    console.log(direction - preferedDirection, preferedDirection);
    if (Math.abs(direction - preferedDirection) < 5) {
      direction = preferedDirection;
      return;
    }
    if (direction < preferedDirection) {
      direction += rotateRate * elapsedTime;
    } else if (direction > preferedDirection) {
      direction -= rotateRate * elapsedTime;
    }
  }

  that.update = function (when) {
    if (preferedDirection !== direction) {
      rotateToDirection(when);
    }
  };

  return that;
};
