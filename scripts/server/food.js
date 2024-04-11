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
    // TODO: PROLLY DON'T INITIALIZE HERE, OR ELSE HAVE SOME BETTER WAY OF SENDING FOOD INFO TO CLIENT AT THE START?
    let positionsX = new Array(howMany);
    // for (let i = 0; i < howMany; i++) {
    //     positionsX[i] = random.nextDouble();
    // }

    let positionsY = new Array(howMany);
    // for (let i = 0; i < howMany; i++) {
    //     positionsY[i] = random.nextDouble();
    // }

    let reportUpdates = new Array(howMany).fill(true); // Indicates if a model was updated during the last update

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
            if (data.reportUpdates[i]) {
                relocateFood(i, data.positionsX[i], data.positionsY[i]);
            }
        }
    };
    return that;

}

module.exports.create = (howMany) => createFood(howMany);
