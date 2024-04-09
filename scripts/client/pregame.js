MyGame.screens['pre-game'] = (function(game, persistence) {
    'use strict';
    
    function initialize() {
        document.getElementById('id-start-game').addEventListener(
            'click',
            function() { 
                let inputName = document.getElementById('id-input-name').value;
                console.log("name is: ", inputName);
                persistence.changePlayerName(inputName); // TODO: GET THIS SENT TO THE SERVER?
                game.showScreen('game-play'); 
            });
    }
    
    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game, MyGame.persistence));
