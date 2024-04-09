MyGame.screens['custom-control'] = (function(game, persistence) {
    'use strict';

    persistence.reportCustomControls();

    function keydownHandler(action, event) {
        // Prevent default action of the key press (e.g., scrolling)
        event.preventDefault();

        // Store the key in local storage
        persistence.changeCustomControl(action, event.key);

        // Remove the event listener to prevent further key presses from being captured
        document.removeEventListener("keydown", keydownHandler);
    }

    function setControl(action) {
        document.addEventListener("keydown", (event) => {
            keydownHandler(action, event);
        }, {once: true}); // This ensures the event listener is removed after the first keydown event
    }
    
    function initialize() {
        document.getElementById('id-custom-control-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); }
        );

        document.getElementById('id-custom-control-move-left').addEventListener('click', function() { 
            setControl("left"); 
        });

        document.getElementById('id-custom-control-move-right').addEventListener('click', function() { 
            setControl("right"); 
        });

        document.getElementById('id-custom-control-move-up').addEventListener('click', function() { 
            setControl("up"); 
        });

        document.getElementById('id-custom-control-move-down').addEventListener('click', function() { 
            setControl("down"); 
        });
    }
    
    function run() {
        // lastTimeStamp = performance.now();
        // cancelNextRequest = false;
        // requestAnimationFrame(gameLoop);
    }
    
    return {
        initialize : initialize,
        run : run,
        // get moveLeft() { return moveLeft; },
        // get moveRight() { return moveRight; },
        // get moveUp() { return moveUp; },
        // get moveDown() { return moveDown; },
    };
}(MyGame.game, MyGame.persistence));
