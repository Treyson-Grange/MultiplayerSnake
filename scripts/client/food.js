//------------------------------------------------------------------
//
// Model for each player in the game.
//
//---------------------------------------------------------------------
MyGame.objects.Food = function(howMany) {
    'use strict';

    let that = {};

    let positionsX = new Array(howMany);
    let positionsY = new Array(howMany);
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

    that.update = function (eaten, index) {
        if (eaten) {
            relocateFood(index);
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
