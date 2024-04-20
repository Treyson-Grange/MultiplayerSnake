//------------------------------------------------------------------
//
// This is the particle system use by the game code
//
//------------------------------------------------------------------
MyGame.systems.ParticleSystemManager = (function(systems, renderer, graphics, assets) {
    'use strict';

    let particlesFood = null;
    let renderAteFood = null;

    function ateFood(xFood, yFood, texture) {
        particlesFood = systems.ParticleSystem({
            center: { x: xFood, y: yFood },
            size: { mean: .01, stdev: .001 },
            speed: { mean: 100, stdev: 25 },
            lifetime: { mean: 2.5, stdev: 1 },
            systemLifetime: 1,
            direction: { max: 2 * Math.PI, min: 0 } ,
            generateNew: true,
            // texture: assets["particle"],
            isThrust: false // TODO: REMOVE THIS!!
        },
        graphics);
    }

    function update(player, elapsedTime, newTexture) {
        if (particlesFood != null) {
            particlesFood.update({ 
                texture: newTexture,
                rotate: true, 
                systemLifetime: null, 
                direction: { max: 2 * Math.PI, min: 0 } 
            }, 
            elapsedTime);
        }
    }

    function render(playerSelfPos) {
        if (particlesFood != null) {
            // renderAteFood;
            // renderer.ParticleSystem(particlesFood, graphics, 'assets/redBody.png').render();
            renderer.ParticleSystem.render(particlesFood, MyGame.assets["particle"], playerSelfPos);
        }
    }

    // function toggleShowThrust() {
    //     if (particlesThrust != null) {
    //         particlesThrust.toggleGenerateNew();
    //     }
    // }

    let api = {
        update: update,
        render: render,
        // toggleShowThrust: toggleShowThrust,
        ateFood: ateFood
    };

    return api;
}(MyGame.systems, MyGame.renderer, MyGame.graphics, MyGame.assets));
