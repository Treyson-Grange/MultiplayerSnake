MyGame.components.Body = function (startPosition, startDirection) {
  ("use strict");
  let that = {};
  let position = {
    x: startPosition.x,
    y: startPosition.y,
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
    set: (setPosition) => {
      position = setPosition;
    },
  });

  Object.defineProperty(that, "size", {
    get: () => size,
  });

  return that;
};
