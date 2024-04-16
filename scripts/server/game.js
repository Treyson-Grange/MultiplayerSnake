// ------------------------------------------------------------------
//
// Nodejs module that provides the server-side game model.
//
// ------------------------------------------------------------------
"use strict";

let present = require("present");
let random = require("./random");
let Player = require("./player");
let Food = require("./food");

const WORLD_SIZE = 4; // Both x and y
const WALL_SIZE = { length: .5, width: .1};

const UPDATE_RATE_MS = 50;
let quit = false;
let activeClients = {};
let inputQueue = [];

let foodCount = 100;

let foodSOA = Food.create(foodCount);
for (let i = 0; i < foodCount; i++) {
    foodSOA.positionsX[i] = random.nextDouble() * 4; // 4 becauase the map size is 4
}

for (let i = 0; i < foodCount; i++) {
    foodSOA.positionsY[i] = random.nextDouble() * 4;
}

let bigFood = new Array(foodCount).fill(false);
for (let i = 0; i < foodCount; i++) {
    if (i % 2 == 0) {
        bigFood[i] = true;
    }
}

// fill sprite sheet indices with random indices; so basically pick random sprite sheet to generate :)
// TODO: PING THE food TO TELL it that it NEEDs TO UPDATE its INDICES!!
for (let i = 0; i < foodSOA.spriteSheetIndices.length; i++) {
    foodSOA.spriteSheetIndices[i] = random.nextRange(0, 5); // amount of sprites is hardcoded 
}

//------------------------------------------------------------------
//
// Utility function to perform a hit test between player and food.  The
// objects must have a position: { x: , y: } property and radius property.
//
//------------------------------------------------------------------
function playerFoodCollided(player, food) {
    let distance = Math.sqrt(Math.pow(player.position.x - food.position.x, 2) + Math.pow(player.position.y - food.position.y, 2));
    let radii = player.radius + food.radius;

    return distance <= radii;
}

//------------------------------------------------------------------
//
// Utility function to perform a hit test between player and wall.  The
// objects must have a position: { x: , y: } property
//
//------------------------------------------------------------------
function playerWallCollided(playerPos) {
    let hitWall = false;

    let halfWallWidth = WALL_SIZE.width / 2;
    
    if (playerPos.x < (0 + halfWallWidth) || playerPos.x > (WORLD_SIZE - halfWallWidth)){
        hitWall = true;
    } else if (playerPos.y < (0 + halfWallWidth) || playerPos.y > (WORLD_SIZE - halfWallWidth)) {
        hitWall = true;
    }

    return hitWall;
}

//------------------------------------------------------------------
//
// Process the network inputs we have received since the last time
// the game loop was processed.
//
//------------------------------------------------------------------
function processInput() {
  //
  // Double buffering on the queue so we don't asynchronously receive inputs
  // while processing.
  let processMe = inputQueue;
  inputQueue = [];

  for (let inputIndex in processMe) {
    let input = processMe[inputIndex];
    let client = activeClients[input.clientId];
    if (client === undefined) {
      //Since it is possible that there is still input in the queue for a client that has disconnected we need to check heres
      continue;
    }
    client.lastMessageId = input.message.id;
    switch (input.message.type) {
      case "move":
        client.player.move(input.message.elapsedTime);
        break;
      case "up":
        client.player.goUp(input.message.elapsedTime);
        break;
      case "down":
        client.player.goDown(input.message.elapsedTime);
        break;
      case "right":
        client.player.goRight(input.message.elapsedTime);
        break;
      case "left":
        client.player.goLeft(input.message.elapsedTime);
        break;
      case "test":
        client.player.goRight(input.message.elapsedTime);
        break;
    }
  }
}

//------------------------------------------------------------------
//
// Update the simulation of the game.
//
//------------------------------------------------------------------
function update(elapsedTime, currentTime) {
  for (let clientId in activeClients) {
    activeClients[clientId].player.update(currentTime);
  }
  // for every player
  for (let clientId in activeClients) {
    let client = activeClients[clientId];
    let player = client.player;

    // check for player v food collisions
    for (let i = 0; i < foodSOA.positionsX.length; i++) {
        let foodSize = foodSOA.size;

        // update the size to be bigger if it's a piece of big food
        if (foodSOA.bigFood[i]) {
            foodSize = foodSOA.size;
        }
        
        // create food obj for collision detection
        let foodPiece = {
            radius: foodSize.width / 2,
            position: { x: foodSOA.positionsX[i], y: foodSOA.positionsY[i] },
        };

        let playerSpec = {
            radius: player.size.width / 2,
            position: player.position
        };

        // check for collision
        if (playerFoodCollided(playerSpec, foodPiece)) {
            console.log("a collision!");
        }
    }

    // check for player v wall collisions
    if (playerWallCollided({ x: player.position.x, y: player.position.y })) {
        console.log("hit a wall!");
    }
  }



  // check for player v wall collisions

}

