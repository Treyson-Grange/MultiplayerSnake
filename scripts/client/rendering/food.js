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
        // console.log("model.spriteSheetIndices: ", model.spriteSheetIndices);
        for (let i = 0; i < model.positionsX.length; i++) {
            graphics.saveContext();
            let position = {
                x: model.positionsX[i] - playerSelfPos.x,
                y: model.positionsY[i] - playerSelfPos.y
            }
            console.log("positionsX, positionsY: ", model.positionsX, model.positionsY);
            // console.log("texture[model.spriteSheetIndices[i]] is: ", i, model.spriteSheetIndices[i], texture[model.spriteSheetIndices[i]]);
            graphics.drawSprite(texture[model.spriteSheetIndices[i]], position, model.size, i);
            graphics.restoreContext();
        }
    }

    return that;

}(MyGame.graphics));
