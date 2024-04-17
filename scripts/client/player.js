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
  let segments = [];
  let turnPoints = [{ x: position.x, y: position.y }];

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
  Object.defineProperty(that, "segments", {
    get: () => segments,
  });
  Object.defineProperty(that, "turnPoints", {
    get: () => turnPoints,
  });
  //------------------------------------------------------------------
  //
  // Public function that adds body parts
  //
  //------------------------------------------------------------------
  that.addBodyPart = function (elapsedTime) {
    let newSnakePart = MyGame.components.Body();
    segments.push({ model: newSnakePart, texture: MyGame.assets["greenBody"] });
    console.log(turnPoints);
  };

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
    for (let i = 1; i < segments.length; i++) {
      segments[i].model.follow(
        elapsedTime,
        segments[i - 1].position,
        segments[i - 1].direction
      );
    }
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

  that.getSegments = function () {
    return segments;
  };

  //------------------------------------------------------------------
  //
  // Functions that given input, change the prefered direction
  // of the player
  //
  //------------------------------------------------------------------
  that.goUp = function (elapsedTime) {
    if (direction == Math.PI / 2 || direction == -Math.PI / 2) {
      return;
    }
    direction = -Math.PI / 2;
    turnPoints.push({ x: position.x, y: position.y });
  };
  that.goDown = function (elapsedTime) {
    if (direction == -Math.PI / 2 || direction == Math.PI / 2) {
      return;
    }
    direction = Math.PI / 2;
    turnPoints.push({ x: position.x, y: position.y });
  };
  that.goRight = function (elapsedTime) {
    if (direction == Math.PI || direction == 0) {
      return;
    }

    direction = 0;
    turnPoints.push({ x: position.x, y: position.y });
  };
  that.goLeft = function (elapsedTime) {
    if (direction == 0 || direction == Math.PI) {
      return;
    }
    direction = Math.PI;
    turnPoints.push({ x: position.x, y: position.y });
  };
  let updateRotateRate = 5000000;

  that.update = function (when) {};

  that.follow = function (elapsedTime, prevPosition, prevDirection) {
    position.x = prevPosition.x - Math.cos(prevDirection) * size.width;
    position.y = prevPosition.y - Math.sin(prevDirection) * size.height;
    direction = prevDirection;
  };

  return that;
};
