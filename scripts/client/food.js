//------------------------------------------------------------------
//
// Model for all food in the game.
//
//---------------------------------------------------------------------
MyGame.components.Food = function(howMany) {
    'use strict';

    let that = {};

    let count = howMany;
    let positionsX = new Array(howMany);
    let positionsY = new Array(howMany);
    let reportUpdates = new Array(howMany).fill(true); // Indicates if a model was updated during the last update
    
    let spriteSheetIndices = new Array(6); // number of sprite sheets is hard-coded here, is there a way to take it from loader.js?
    let spriteCount = 8;
    let spriteTime = [200, 200, 200, 200, 200, 200, 200, 200]; // milliseconds per sprite animation frame
    let moveRate = 200 / 1000; // pixels per millisecond
    
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
    reportUpdates[index] = true;
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
    };
    return that;

    // let imageReady = false;
    // let image = new Image();

    // image.onload = function() {
    //     imageReady = true;
    // };
    // image.src = spec.imageSrc;

    // let api = {
    //     get imageSrc() { return spec.imageSrc; },
    //     get center() { return spec.center; },
    //     get size() { return spec.size; },
    //     get points() { return spec.points; },
    // };

    // return api;
};
