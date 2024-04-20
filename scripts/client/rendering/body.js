MyGame.renderer.Body = (function (graphics) {
  "use strict";
  let that = {};
  const SCREEN_WIDTH = 1;

  // ------------------------------------------------------------------
  //
  // Renders a Body model.
  //
  // ------------------------------------------------------------------
  that.render = function (model, texture, playerSelfPos) {

    let screenPos = {x: playerSelfPos.x - .5, y: playerSelfPos.y - .5}; //top-left corner of screen
    graphics.saveContext();

    if (
      screenPos.x < model.position.x + model.size.width / 2 &&
      model.position.x - model.size.width / 2 < screenPos.x + SCREEN_WIDTH
    ) {
      if (
        screenPos.y < model.position.y + model.size.height / 2 &&
        model.position.y - model.size.height / 2 <
          screenPos.y + SCREEN_WIDTH
      ) {
        let position = {
          x: model.position.x - screenPos.x,
          y: model.position.y - screenPos.y,
        };
        // console.log(position);
        graphics.rotateCanvas(position, model.direction);

        graphics.drawImage(texture, position, model.size);
        graphics.restoreContext();
      }
    }

    graphics.restoreContext();
  };

  return that;
})(MyGame.graphics);
