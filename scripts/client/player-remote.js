//------------------------------------------------------------------
//
// Model for each remote player in the game.
//
//------------------------------------------------------------------
MyGame.components.PlayerRemote = function () {
  "use strict";
  let that = {};
  let size = {
    width: 0.05,
    height: 0.05,
  };
  let state = {
    direction: 0,
    position: {
      x: 0,
      y: 0,
    },
  };
  let name = "Player101";
  let goal = {
    direction: 0,
    position: {
      x: 0,
      y: 0,
    },
    updateWindow: 0, // Server reported time elapsed since last update
  };
  let turnPoints = [];
  let segments = [];

  Object.defineProperty(that, "state", {
    get: () => state,
  });

  Object.defineProperty(that, "goal", {
    get: () => goal,
  });

  Object.defineProperty(that, "size", {
    get: () => size,
  });

  Object.defineProperty(that, "turnPoints", {
    get: () => turnPoints,
  });

  Object.defineProperty(that, "segments", {
    get: () => segments,
  });

  Object.defineProperty(that, "name", {
    get: () => name,
  });


  that.addBodyPart = function (elapsedTime) {
    // calculate location for new body parttttt
    // TODO: REIMPLEMENT THIS VVVV !!
    // let newLocation = this.newSegmentPosition(elapsedTime);
    let newLocation = { x: 0, y: 0 };

    let newSnakePart = MyGame.components.Body(newLocation, direction);
    segments.push({ model: newSnakePart, texture: MyGame.assets["greenBody"] });
    console.log(turnPoints);
  };

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
  // Update of the remote player is a simple linear progression/interpolation
  // from the previous state to the goal (new) state.
  //
  //------------------------------------------------------------------
  that.update = function (elapsedTime) {
    // Protect agains divide by 0 before the first update from the server has been given
    if (goal.updateWindow === 0) return;
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
