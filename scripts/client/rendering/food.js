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
    
    // ------------------------------------------------------------------
    //
    // Renders all food models.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture, playerSelfPos, WORLD_SIZE) {
        let screenPos = {x: playerSelfPos.x - .5, y: playerSelfPos.y - .5}; //top-left corner of screen
        console.log("screenPos: ", screenPos);
        // console.log(-screenPos.y);

        for (let i = 0; i < model.positionsX.length; i++) {
            graphics.saveContext();

            // render food if in render dist
            // if (screenPos.x < LEFT_WALL_X && ) {
                let foodX = model.positionsX[i] - screenPos.x;
                let foodY = model.positionsY[i] - screenPos.y;
                let position = {
                    x: foodX,
                    y: foodY,
                }
                // console.log("position: ", position);
                // PROLLY CHANGE THIS vvv TO JUST A SEPARATE FOOD THING FOR BIG FOOD
                // if (model.bigFood[i]) { // this isn't working; also we need to get bigFood values from server cause those should be the same across clients!!
                //     graphics.drawSprite(texture[model.spriteSheetIndices[i]], position, {width: model.size.width * 2, height: model.size.height * 2}, model.renderFrame); 
                // }
                // else {
                    graphics.drawSprite(texture[model.spriteSheetIndices[i]], position, model.size, model.renderFrame); 
                // }
    
            // }
            
            // we need the last i in this call to increment every time the function is called; that way we render a new frame of the frog each time
            graphics.restoreContext();
        }
    }

    return that;

}(MyGame.graphics));
