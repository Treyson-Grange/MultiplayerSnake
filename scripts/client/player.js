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
  function rotateLeft(elapsedTime) {
    direction -= rotateRate * elapsedTime;
  }

  that.goUp = function (elapsedTime) {
    preferedDirection = -Math.PI / 2;
  };
  that.goDown = function (elapsedTime) {
    preferedDirection = Math.PI / 2;
  };
  that.goRight = function (elapsedTime) {
    preferedDirection = 0;
    rotateRight(elapsedTime);
  };
  that.goLeft = function (elapsedTime) {
    preferedDirection = Math.PI;
    rotateLeft(elapsedTime);
    // that.rotateLeft();//I dont think we can call this it just snaps us to the top left.
  };
  let updateRotateRate = 5000000;
  function rotateToDirection(elapsedTime) {
    // Calculate the shortest distance to the desired direction
    let shortestDistance = preferedDirection - direction;
    if (shortestDistance < -Math.PI) {
      shortestDistance += 2 * Math.PI;
    } else if (shortestDistance > Math.PI) {
      shortestDistance -= 2 * Math.PI;
    }

    // Check if the absolute shortest distance is less than 0.2 radians
    if (Math.abs(shortestDistance) < 0.2) {
      direction = preferedDirection;
      return;
    }

    // Determine the rotation direction based on the shortest distance
    let rotateDirection = shortestDistance > 0 ? 1 : -1;

    // Adjust the rotation rate based on the shortest distance
    let adjustedRotateRate = rotateRate * rotateDirection;
    direction += (adjustedRotateRate * elapsedTime) / updateRotateRate;

    // Ensure the direction stays within the range of -π to π
    if (direction > Math.PI) {
      direction -= 2 * Math.PI;
    } else if (direction < -Math.PI) {
      direction += 2 * Math.PI;
    }
  }

  that.update = function (when) {
    if (direction !== preferedDirection) {
      rotateToDirection(when);
    }
    console.log(direction);
  };

  return that;
};
