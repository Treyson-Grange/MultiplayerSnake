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

const UPDATE_RATE_MS = 50;
let quit = false;
let activeClients = {};
let inputQueue = [];

let foodCount = 10;
let foodSOA = Food.create(foodCount);
for (let i = 0; i < foodCount; i++) {
    foodSOA.positionsX[i] = random.nextDouble();
}

for (let i = 0; i < foodCount; i++) {
    foodSOA.positionsY[i] = random.nextDouble();
}

// fill sprite sheet indices with random indices; so basically pick random sprite sheet to generate :)
// TODO: PING THE food TO TELL it that it NEEDs TO UPDATE its INDICES!!
for (let i = 0; i < foodSOA.spriteSheetIndices.length; i++) {
    foodSOA.spriteSheetIndices[i] = random.nextRange(0, 6); // amount of sprites is hardcoded 
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
    client.socket.emit("update-food", foodUpdate);

    //
    // Notify all clients about every food sprite that's been instantiated
    let foodSpriteUpdate = {
        spriteSheetIndices: foodSOA.spriteSheetIndices,
    };
    client.socket.emit("food-positions", foodSpriteUpdate);

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

        // let foodUpdate = {
        //     spriteSheetIndices: foodSOA.spriteSheetIndices,
        // };
    
        // socket.emit("food-positions", foodUpdate);
      }
    }
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
  });


  //------------------------------------------------------------------
  //
  // Notifies clients about updates to the food
  //
  //------------------------------------------------------------------

//   function notifyFoodUpdate() {
//     for (let clientId in activeClients) {
//         let client = activeClients[clientId];
  
//         for (let i = 0; i < foodSOA.count; i++) {
//             if (foodSOA.reportUpdates[i]) {
//                 client.socket.emit("update-food", {
//                     index: i,
//                     positionX: foodSOA.positionsX[i],
//                     positionY: foodSOA.positionsY[i],
//                 });
//             }
//         }
//     }
//   }

//   notifyFoodUpdate();
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
