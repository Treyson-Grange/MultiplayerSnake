// ------------------------------------------------------------------
//
// Rendering function for the walls
//
// ------------------------------------------------------------------
MyGame.renderer.Walls = (function (graphics) {
    "use strict";
    let that = {};
    const LEFT_WALL_X = 0;
    const TOP_WALL_Y = 0;
    // ------------------------------------------------------------------
    //
    // Renders the wall
    //
    // ------------------------------------------------------------------
    that.render = function (playerPos, wallSize, WORLD_SIZE, texture) {
        graphics.saveContext();
        let numWall = Math.ceil(1 / wallSize.length) + 3;
        // console.log(numWall);

        let screenPos = {x: playerPos.x - .5, y: playerPos.y - .5}; //top-left corner of screen
        // recall that 0 is screen left, .5 is screen center, and 1 is screen right.

        // render left wall if in render dist
        if ( screenPos.x < LEFT_WALL_X + (wallSize.width/2)){
            for (let i = 0; i < numWall; i++) {
                let wallY = (-screenPos.y % wallSize.length) + wallSize.length * i - wallSize.length;
                let wallX = 0 - screenPos.x;
                let center = {x: wallX, y: wallY};
                graphics.drawImage(texture, center, {height: wallSize.length, width:wallSize.width});
            }
        }

        // render right wall if in render dist
        if ((WORLD_SIZE - (wallSize.width/2)) - screenPos.x < 1){
            for (let i = 0; i < numWall; i++) {
                let wallY = (-playerPos.y % wallSize.length) + wallSize.length * i - wallSize.length;
                let wallX = WORLD_SIZE - screenPos.x;
                let center = {x: wallX, y: wallY};
                graphics.drawImage(texture, center, {height: wallSize.length, width:wallSize.width});
            }
        }

        graphics.rotateCanvas({x:0,y:0,}, Math.PI/2)

        // render top wall if in render dist
        if ( screenPos.y < TOP_WALL_Y + (wallSize.width/2)){
            for (let i = 0; i < numWall; i++) {
                let wallY = (screenPos.x % wallSize.length) + wallSize.length * i - wallSize.length - 1;
                let wallX = 0 - screenPos.y;
                let center = {x: wallX, y: wallY};
                graphics.drawImage(texture, center, {height: wallSize.length, width:wallSize.width});
            }
        }

        // render bottom wall if in render dist
        if ((WORLD_SIZE - (wallSize.width/2)) - screenPos.y < 1){
            for (let i = 0; i < numWall; i++) {
                let wallY = (playerPos.x % wallSize.length) + wallSize.length * i - wallSize.length -1 ;
                let wallX = WORLD_SIZE - screenPos.y;
                let center = {x: wallX, y: wallY};
                graphics.drawImage(texture, center, {height: wallSize.length, width:wallSize.width});
            }
        }


        graphics.restoreContext();
    };
    return that;
})(MyGame.graphics);
  