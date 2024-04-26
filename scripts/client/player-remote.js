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


  that.addBodyPart = function () {
    // calculate location for new body parttttt
    // TODO: REIMPLEMENT THIS VVVV !!
    // let newLocation = this.newSegmentPosition(elapsedTime);
    let newLocation = { x: 0, y: 0 };

    let newSnakePart = MyGame.components.Body(newLocation, state.direction);
    segments.push({ model: newSnakePart, texture: MyGame.assets["redBody"] });
    console.log("other body part added");
  };

  that.removeAllSegments = function () {
    segments.length = 0;
  };

  function distFrom(fromIndex, toIndex) {
    let xDist;
    let yDist;
    if (toIndex == turnPoints.length) {
      xDist = Math.abs(turnPoints[fromIndex].x - state.position.x);
      yDist = Math.abs(turnPoints[fromIndex].y - state.position.y);
    } else {
      xDist = Math.abs(turnPoints[fromIndex].x - turnPoints[toIndex].x);
      yDist = Math.abs(turnPoints[fromIndex].y - turnPoints[toIndex].y);
    }
    return xDist + yDist; //Because x or y dist will always be 0

  }

  function updateBody() {

    // Segment positions
    let space = .04;  // Get this from somewhere else
    for (let i = 0; i < segments.length; i++) {
      let startSegSpace = space * (i+1); 
      let segSpace = startSegSpace
      for (let j = turnPoints.length - 1; j >= 0; j--){
        // console.log(segSpace, distFrom(j, j + 1));
        segSpace = segSpace - distFrom(j, j + 1);
        if (segSpace <= 0) {
          if (j == turnPoints.length -1) {
            segments[i].model.position = {
              x: state.position.x + (Math.cos(state.direction) * (-startSegSpace)),
              y: state.position.y + (Math.sin(state.direction) * (-startSegSpace))
            }
          } else {
            segments[i].model.position = {
              x: turnPoints[j].x + (Math.cos(turnPoints[j].direction) * -segSpace),
              y: turnPoints[j].y + (Math.sin(turnPoints[j].direction) * -segSpace)
            }
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
  // Update of the remote player is a simple linear progression/interpolation
  // from the previous state to the goal (new) state.
  //
  //------------------------------------------------------------------
  that.update = function (elapsedTime) {
    // Protect agains divide by 0 before the first update from the server has been given
    if (goal.updateWindow === 0) return;
    let updateFraction = elapsedTime / goal.updateWindow;
    if (updateFraction > 0) {

      state.position.x -= (state.position.x - goal.position.x) * updateFraction;
      state.position.y -= (state.position.y - goal.position.y) * updateFraction;

      if (state.direction != goal.direction) {
        state.direction = goal.direction
        turnPoints.push({ x: state.position.x, y: state.position.y, direction: state.direction });
      }
      updateBody();
    }
  };

  return that;
};
