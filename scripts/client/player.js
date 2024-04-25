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
  let turnPoints = [];
  let points = 0;
  let kills = 0;
  let isActive = true;

  Object.defineProperty(that, "isActive", {
    get: () => isActive,
  });

  Object.defineProperty(that, "kills", {
    get: () => kills,
  });
  
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
    set: (value) => (segments = value),
  });
  Object.defineProperty(that, "turnPoints", {
    get: () => turnPoints,
  });
  Object.defineProperty(that, "points", {
    get: () => points,
    set: (value) => {
      points = value;
    },
  });

  // public function to find the location for a newly added segment
  that.newSegmentPosition = function (elapsedTime) {
    console.log("segments: ", segments);

    let lastLocation = { x: 0, y: 0 };

    if (segments.length > 0) {
      console.log(
        "segments[segments.length - 1].model.position: ",
        segments[segments.length - 1].model.position
      );
      lastLocation = segments[segments.length - 1].model.position;
    }
    console.log("lastLocation! ", lastLocation);

    let vectorX = Math.cos(direction);
    let vectorY = Math.sin(direction);

    let newLocation = {
      x: lastLocation.x,
      y: lastLocation.y,
    };

    newLocation.x += vectorX * elapsedTime * speed;
    newLocation.y += vectorY * elapsedTime * speed;

    return newLocation;
  };

  //-----------------------------------------------------------------
  //
  // Function that removes a segment at index i
  //
  //-----------------------------------------------------------------
  that.removeSegment = function (idx) {
    segments.splice[idx, 1];
  };

  //------------------------------------------------------------------
  //
  // Public function that adds body parts
  //
  //------------------------------------------------------------------
  that.addBodyPart = function (elapsedTime) {
    // calculate location for new body parttttt
    // TODO: REIMPLEMENT THIS VVVV !!
    // let newLocation = this.newSegmentPosition(elapsedTime);
    let newLocation = { x: 0, y: 0 };

    let newSnakePart = MyGame.components.Body(newLocation, direction);
    segments.push({ model: newSnakePart, texture: MyGame.assets["greenBody"] });
    console.log(turnPoints);
  };

  //------------------------------------------------------------------
  //
  // Private function that determines the dist between to turn points
  //
  //------------------------------------------------------------------
  function distFrom(fromIndex, toIndex) {
    let xDist;
    let yDist;
    if (toIndex == turnPoints.length) {
      xDist = Math.abs(turnPoints[fromIndex].x - position.x);
      yDist = Math.abs(turnPoints[fromIndex].y - position.y);
    } else {
      xDist = Math.abs(turnPoints[fromIndex].x - turnPoints[toIndex].x);
      yDist = Math.abs(turnPoints[fromIndex].y - turnPoints[toIndex].y);
    }
    return xDist + yDist; //Because x or y dist will always be 0

  }
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

    // Segment positions
    let space = .04;  // Get this from somewhere else
    for (let i = 0; i < segments.length; i++) {
      let segSpace = space * (i+1); 
      for (let j = turnPoints.length - 1; j >= 0; j--){
        // console.log(segSpace, distFrom(j, j + 1));
        segSpace = segSpace - distFrom(j, j + 1);
        if (segSpace <= 0) {
          segments[i].model.position = {
            x: turnPoints[j].x + (Math.cos(turnPoints[j].direction) * -segSpace),
            y: turnPoints[j].y + (Math.sin(turnPoints[j].direction) * -segSpace)
          }
          segments[i].model.direction = turnPoints[j].direction;
          break;
        }
      }
      // segments[i].model.position = {x:1, y:.5}
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
    turnPoints.push({ x: position.x, y: position.y, direction: direction });
  };
  that.goDown = function (elapsedTime) {
    if (direction == -Math.PI / 2 || direction == Math.PI / 2) {
      return;
    }
    direction = Math.PI / 2;
    turnPoints.push({
      x: position.x,
      y: position.y,
      direction: direction,
    });
  };
  that.goRight = function (elapsedTime) {
    if (direction == Math.PI || direction == 0) {
      return;
    }

    direction = 0;
    turnPoints.push({ x: position.x, y: position.y, direction: direction });
  };
  that.goLeft = function (elapsedTime) {
    if (direction == 0 || direction == Math.PI) {
      return;
    }
    direction = Math.PI;
    turnPoints.push({ x: position.x, y: position.y, direction: direction });
  };

  that.update = function (elapsedTime) {
    //This is getting called by the update function in server/game.js
  };

  //---------------------------------------------------------------------
  //
  // Function to refresh the player, gives it new location, removes body parts, resets points, etc.
  //
  //---------------------------------------------------------------------
  that.refresh = function () {
    X = random.nextDouble() * WORLD_SIZE;
    if (X < 0.5) {
      X += 0.5;
    } else if (X > 3.5) {
      X -= 0.5;
    }
    Y = random.nextDouble() * WORLD_SIZE;
    if (Y < 0.5) {
      Y += 0.5;
    } else if (Y > 3.5) {
      Y -= 0.5;
    }

    position = {
      x: X,
      y: Y,
    };
    
    direction = random.nextDouble() * 2 * Math.PI; // Angle in radians
    reportUpdate = false; // Indicates if this model was updated during the last update
  
    segments = [];
    turnPoints = [{ x: position.x, y: position.y }];
    points = 0;  
    kills = 0;
    isActive = true;
  };

  that.follow = function (elapsedTime, prevPosition, prevDirection) {
    position.x = prevPosition.x - Math.cos(prevDirection) * size.width;
    position.y = prevPosition.y - Math.sin(prevDirection) * size.height;
    direction = prevDirection;
  };

  that.points = function () {
    return points;
  };

  return that;
};
