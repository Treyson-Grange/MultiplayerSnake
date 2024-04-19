MyGame.components.Body = function (startPosition, startDirection) {
  console.log("I am creating a snek and this is its specs: ", startPosition, startDirection);
  
    "use strict";
  let that = {};
  let position = {
    x: startPosition.x,
    y: startPosition.y,
  };
  let state = {
    direction: 0,
    position: {
      x: 0,
      y: 0,
    },
  };
  let goal = {
    direction: 0,
    position: {
      x: 0,
      y: 0,
    },
    updateWindow: 0,
  };
  let size = {
    width: 0.05,
    height: 0.05,
  };
  let direction = startDirection;
  let rotateRate = Math.PI / 1000;
  let speed = 0.0002;
  let turnPoints = MyGame.utilities.Queue();

  Object.defineProperty(that, "direction", {
    get: () => direction,
    set: (value) => {
      direction = value;
    },
  });

  Object.defineProperty(that, "state", {
    get: () => state,
  });

  Object.defineProperty(that, "goal", {
    get: () => goal,
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

  that.follow = function (elapsedTime, position, direction) {
    // console.log(elapsedTime);
  };

//   that.move = function (elapsedTime) {
//     let vectorX = Math.cos(direction);
//     let vectorY = Math.sin(direction);

//     position.x += vectorX * elapsedTime * speed;
//     position.y += vectorY * elapsedTime * speed;
//     for (let i = 1; i < segments.length; i++) {
//       segments[i].model.follow(
//         elapsedTime,
//         segments[i - 1].position,
//         segments[i - 1].direction
//       );
//     }
//   };

  that.updatePosition = function (elapsedTime) {
    // update position of the body part
    // let vectorX = Math.cos(direction);
    // let vectorY = Math.sin(direction);

    // position.x += vectorX * elapsedTime * speed;
    // position.y += vectorY * elapsedTime * speed;

    // this all wrong vv
    if (direction < 0) { // if the part is moving up
        console.log("up!");
        if (turnPoints.front.y < position.y) { // if we haven't hit the turnpoint yet
            position.y -= speed * elapsedTime;
        } else {
            turnPoints.dequeue();
        }
    } 
    else if (direction == 0) { // if the part is moving right
        console.log("right!");
        if (turnPoints.front.x > position.x) {
            position.x -= speed * elapsedTime;
        } else {
            turnPoints.dequeue();
        }
    } 
    else if (direction < 3) { // if the part is moving down
        console.log("down!");
        if (turnPoints.front.y > position.y) {
            position.y += speed * elapsedTime;
        } else {
            turnPoints.dequeue();
        }
    } 
    else { // if the part is moving left
        console.log("left!");
        if (turnPoints.front.x < position.x) {
            position.x += speed * elapsedTime;
        } else {
            turnPoints.dequeue();
        }
    }
  };
  
  // turnPoints is an array of turnpoints passed, where turnpoints are objects
  that.update = function (elapsedTime, turnPointsArray) {
    // add new turnpoints to the body part's turnpoint queue
    for (let i = 0; i < turnPointsArray.length; i++) {
        turnPoints.enqueue(turnPointsArray[i]);
    }

    this.updatePosition(elapsedTime);
  };

  return that;
};
