// --------------------------------------------------------------
//
// Renders a Button object.
//
//
// --------------------------------------------------------------
MyGame.renderer.Button = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a Player model.
    //
    // ------------------------------------------------------------------
    that.render = function(spec) {
        graphics.drawImage(spec.image, spec.center, spec.size);
    };

    return that;

}(MyGame.graphics));
