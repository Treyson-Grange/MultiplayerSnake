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
    // Renders a single food model.
    //
    // ------------------------------------------------------------------
    that.renderIndividual = function(positionX, positionY, size, texture) {
        graphics.saveContext();
        graphics.drawImage(texture, {x: positionX, y: positionY}, size);
        graphics.restoreContext();
    };

    
    // ------------------------------------------------------------------
    //
    // Renders all food models.
    //
    // ------------------------------------------------------------------
    that.renderAll = function(model, texture) {
        for (let i = 0; i < model.howMany; i++) {
            renderIndividual(model.positionsX[i], model.positionsY[i], model.size, texture);
        }
    };

    return that;

    // function render(spec) {
    //     if (!spec.crashed) {
    //         if (spec.imageReady) {
    //             graphics.drawImage(spec.imageSrc, spec.center, spec.size);
    //         }
    //     }
    // }

    // return {
    //     render: render
    // };

}(MyGame.graphics));
