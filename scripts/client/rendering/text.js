// --------------------------------------------------------------
//
// Renders a Text object.
//
//
// --------------------------------------------------------------
MyGame.renderer.Text = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a Player model.
    //
    // ------------------------------------------------------------------
    that.render = function(spec) {
        graphics.drawText(spec);
    };

    return that;

}(MyGame.graphics));
