// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a player.
//
// ------------------------------------------------------------------
"use strict";

let random = require("./random");

//------------------------------------------------------------------
//
// Public function used to initially create a newly connected player
// at some random location.
//
//------------------------------------------------------------------
function createPlayer() {
  let that = {};

  let position = {
    x: random.nextDouble(),
    y: random.nextDouble(),
  };

  let size = {
    width: 0.05,
    height: 0.05,
  };
  let direction = random.nextDouble() * 2 * Math.PI; // Angle in radians
  let rotateRate = Math.PI / 1000; // radians per millisecond
  let speed = 0.0002; // unit distance per millisecond
  let reportUpdate = false; // Indicates if this model was updated during the last update
  let preferedDirection = 0;
  let threshold = 2;

  Object.defineProperty(that, "direction", {
    get: () => direction,
  });

  Object.defineProperty(that, "position", {
    get: () => position,
  });

  Object.defineProperty(that, "size", {
    get: () => size,
  });

  Object.defineProperty(that, "speed", {
    get: () => speed,
  });

  Object.defineProperty(that, "rotateRate", {
    get: () => rotateRate,
  });

  Object.defineProperty(that, "reportUpdate", {
    get: () => reportUpdate,
    set: (value) => (reportUpdate = value),
  });

  //------------------------------------------------------------------
  //
  // Moves the player forward based on how long it has been since the
  // last move took place.
  //
  //------------------------------------------------------------------
  that.move = function (elapsedTime) {
    reportUpdate = true;
    let vectorX = Math.cos(direction);
    let vectorY = Math.sin(direction);

    position.x += vectorX * elapsedTime * speed;
    position.y += vectorY * elapsedTime * speed;
  };

  //------------------------------------------------------------------
  //
  // Rotates the player right based on how long it has been since the
  // last rotate took place.
  //
  //------------------------------------------------------------------
  that.rotateRight = function (elapsedTime) {
    reportUpdate = true;
    direction += rotateRate * elapsedTime;
  };
  function rotateRight(elapsedTime) {
    reportUpdate = true;
    direction += rotateRate * elapsedTime;
  }

  //------------------------------------------------------------------
  //
  // Rotates the player left based on how long it has been since the
  // last rotate took place.
  //
  //------------------------------------------------------------------
  that.rotateLeft = function (elapsedTime) {
    reportUpdate = true;
    direction -= rotateRate * elapsedTime;
  };

  //------------------------------------------------------------------
  //
  // Functions that given input, change the prefered direction
  // of the player
  //
  //------------------------------------------------------------------
  that.goUp = function (elapsedTime) {
    reportUpdate = true;
    preferedDirection = -Math.PI / 2;
  };
  that.goDown = function (elapsedTime) {
    reportUpdate = true;
    preferedDirection = Math.PI / 2;
  };
  that.goRight = function (elapsedTime) {
    reportUpdate = true;
    preferedDirection = 0;
  };
  that.goLeft = function (elapsedTime) {
    reportUpdate = true;
    preferedDirection = Math.PI;
  };

  //------------------------------------------------------------------
  //
  // Function that rotates the player to the prefered direction over time
  //
  //
  //------------------------------------------------------------------
  function rotateToDirection(elapsedTime) {
    let shortestDistance = preferedDirection - direction;
    if (shortestDistance < -Math.PI) {
      shortestDistance += 2 * Math.PI;
    } else if (shortestDistance > Math.PI) {
      shortestDistance -= 2 * Math.PI;
    }
    if (Math.abs(shortestDistance) < 0.2) {
      direction = preferedDirection;
      return;
    }
    let rotateDirection = shortestDistance > 0 ? 1 : -1;
    let adjustedRotateRate = rotateRate * rotateDirection;
    direction += (adjustedRotateRate * elapsedTime) / updateRotateRate;
    if (direction > Math.PI) {
      direction -= 2 * Math.PI;
    } else if (direction < -Math.PI) {
      direction += 2 * Math.PI;
    }
  }

  //------------------------------------------------------------------
  //
  // Function used to update the player during the game loop.
  //
  //------------------------------------------------------------------
  let updateRotateRate = 5000000;
  that.update = function (when) {
    if (direction !== preferedDirection) {
      rotateToDirection(when);
    }
  };

  return that;
}

module.exports.create = () => createPlayer();
