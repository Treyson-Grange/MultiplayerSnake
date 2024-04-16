MyGame.renderer.Body = (function (graphics) {
  "use strict";
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders a Body model.
  //
  // ------------------------------------------------------------------
  that.render = function (model, texture) {
    graphics.saveContext();
    graphics.rotateCanvas(model.position, model.direction);
    graphics.drawImage(texture, model.position, model.size);
    graphics.restoreContext();
  };

  return that;
})(MyGame.graphics);
