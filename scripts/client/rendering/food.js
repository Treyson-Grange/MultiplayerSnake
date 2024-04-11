// --------------------------------------------------------------
//
// Renders all Food objects.
//
//
// --------------------------------------------------------------
MyGame.renderer.Food = (function(graphics) {
    'use strict';
    let that = {};
    
    // ------------------------------------------------------------------
    //
    // Renders all food models.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture, playerSelfPos) {
        for (let i = 0; i < model.positionsX.length; i++) {
            graphics.saveContext();
            let position = {
                x: model.positionsX[i] - playerSelfPos.x,
                y: model.positionsY[i] - playerSelfPos.y
            }
            graphics.drawSprite(texture, position, model.size);
            graphics.restoreContext();
        }
    }

    return that;

}(MyGame.graphics));
