// --------------------------------------------------------------
//
// Renders all Food objects.
//
//
// --------------------------------------------------------------
MyGame.renderer.Food = (function(graphics) {
    'use strict';
    let that = {};
    
    const LEFT_WALL_X = 0;
    const TOP_WALL_Y = 0;
    const SCREEN_WIDTH = 1;
    
    // ------------------------------------------------------------------
    //
    // Renders all food models.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture, bigTexture, playerSelfPos, WORLD_SIZE) {
        // console.log("bigTexture: ", bigTexture);

        let screenPos = {x: playerSelfPos.x - .5, y: playerSelfPos.y - .5}; //top-left corner of screen

        graphics.saveContext();
        for (let i = 0; i < model.positionsX.length; i++) {
    
            // render food if in render dist
            if (screenPos.x < model.positionsX[i] && model.positionsX[i] < screenPos.x + SCREEN_WIDTH) {
                if (screenPos.y < model.positionsY[i] && model.positionsY[i] < screenPos.y + SCREEN_WIDTH) {
                    console.log("drawing frog ", i);
                    let foodX = model.positionsX[i] - screenPos.x;
                    let foodY = model.positionsY[i] - screenPos.y;
                    let position = {
                        x: foodX,
                        y: foodY,
                    }
                    // console.log("position: ", position);
                    // PROLLY CHANGE THIS vvv TO JUST A SEPARATE FOOD THING FOR BIG FOOD
                    if (model.bigFood[i]) { // this isn't working; also we need to get bigFood values from server cause those should be the same across clients!!
                        graphics.drawSprite(bigTexture[model.spriteSheetIndices[i]], position, model.bigSize, model.renderFrame); 
                    }
                    else {
                        graphics.drawSprite(texture[model.spriteSheetIndices[i]], position, model.size, model.renderFrame); 
                    }
                }                        
            }
        }
            
        // we need the last i in this call to increment every time the function is called; that way we render a new frame of the frog each time
        graphics.restoreContext();
    }

    return that;

}(MyGame.graphics));
