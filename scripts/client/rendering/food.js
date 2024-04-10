// --------------------------------------------------------------
//
// Renders a Food object.
//
//
// --------------------------------------------------------------
MyGame.renderer.Food = (function(graphics) {
    'use strict';

    // ------------------------------------------------------------------
    //
    // Renders a Food model.
    //
    // ------------------------------------------------------------------
    function render(spec) {
        if (!spec.crashed) {
            if (spec.imageReady) {
                graphics.drawImage(spec.imageSrc, spec.center, spec.size);
            }
        }
    }

    return {
        render: render
    };

}(MyGame.graphics));
