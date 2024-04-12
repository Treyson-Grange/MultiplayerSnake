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

    let count = howMany;
    let positionsX = new Array(howMany);
    let positionsY = new Array(howMany);
    let reportUpdates = new Array(howMany).fill(true); // Indicates if a model was updated during the last update
    
    let spriteSheetIndices = new Array(howMany);
    let spriteCount = 8;
    let spriteTime = [200, 200, 200, 200, 200, 200, 200, 200]; // milliseconds per sprite animation frame
    let moveRate = 200 / 1000; // pixels per millisecond

  let size = {
    width: 0.05,
    height: 0.05,
  };

  Object.defineProperty(that, "positionsX", {
    get: () => positionsX,
    set: (index, value) => (positionsX[index] = value),
  });

  Object.defineProperty(that, "positionsY", {
    get: () => positionsY,
    set: (index, value) => (positionsY[index] = value),
  });

  Object.defineProperty(that, "size", {
    get: () => size,
  });

  Object.defineProperty(that, "count", {
    get: () => count,
  });

  Object.defineProperty(that, "reportUpdates", {
    get: () => reportUpdates,
    set: (index, value) => (reportUpdates[index] = value),
  });

  Object.defineProperty(that, "spriteSheetIndices", {
    get: () => spriteSheetIndices,
    set: (index, value) => (spriteSheetIndices[index] = value),
  });

  Object.defineProperty(that, "spriteCount", {
    get: () => spriteCount,
  });

  Object.defineProperty(that, "spriteTime", {
    get: () => spriteTime,
  });

  Object.defineProperty(that, "moveRate", {
    get: () => moveRate,
  });

//------------------------------------------------------------------
  //
  // Function used to "remove and re-generate" (ie just relocate :P) a particle of food from the structure of arrays
  //
  //------------------------------------------------------------------

  function relocateFood(index, positionX, positionY) {
    // need to update player score in here, too? Or build a new function for that?
    reportUpdates[index] = true; // IS THIS EVEN RIGHT? WHAT DOES IT MEAN?
    positionsX[index] = positionX;
    positionsY[index] = positionY;
  }

  //------------------------------------------------------------------
  //
  // Function used to update the food during the game loop.
  //
  //------------------------------------------------------------------

    that.update = function (data) {
        for (let i = 0; i < data.count; i++) {
            if (data.reportUpdates[i] == true) {
                relocateFood(i, data.positionsX[i], data.positionsY[i]);
            }
        }
        spriteSheetIndices = data.spriteSheetIndices;

    };

    that.updateSprites = function (data) {
        spriteSheetIndices = data.spriteSheetIndices;
    };

    return that;

}

module.exports.create = (howMany) => createFood(howMany);
