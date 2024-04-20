// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a player.
//
// ------------------------------------------------------------------
"use strict";

let random = require("./random");
let Body = require("./body");
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

  let segments = [];
  let turnPoints = [{ x: position.x, y: position.y }];
  let preferedDirection = 0;
  let threshold = 2;
  let name = "Player101";
  let points = 0;

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
  Object.defineProperty(that, "segments", {
    get: () => segments,
  });
  Object.defineProperty(that, "turnPoints", {
    get: () => turnPoints,
  });
  Object.defineProperty(that, "points", {
    get: () => points,
    set: (value) => (points = value),
  });

  that.addBodyPart = function (elapsedTime) {
    reportUpdate = true;
    console.log("adding body part");
    let newSnakePart = Body.createBody();
    segments.push(newSnakePart);
  };

  //   // public function to find the location for a newly added segment
  //   that.newSegmentPosition = function (elapsedTime) {
  //     let lastLocation = segments[segments.length - 1];

  //     let vectorX = Math.cos(direction);
  //     let vectorY = Math.sin(direction);

  //     let newLocation = {
  //         x: lastLocation.x,
  //         y: lastLocation.y,
  //     };

  //     newLocation.x += vectorX * elapsedTime * speed;
  //     newLocation.y += vectorY * elapsedTime * speed;

  //     return newLocation;
  //   };

  //   //------------------------------------------------------------------
  //   //
  //   // Public function that adds body parts
  //   //
  //   //------------------------------------------------------------------
  //   that.addBodyPart = function (elapsedTime) {
  //     // calculate location for new body parttttt
  //     let newLocation = this.newSegmentPosition(elapsedTime);

  //     let newSnakePart = MyGame.components.Body(newLocation);
  //     segments.push({ model: newSnakePart, texture: MyGame.assets["greenBody"] });
  //     console.log(turnPoints);
  //   };

  Object.defineProperty(that, "name", {
    get: () => name,
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
    for (let i = 1; i < segments.length; i++) {
      segments[i].follow(
        elapsedTime,
        segments[i - 1].position,
        segments[i - 1].direction
      );
    }
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
    if (direction == Math.PI / 2 || direction == -Math.PI / 2) {
      return;
    }
    reportUpdate = true;
    direction = -Math.PI / 2;
  };
  that.goDown = function (elapsedTime) {
    if (direction == -Math.PI / 2 || direction == Math.PI / 2) {
      return;
    }
    reportUpdate = true;
    direction = Math.PI / 2;
  };
  that.goRight = function (elapsedTime) {
    if (direction == Math.PI || direction == 0) {
      return;
    }
    reportUpdate = true;
    direction = 0;
  };
  that.goLeft = function (elapsedTime) {
    if (direction == 0 || direction == Math.PI) {
      return;
    }
    reportUpdate = true;
    direction = Math.PI;
  };

  //------------------------------------------------------------------
  //
  // Function used to update the player during the game loop.
  //
  //------------------------------------------------------------------
  let updateRotateRate = 5000000;
  that.update = function (when) {
    //This is getting called by the update function in server/game.js
  };
  // k so i cant move them in update, we need to send message
  //maybe the server should be the one to update the player
  //maybe idk time for class

  return that;
}

module.exports.create = () => createPlayer();
