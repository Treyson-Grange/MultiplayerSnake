MyGame.components.Body = function () {
  "use strict";
  let that = {};
  let position = {
    x: 0,
    y: 0,
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
  let direction = 0;
  let rotateRate = Math.PI / 1000;
  let speed = 0.0002;

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
  that.update = function (elapsedTime) {
    if (goal.updateWindow === 0) return;
    console.log("ah");
    let updateFraction = elapsedTime / goal.updateWindow;
    if (updateFraction > 0) {
      //
      // Turn first, then move.
      state.direction -= (state.direction - goal.direction) * updateFraction;

      state.position.x -= (state.position.x - goal.position.x) * updateFraction;
      state.position.y -= (state.position.y - goal.position.y) * updateFraction;
    }
  };

  return that;
};
