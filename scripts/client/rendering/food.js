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
        graphics.saveContext();
        for (let i = 0; i < model.positionsX.length; i++) {
            graphics.saveContext();
            let position = {
                x: model.positionsX[i] - playerSelfPos.x, // change this to subtracting the screen location, not player location :)
                y: model.positionsY[i] - playerSelfPos.y,
            }
            // PROLLY CHANGE THIS vvv TO JUST A SEPARATE FOOD THING FOR BIG FOOD
            // if (model.bigFood[i]) { // this isn't working; also we need to get bigFood values from server cause those should be the same across clients!!
            //     graphics.drawSprite(texture[model.spriteSheetIndices[i]], position, {width: model.size.width * 2, height: model.size.height * 2}, model.renderFrame); 
            // }
            // else {
                graphics.drawSprite(texture[model.spriteSheetIndices[i]], position, model.size, model.renderFrame); 
            // }
            // we need the last i in this call to increment every time the function is called; that way we render a new frame of the frog each time
            graphics.restoreContext();
        }
        graphics.restoreContext();    
    }

    return that;

}(MyGame.graphics));
