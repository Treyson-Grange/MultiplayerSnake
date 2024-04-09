MyGame.input.Controls = function () {
    
    // let turnLeft = 'a';
    // let turnRight = 'd';
    // let moveUp = 'w';

    function changeMoveLeft(key, persistence) {
        persistence.changeCustomControl('left', key);
        // turnLeft = key;
    }

    function changeMoveRight(key, persistence) {
        persistence.changeCustomControl('right', key);
        // turnRight = key;
    }

    function changeMoveUp(key, persistence) {
        persistence.changeCustomControl('up', key);
        // moveUp = key;
    }

    function changeMoveDown(key, persistence) {
        persistence.changeCustomControl('down', key);
    }

    let api = {
        // get turnLeft() { return turnLeft; },
        // get moveRight() { return turnRight; },
        // get moveUp() { return moveUp; },
        changeMoveLeft: changeMoveLeft,
        changeMoveRight: changeMoveRight,
        changeMoveUp: changeMoveUp,
        changeMoveDown: changeMoveDown
    };

    return api;

};