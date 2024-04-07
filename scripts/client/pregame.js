MyGame.screens['pre-game'] = (function(game) {
    'use strict';
    
    function initialize() {
        document.getElementById('id-start-game').addEventListener(
            'click',
            function() { game.showScreen('game-play'); });

        document.getElementById('id-keyboard-controlled').addEventListener(
            'click',
            function() { 
                // do persistent shiz here
             }
        );

        document.getElementById('id-mouse-controlled').addEventListener(
            'click',
            function() {
                // do persistent shiz here too
            }
        );
    }
    
    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
