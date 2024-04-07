MyGame.persistence = (function () {
    'use strict';
    
    // High scores
    let highScores = {};

    let previousScores = localStorage.getItem('MyGame.highScores');

    if (previousScores !== null) {
        highScores = JSON.parse(previousScores);
    }

    // Player name
    let playerName = "Anon";

    let previousPlayerName = localStorage.getItem('MyGame.playerName');

    if (previousPlayerName !== null) {
        customControls = JSON.parse(previousPlayerName);
    }

    // High scores functions
    function addScore(key, value) {
        highScores[key] = value;
        localStorage['MyGame.highScores'] = JSON.stringify(highScores);
    }

    function removeScore(key) {
        delete highScores[key];
        localStorage['MyGame.highScores'] = JSON.stringify(highScores);
    }

    function reportScores() {
        let htmlNode = document.getElementById('high-scores-list');
        
        htmlNode.innerHTML = '';
        for (let key in highScores) {
            // htmlNode.innerHTML += ('Key: ' + key + ' Value: ' + highScores[key] + '<br/>'); 
            htmlNode.innerHTML += (highScores[key] + '<br/>'); 
        }

        // Add CSS style to make the scrollbar appear
        htmlNode.style.overflow = 'scroll';

        htmlNode.scrollTop = htmlNode.scrollHeight;
    }

    // Player name functions

    function getPlayerName() {
        // console.log(customControls['up']);
        return playerName;
    }

    function changePlayerName(value) {
        playerName = value;
        console.log(playerName);
        localStorage['MyGame.playerName'] = JSON.stringify(playerName);

                // location.reload();
    }

    return {
        get highScores() { return highScores; },
        addScore : addScore,
        removeScore : removeScore,
        reportScores : reportScores,
        getPlayerName: getPlayerName,
        changePlayerName: changePlayerName,
    };
}());
