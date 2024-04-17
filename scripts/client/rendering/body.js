MyGame.renderer.Body = (function (graphics) {
  "use strict";
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders a Body model.
  //
  // ------------------------------------------------------------------
  that.render = function (model, texture, bodyLocation) {
    graphics.saveContext();
    let position = {
      x: model.state.position.x - bodyLocation.x,
      y: model.state.position.y - bodyLocation.y,
    };
    graphics.rotateCanvas(position, model.direction);
    graphics.drawImage(texture, model.position, model.size);
    graphics.restoreContext();
  };

  return that;
})(MyGame.graphics);
