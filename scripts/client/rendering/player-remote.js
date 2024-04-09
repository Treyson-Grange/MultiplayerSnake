// ------------------------------------------------------------------
//
// Rendering function for a PlayerRemote object.
//
// ------------------------------------------------------------------
MyGame.renderer.PlayerRemote = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a PlayerRemote model.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture, playerSelfPos) {
        graphics.saveContext();
        let position = {
            x: model.state.position.x - playerSelfPos.x,
            y: model.state.position.y - playerSelfPos.y
        }
        graphics.rotateCanvas(position, model.state.direction);
        graphics.drawImage(texture, position, model.size);
        graphics.restoreContext();
    };
    // change + 0 = new
    return that;

}(MyGame.graphics));
