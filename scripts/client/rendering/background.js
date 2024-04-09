// ------------------------------------------------------------------
//
// Rendering function for the tile map
//
// ------------------------------------------------------------------
MyGame.renderer.Background = (function (graphics) {
  "use strict";
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders the background
  //
  // ------------------------------------------------------------------
  that.render = function (playerPos, tileSize, texture) {
    graphics.saveContext();
    let numRows = Math.ceil(1 / tileSize.width) + 3;
    let numCols = Math.ceil(1 / tileSize.height) + 3;
    // console.log(numCols);
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let tileX =
          (-playerPos.x % tileSize.width) + tileSize.width * j - tileSize.width;
        let tileY =
          (-playerPos.y % tileSize.height) +
          tileSize.height * i -
          tileSize.height;
        let center = { x: tileX, y: tileY };
        graphics.drawImage(texture, center, tileSize);
      }
    }
    graphics.restoreContext();
  };

  return that;
})(MyGame.graphics);
