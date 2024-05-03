// ------------------------------------------------------------------
//
// Rendering function for a PlayerRemote object.
//
// ------------------------------------------------------------------
MyGame.renderer.PlayerRemote = (function (graphics) {
  "use strict";
  let that = {};
  const SCREEN_WIDTH = 1;
  // ------------------------------------------------------------------
  //
  // Renders a PlayerRemote model.
  //
  // ------------------------------------------------------------------
  that.render = function (model, texture, playerSelfPos, name) {
    let screenPos = { x: playerSelfPos.x - 0.5, y: playerSelfPos.y - 0.5 }; //top-left corner of screen

    graphics.saveContext();

    // render snake if in render dist and visible is true
    if (
      screenPos.x < model.state.position.x + model.size.width / 2 &&
      model.state.position.x - model.size.width / 2 < screenPos.x + SCREEN_WIDTH &&
      model.visible
    ) {
      console.log("x good");
      if (
        screenPos.y < model.state.position.y + model.size.height / 2 &&
        model.state.position.y - model.size.height / 2 <
        screenPos.y + SCREEN_WIDTH
      ) {
        let position = {
          x: model.state.position.x - screenPos.x,
          y: model.state.position.y - screenPos.y,
        };
        let namePosition = {
          x: model.state.position.x - screenPos.x,
          y: model.state.position.y - screenPos.y - 0.05,
        };
        graphics.rotateCanvas(position, model.state.direction);

        graphics.drawImage(texture, position, model.size);
        graphics.restoreContext();
        renderOtherTitle(model.name, namePosition, "10px Arial", "#FFFFFF", "#FFFFFF");
      }
    }

    // we need the last i in this call to increment every time the function is called; that way we render a new frame of the frog each time
    graphics.restoreContext();
  };

  function renderOtherTitle(name, position, font, fillStyle, strokeStyle) {
    if (name === undefined) {
      name = "Player";
    }
    let spec = {
      text: name,
      position: position,
      font: font,
      fillStyle: fillStyle,
      strokeStyle: strokeStyle,
    };
    graphics.drawTextPlayerName(spec);
  }

  // that.render = function(model, texture, playerSelfPos) {
  //     graphics.saveContext();
  //     let position = {
  //         x: model.state.position.x - playerSelfPos.x,
  //         y: model.state.position.y - playerSelfPos.y
  //     }
  //     graphics.rotateCanvas(position, model.state.direction);
  //     graphics.drawImage(texture, position, model.size);
  //     graphics.restoreContext();
  // };
  // change + 0 = new
  return that;
})(MyGame.graphics);
