// ------------------------------------------------------------------
//
// Rendering function for a Player object.
//
// ------------------------------------------------------------------
MyGame.renderer.Panel = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a Player model.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture) {
        graphics.saveContext();
        // graphics.rotateCanvas({x: .5, y: .5}, model.direction);
        graphics.drawImage(texture, model.center, model.size);
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));
