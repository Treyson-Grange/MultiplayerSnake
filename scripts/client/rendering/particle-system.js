// --------------------------------------------------------------
//
// Renders the particles in a particle system
//
// --------------------------------------------------------------
MyGame.renderer.ParticleSystem = function (system, graphics, imageSrc, playerSelfPos) {
    'use strict';

    const SCREEN_WIDTH = 1;

    let image = new Image();
    let isReady = false;  // Can't render until the texture is loaded

    //
    // Get the texture to use for the particle system loading and ready for rendering
    image.onload = function() {
        isReady = true;
    }
    image.src = imageSrc;

    //------------------------------------------------------------------
    //
    // Render all particles
    //
    //------------------------------------------------------------------
    function render() {
        if (isReady) {

            let screenPos = { x: playerSelfPos.x - 0.5, y: playerSelfPos.y - 0.5 }; //top-left corner of screen

            // for each particle
            Object.getOwnPropertyNames(system.particles).forEach( function(value) {
                let particle = system.particles[value];

                graphics.saveContext();

                // render particle if in render distance
                // if (
                //     screenPos.x < particle.center.x + particle.size.x / 2 && 
                //     particle.center.x - particle.size.x / 2 < screenPos.x + SCREEN_WIDTH
                // ) {
                    let position = {
                        x: particle.center.x - screenPos.x,
                        y: particle.center.y - screenPos.y,
                    };
                    graphics.rotateCanvas(position, particle.rotation);
                    graphics.drawImage(image, position, particle.size);
                    console.log("image, position, particle.size: ", image, position, particle.size);
                    graphics.restoreContext();
                // }
    
                // graphics.drawTexture(image, position, particle.rotation, particle.size);
            });
        } else {
            console.log("isn't ready");
        }
    }

    let api = {
        render: render
    };

    return api;
};
