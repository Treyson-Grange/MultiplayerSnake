// --------------------------------------------------------------
//
// Renders a Text object.
//
//
// --------------------------------------------------------------
MyGame.renderer.Text = (function (graphics) {
  "use strict";
  let that = {};

  // ------------------------------------------------------------------
  //
  // Renders a Player model.
  //
  // ------------------------------------------------------------------
  that.render = function (spec) {
    if (!spec.player) {
      graphics.drawText(spec);
    } else {
      graphics.drawTextPlayerName(spec);
    }
  };

  return that;
})(MyGame.graphics);
