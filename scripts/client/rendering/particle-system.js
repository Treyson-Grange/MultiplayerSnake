// --------------------------------------------------------------
//
// Renders the particles in a particle system
//
// --------------------------------------------------------------
MyGame.renderer.ParticleSystem = (function (graphics) {
    'use strict';

    let that = {};
    const SCREEN_WIDTH = 1;

    //------------------------------------------------------------------
    //
    // Render all particles
    //
    //------------------------------------------------------------------
    that.render = function (system, texture, playerSelfPos) {
        let screenPos = { x: playerSelfPos.x - 0.5, y: playerSelfPos.y - 0.5 }; //top-left corner of screen

        // for each particle
        Object.getOwnPropertyNames(system.particles).forEach( function(value) {
            let particle = system.particles[value];

            graphics.saveContext();

            // TODO: COULD MAKE PARTICLES ONLY RENDER IF ON SCREEN?
            // That's ^^ prolly not necessary though cause we only have smol particles by our face

                let position = {
                    x: particle.center.x - screenPos.x,
                    y: particle.center.y - screenPos.y,
                };

                console.log("particle.center, position: ", particle.center, position);
                console.log("texture, position, particle.size: ", texture, position, particle.size);

                graphics.rotateCanvas(position, particle.rotation);
                graphics.drawImage(texture, position, particle.size);
                graphics.restoreContext();
            // }

            // graphics.drawTexture(image, position, particle.rotation, particle.size);
        });
    };

    return that;

})(MyGame.graphics);
