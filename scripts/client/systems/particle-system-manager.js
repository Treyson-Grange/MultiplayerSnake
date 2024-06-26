//------------------------------------------------------------------
//
// This is the particle system use by the game code
//
//------------------------------------------------------------------
MyGame.systems.ParticleSystemManager = (function(systems, renderer, graphics, assets) {
    'use strict';

    let particlesFood = null;

    let particlesHead = null;

    function ateFood(xFood, yFood) {
        particlesFood = systems.ParticleSystem({
            center: { x: xFood, y: yFood }, // TODO: USE INPUT X,Y AGAIN?
            size: { mean: .04, stdev: .01 },
            speed: { mean: 30, stdev: 5 },
            lifetime: { mean: .3, stdev: .01 },
            systemLifetime: .1,
            direction: { max: 2 * Math.PI, min: 0 } ,
            generateNew: true,
            isThrust: false // TODO: REMOVE THIS!!
        },
        graphics);
    }

    function playerDeath(xPlayer, yPlayer) {
        particlesHead = systems.ParticleSystem({
            center: { x: xPlayer, y: yPlayer },
            size: { mean: .02, stdev: .01 },
            speed: { mean: 40, stdev: 5 },
            lifetime: { mean: 1, stdev: .02 },
            systemLifetime: .1,
            direction: { max: 2 * Math.PI, min: 0 } ,
            generateNew: true,
            isThrust: false // TODO: REMOVE THIS!!
        },
        graphics);
    }

    function update(elapsedTime, canvasSize) {
        if (particlesFood != null) {
            particlesFood.update({ 
                rotate: true, 
                systemLifetime: null, 
                direction: { max: 2 * Math.PI, min: 0 } 
            }, 
            elapsedTime, canvasSize);
        }
        if (particlesHead != null) {
            particlesHead.update({
                rotate: true,
                systemLifetime: null,
                direction: { max: 2 * Math.PI, min: 0 } 
            },
            elapsedTime, canvasSize);
        }
    }

    function render(playerSelfPos) {
        if (particlesFood != null) {
            renderer.ParticleSystem.render(particlesFood, MyGame.assets["particle"], playerSelfPos);
        }
        if (particlesHead != null) {
            renderer.ParticleSystem.render(particlesHead, MyGame.assets["particleHead"], playerSelfPos);
        }
    }

    let api = {
        update: update,
        render: render,
        ateFood: ateFood,
        playerDeath: playerDeath,
    };

    return api;
}(MyGame.systems, MyGame.renderer, MyGame.graphics, MyGame.assets));
