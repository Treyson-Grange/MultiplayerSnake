// ------------------------------------------------------------------
//
// Nodejs module that represents the model for the structure of arrays for Food.
//
// ------------------------------------------------------------------
"use strict";

let random = require("./random");

//------------------------------------------------------------------
//
// Public function used to initially create the structure of arrays for food
//
//------------------------------------------------------------------
function createFood(howMany) {
  let that = {};

    let positionsX = new Array(howMany);
    let positionsY = new Array(howMany);
    let reportUpdates = new Array(howMany).fill(false); // Indicates if a model was updated during the last update

  let size = {
    width: 0.05,
    height: 0.05,
  };

  Object.defineProperty(that, "positionsX", {
    get: () => positionsX,
  });

  Object.defineProperty(that, "positionsY", {
    get: () => positionsY,
  });

  Object.defineProperty(that, "size", {
    get: () => size,
  });

  Object.defineProperty(that, "howMany", {
    get: () => howMany,
  });

  Object.defineProperty(that, "reportUpdates", {
    get: () => reportUpdates,
    set: (index, value) => (reportUpdates[index] = value),
  });

    //------------------------------------------------------------------
  //
  // Function used to "remove and re-generate" (ie just relocate :P) a particle of food from the structure of arrays
  //
  //------------------------------------------------------------------

  function relocateFood(index) {
    // need to update player score in here, too? Or build a new function for that?

    reportUpdates[index] = true;

    positionsX[index] = random.nextDouble();
    positionsY[index] = random.nextDouble();
  }

  //------------------------------------------------------------------
  //
  // Function used to update the food during the game loop.
  //
  //------------------------------------------------------------------
  that.update = function (eaten, index) {
    if (eaten) {
      relocateFood(index);
    }
  };

  return that;
}

module.exports.create = () => createFood();