//------------------------------------------------------------------
//
// Send state of the game to any connected clients.
//
//------------------------------------------------------------------
function updateClients(elapsedTime) {
  for (let clientId in activeClients) {
    let client = activeClients[clientId];
    let update = {
      clientId: clientId,
      lastMessageId: client.lastMessageId,
      direction: client.player.direction,
      position: client.player.position,
      updateWindow: elapsedTime,
    };
    if (client.player.reportUpdate) {
      client.socket.emit("update-self", update);

      //
      // Notify all other connected clients about every
      // other connected client status...but only if they are updated.
      for (let otherId in activeClients) {
        if (otherId !== clientId) {
          activeClients[otherId].socket.emit("update-other", update);
        }
      }
    }

    //
    // Notify all clients about every food that's been updated
    let foodUpdate = {
        reportUpdates: foodSOA.reportUpdates,
        positionsX: foodSOA.positionsX,
        positionsY: foodSOA.positionsY,
        count: foodSOA.count,
        spriteSheetIndices: foodSOA.spriteSheetIndices,
    };
    client.socket.emit("food-update", foodUpdate);
  }

  for (let clientId in activeClients) {
    activeClients[clientId].player.reportUpdate = false;
  }
}

//------------------------------------------------------------------
//
// Server side game loop
//
//------------------------------------------------------------------
function gameLoop(currentTime, elapsedTime) {
  processInput();
  update(elapsedTime, currentTime);
  updateClients(elapsedTime);

  if (!quit) {
    setTimeout(() => {
      let now = present();
      gameLoop(now, now - currentTime);
    }, UPDATE_RATE_MS);
  }
}

//------------------------------------------------------------------
//
// Get the socket.io server up and running so it can begin
// collecting inputs from the connected clients.
//
//------------------------------------------------------------------
function initializeSocketIO(httpServer) {
  let io = require("socket.io")(httpServer);

  //------------------------------------------------------------------
  //
  // Notifies the already connected clients about the arrival of this
  // new client.  Plus, tell the newly connected client about the
  // other players already connected. Plus, tell the newly connected client about the food.
  //
  //------------------------------------------------------------------
  function notifyConnect(socket, newPlayer) {
    for (let clientId in activeClients) {
      let client = activeClients[clientId];
      if (newPlayer.clientId !== clientId) {
        //
        // Tell existing about the newly connected player
        client.socket.emit("connect-other", {
          clientId: newPlayer.clientId,
          direction: newPlayer.direction,
          position: newPlayer.position,
          rotateRate: newPlayer.rotateRate,
          speed: newPlayer.speed,
          size: newPlayer.size,
        });

        //
        // Tell the new player about the already connected player
        socket.emit("connect-other", {
          clientId: client.player.clientId,
          direction: client.player.direction,
          position: client.player.position,
          rotateRate: client.player.rotateRate,
          speed: client.player.speed,
          size: client.player.size,
        });
      }
    }
  }

    //
    // Tell the new player about the food
    function notifyNewPlayerFood(newPlayer) {
        let client = activeClients[newPlayer.clientId];
        let foodSpriteUpdate = {
            spriteSheetIndices: foodSOA.spriteSheetIndices,
            bigFood: bigFood,
        };
        client.socket.emit("food-initial", foodSpriteUpdate);
    }


  //------------------------------------------------------------------
  //
  // Notifies the already connected clients about the disconnect of
  // another client.
  //
  //------------------------------------------------------------------
  function notifyDisconnect(playerId) {
    for (let clientId in activeClients) {
      let client = activeClients[clientId];
      if (playerId !== clientId) {
        client.socket.emit("disconnect-other", {
          clientId: playerId,
        });
      }
    }
  }

  io.on("connection", function (socket) {
    console.log("Connection established: ", socket.id);
    //
    // Create an entry in our list of connected clients
    let newPlayer = Player.create();
    newPlayer.clientId = socket.id;
    activeClients[socket.id] = {
      socket: socket,
      player: newPlayer,
    };
    socket.emit("connect-ack", {
      direction: newPlayer.direction,
      position: newPlayer.position,
      size: newPlayer.size,
      rotateRate: newPlayer.rotateRate,
      speed: newPlayer.speed,
    });

    socket.on("input", (data) => {
      inputQueue.push({
        clientId: socket.id,
        message: data,
      });
    });

    socket.on("disconnect", function () {
      delete activeClients[socket.id];
      notifyDisconnect(socket.id);
    });

    notifyConnect(socket, newPlayer);
    notifyNewPlayerFood(newPlayer);
  });

}






//------------------------------------------------------------------
//
// Entry point to get the game started.
//
//------------------------------------------------------------------
function initialize(httpServer) {
  initializeSocketIO(httpServer);
  gameLoop(present(), 0);
}

//------------------------------------------------------------------
//
// Public function that allows the game simulation and processing to
// be terminated.
//
//------------------------------------------------------------------
function terminate() {
  this.quit = true;
}

module.exports.initialize = initialize;
