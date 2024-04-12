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
            // we need the last i in this call to increment every time the function is called; that way we render a new frame of the frog each time
            graphics.drawSprite(texture[model.spriteSheetIndices[i]], position, model.size, model.renderFrame[i]); 
            graphics.restoreContext();
        }
    }

    return that;

}(MyGame.graphics));
