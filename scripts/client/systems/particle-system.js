//------------------------------------------------------------------
//
// This is the particle system use by the game code
//
//------------------------------------------------------------------
MyGame.systems.ParticleSystem = function(spec) {
    'use strict';

    let nextName = 1;       // Unique identifier for the next particle
    let particles = {};
    let systemLifetime = spec.systemLifetime;
    let generateNew = spec.generateNew;
    let isThrust = spec.isThrust;
    let center = { x: spec.center.x, y: spec.center.y };

    //------------------------------------------------------------------
    //
    // This creates one new particle
    //
    //------------------------------------------------------------------
    function create() {
        let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
        let p = {
            center: {x: center.x, y: center.y},
            size: { x: size, y: size },
            direction: Random.nextCircleVector(spec.direction.max, spec.direction.min),
            speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
            rotation: 0,
            lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),    // How long the particle should live, in seconds
            alive: 0    // How long the particle has been alive, in seconds
        };

        return p;
    }

    //------------------------------------------------------------------
    //
    // This changes the value of generateNew to true
    //
    //------------------------------------------------------------------
    function toggleGenerateNew() {
        generateNew = true;
    }

    //------------------------------------------------------------------
    //
    // Update the state of all particles.  This includes removing any that have exceeded their lifetime.
    //
    //------------------------------------------------------------------
    function update(updateSpec, elapsedTime) {
        spec.direction.max = updateSpec.direction.max;
        spec.direction.min = updateSpec.direction.min;

        let removeMe = [];

        //
        // We work with time in seconds, elapsedTime comes in as milliseconds
        elapsedTime = elapsedTime / 1000;

        Object.getOwnPropertyNames(particles).forEach(function(value, index, array) {
            let particle = particles[value];
            //
            // Update how long it has been alive
            particle.alive += elapsedTime;

            //
            // Update its center
            particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime * particle.speed * particle.direction.y);


            //
            // Rotate proportional to its speed
            if (updateSpec.rotate) {
                particle.rotation += particle.speed / 500;
            }

            //
            // If the lifetime has expired, identify it for removal
            if (particle.alive > particle.lifetime) {
                removeMe.push(value);
            }
        });

        //
        // Remove all of the expired particles
        for (let particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;

        //
        // If the generator hasn't run out of time to generate new particles, and the spaceship is moving:
        if (systemLifetime > 0 && generateNew) {
            //
            // Generate some new particles
            for (let particle = 0; particle < 1; particle++) {
                //
                // Assign a unique name to each particle
                particles[nextName++] = create();
            }
        }

        if (updateSpec.systemLifetime == null) {
            systemLifetime -= elapsedTime;
        } else {
            systemLifetime = updateSpec.systemLifetime;
        }

        if (isThrust && generateNew) {
            generateNew = false;
        }
    }

    let api = {
        update: update,
        toggleGenerateNew: toggleGenerateNew,
        get generateNew() { return generateNew; },
        get particles() { return particles; },
        get systemLifetime() { return systemLifetime; },
        get center() { return center; },
    };

    return api;
}
