// ------------------------------------------------------------------
//
// Rendering function for the walls
//
// ------------------------------------------------------------------
MyGame.renderer.Walls = (function (graphics) {
    "use strict";
    let that = {};
    const RENDER_DIST = .04
    const LEFT_WALL_X = 0;
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
        // 0 is the position of the left wall and 1 is the size of the screen
        if ( screenPos.x < LEFT_WALL_X + wallSize.width){
            for (let i = 0; i < numWall; i++) {
                let wallY = (-screenPos.y % wallSize.length) + wallSize.length * i - wallSize.length;
                let wallX = 0 - screenPos.x;
                let center = {x: wallX, y: wallY};
                console.log(center);
                graphics.drawImage(texture, center, {height: wallSize.length, width:wallSize.width});
            }
        }

        // render right wall if in render dist
        if (WORLD_SIZE - playerPos.x < RENDER_DIST){
            for (let i = 0; i < numWall; i++) {
                let wallY = (-playerPos.y % wallSize.length) + wallSize.length * i - wallSize.length;
                let wallX = WORLD_SIZE - playerPos.x;
                let center = {x: wallX, y: wallY};
                console.log(center);
                graphics.drawImage(texture, center, {height: wallSize.length, width:wallSize.width});
            }
        }
        graphics.restoreContext();
    };
    return that;
})(MyGame.graphics);
  