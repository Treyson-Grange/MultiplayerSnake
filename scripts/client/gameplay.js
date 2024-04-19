//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.screens["game-play"] = (function (
  game,
  components,
  renderer,
  graphics,
  input,
  persistence,
  objects
) {
  "use strict";

  console.log(components.PlayerRemote());
  console.log(components.Player());
  console.log(components.Food());

  const WORLD_SIZE = 4; // Both x and y

  let game_over = false;
  let canvas = document.getElementById("canvas-main");
  let otherPlayerName;
  let lastTimeStamp = performance.now(),
    cancelNextRequest = true,
    myKeyboard = input.Keyboard(),
    playerSelf = {
      model: components.Player(),
      texture: MyGame.assets["player-self"],
    },
    playerOthers = {},
    endText = MyGame.objects.Text({
      text: "Game Over!",
      font: "25pt Arial",
      fillStyle: "#FFFFFF",
      strokeStyle: "#000000",
      position: { x: 0.35, y: 0.3 },
      player: false,
    }),
    playerName = MyGame.objects.Text({
      text: "Player Name",
      font: "10pt Arial",
      fillStyle: "#FFFFFF",
      strokeStyle: "#FFFFFF",
      position: { x: 0.5, y: 0.45 },
      player: true,
    }),
    buttonText = MyGame.objects.Text({
      text: "Next",
      font: "25pt Arial",
      fillStyle: "#FFFFFF",
      strokeStyle: "#000000",
      position: { x: 0.45, y: 0.67 },
    }),
    endButton = MyGame.objects.Button({
      imageSrc: "assets/green_button.png",
      size: { width: 0.2, height: 0.12 },
      center: { x: 0.51, y: 0.7 },
      canvas: canvas,
    }),
    food = {
      model: components.Food(),
      texture: [
        MyGame.assets["food0"],
        MyGame.assets["food1"],
        MyGame.assets["food2"],
        MyGame.assets["food3"],
        MyGame.assets["food4"],
        MyGame.assets["food5"],

      ],
      bigTexture: [
        MyGame.assets["food0Big"],
        MyGame.assets["food1Big"],
        MyGame.assets["food2Big"],
        MyGame.assets["food3Big"],
        MyGame.assets["food4Big"],
        MyGame.assets["food5Big"],
      ],

    },
    messageHistory = MyGame.utilities.Queue(),
    messageId = 1,
    socket = io();

  //------------------------------------------------------------------
  //
  // Handler for when the server ack's the socket connection.  We receive
  // the state of the newly connected player
  //
  //------------------------------------------------------------------
  socket.on("connect-ack", function (data) {
    playerSelf.model.position.x = data.position.x;
    playerSelf.model.position.y = data.position.y;

    playerSelf.model.size.x = data.size.x;
    playerSelf.model.size.y = data.size.y;

    playerSelf.model.direction = data.direction;
    playerSelf.model.speed = data.speed;
    playerSelf.model.rotateRate = data.rotateRate;
  });

  socket.on("game-over", function () {
    game_over = true;
    endButton.makeActive();
  });

  //------------------------------------------------------------------
  //
  // Handler for when a new player connects to the game.  We receive
  // the state of the newly connected player model.
  //
  //------------------------------------------------------------------
  socket.on("connect-other", function (data) {
    let model = components.PlayerRemote();
    console.log("MODEL IS: ", model);
    console.log("COMPONENTS.PLAYERREMOTE() IS: ", components.PlayerRemote());
    model.state.position.x = data.position.x;
    model.state.position.y = data.position.y;
    model.state.direction = data.direction;

    model.goal.position.x = data.position.x;
    model.goal.position.y = data.position.y;
    model.goal.direction = data.direction;
    model.goal.updateWindow = 0;

    model.size.x = data.size.x;
    model.size.y = data.size.y;

    playerOthers[data.clientId] = {
      model: model,
      texture: MyGame.assets["player-other"],
    };
  });

  //------------------------------------------------------------------
  //
  // Handler for when another player disconnects from the game.
  //
  //------------------------------------------------------------------
  socket.on("disconnect-other", function (data) {
    delete playerOthers[data.clientId];
  });

  //------------------------------------------------------------------
  //
  // Handler for receiving state updates about the self player.
  //
  //------------------------------------------------------------------
  socket.on("update-self", function (data) {
    playerSelf.model.position.x = data.position.x;
    playerSelf.model.position.y = data.position.y;
    playerSelf.model.direction = data.direction;

    //
    // Remove messages from the queue up through the last one identified
    // by the server as having been processed.
    let done = false;
    while (!done && !messageHistory.empty) {
      if (messageHistory.front.id === data.lastMessageId) {
        done = true;
      }
      //console.log('dumping: ', messageHistory.front.id);
      messageHistory.dequeue();
    }

    //
    // Update the client simulation since this last server update, by
    // replaying the remaining inputs.
    let memory = MyGame.utilities.Queue();
    while (!messageHistory.empty) {
      let message = messageHistory.dequeue();
      switch (message.type) {
        case "move":
          playerSelf.model.move(message.elapsedTime);
          break;
        case "up":
          playerSelf.model.goUp(message.elapsedTime);
          break;
        case "right":
          playerSelf.model.goRight(message.elapsedTime);
          break;
        case "left":
          playerSelf.model.goLeft(message.elapsedTime);
          break;
        case "down":
          playerSelf.model.goDown(message.elapsedTime);
          break;
      }
      memory.enqueue(message);
    }
    messageHistory = memory;
  });

  //------------------------------------------------------------------
  //
  // Handler for receiving state updates about other players.
  //
  //------------------------------------------------------------------
  socket.on("update-other", function (data) {
    if (playerOthers.hasOwnProperty(data.clientId)) {
      let model = playerOthers[data.clientId].model;
      model.goal.updateWindow = data.updateWindow;

      model.goal.position.x = data.position.x;
      model.goal.position.y = data.position.y;
      model.goal.direction = data.direction;
    }
  });

  //------------------------------------------------------------------
  //
  // Handlers for receiving state updates about food sprites.
  //
  //------------------------------------------------------------------
  socket.on("food-initial", function (data) {
    food.model.updateSprites(data);
    // for (let i = 0; i < data.eaten.length; i++) {
    //     food.model.update(i, data.eaten[i]);
    // }
  });

  //------------------------------------------------------------------
  //
  // Handler for receiving state updates about food.
  //
  //------------------------------------------------------------------
  socket.on("food-update", function (data) {
    // for (let i = 0; i < data.eaten.length; i++) {
    food.model.update(data);
    // }
  });

  //------------------------------------------------------------------
  //
  // Process the registered input handlers here.
  //
  //------------------------------------------------------------------
  function processInput(elapsedTime) {
    myKeyboard.update(elapsedTime);
  }

  //------------------------------------------------------------------
  //
  // Update the game simulation
  //
  //------------------------------------------------------------------
  function update(elapsedTime) {
    let message = {
      //makes it automatically move
      id: messageId++,
      elapsedTime: elapsedTime,
      type: "move",
    };
    socket.emit("input", message);
    messageHistory.enqueue(message);
    playerSelf.model.move(elapsedTime);
    playerSelf.model.update(elapsedTime);
    for (let id in playerOthers) {
      playerOthers[id].model.update(elapsedTime);
    }
    for (let id in segments) {
      segments[id].model.update(elapsedTime, playerSelf.model.turnPoints);
    }
    food.model.updateRenderFrames(elapsedTime); // increment the render frame on each sprite so it's animated
  }

  //------------------------------------------------------------------
  //
  // Render the current state of the game simulation
  //
  //------------------------------------------------------------------
  let segments = [];
  function render() {
    graphics.clear();

    renderer.Background.render(
      playerSelf.model.position,
      { height: 0.75, width: 0.75 },
      MyGame.assets["tile"]
    );
    renderer.Walls.render(
      playerSelf.model.position,
      { length: 0.5, width: 0.1 },
      WORLD_SIZE,
      MyGame.assets["wall"]
    );

    renderer.Player.render(playerSelf.model, playerSelf.texture);
    if (!game_over) {
      renderer.Text.render(playerName);
    }

    for (let id in playerOthers) {
      let otherPlayer = playerOthers[id];
      otherPlayerName = MyGame.objects.Text({
        text: otherPlayer.model.name,
        font: "10pt Arial",
        fillStyle: "#FFFFFF",
        strokeStyle: "#FFFFFF",
        position: {
          x: otherPlayer.model.goal.position.x,
          y: otherPlayer.model.goal.position.y - 0.1,
        },
        player: true,
      });
      // renderer.Text.render(otherPlayerName);
      renderer.PlayerRemote.render(
        otherPlayer.model,
        MyGame.assets["player-other"],
        playerSelf.model.position
      );
    }
    renderer.Food.render(
      food.model,
      food.texture,
      food.bigTexture,
      playerSelf.model.position,
      WORLD_SIZE
    );
    if (game_over) {
        graphics.drawImage(MyGame.assets["panelDark"], { x: .5, y: .5 }, { width: 1, height: 0.5 });
        renderer.Text.render(endText);
        renderer.Button.render(endButton);
        renderer.Text.render(buttonText);
        if (endButton.clicked) {
            game_over = false;
            cancelNextRequest = true;
            game.showScreen('main-menu');
        }
    }

    segments = playerSelf.model.getSegments();
    // console.log(segments);
    for (let id in segments) {
      renderer.Body.render(
        segments[id].model,
        segments[id].texture,
        segments[id].model.state,
    );
    //   renderer.PlayerRemote.render(segments[id].model, segments[id].texture, playerSelf.position);
    }
  }

  //------------------------------------------------------------------
  //
  // Client-side game loop
  //
  //------------------------------------------------------------------
  function gameLoop(time) {
    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;

    processInput(elapsedTime);
    update(elapsedTime);
    render();

    if (!cancelNextRequest) {
      requestAnimationFrame(gameLoop);
    }
  }

  function updatePlayers() {
    playerSelf.texture = MyGame.assets["player-self"];
  }

  function updateFood() {
    food.texture = [
      MyGame.assets["food0"],
      MyGame.assets["food1"],
      MyGame.assets["food2"],
      MyGame.assets["food3"],
      MyGame.assets["food4"],
      MyGame.assets["food5"],

    ];
    food.bigTexture = [
      MyGame.assets["food0Big"],
      MyGame.assets["food1Big"],
      MyGame.assets["food2Big"],
      MyGame.assets["food3Big"],
      MyGame.assets["food4Big"],
      MyGame.assets["food5Big"],
    ];
  }

  //----------------------------------------------------------------
  //
  // Function used to get the user's player control keys registered
  //
  //----------------------------------------------------------------
  function registerKeys() {
    // Create the keyboard input handler and register the keyboard commands
    myKeyboard.registerHandler(
      (elapsedTime) => {
        let message = {
          id: messageId++,
          elapsedTime: elapsedTime,
          type: "test",
        };
        socket.emit("input", message);
        messageHistory.enqueue(message);
        playerSelf.model.rotateRight(elapsedTime);
      },
      "t",
      true
    );
    myKeyboard.registerHandler(
      (elapsedTime) => {
        let message = {
          id: messageId++,
          elapsedTime: elapsedTime,
          type: "up",
        };
        socket.emit("input", message);
        messageHistory.enqueue(message);
        playerSelf.model.goUp(elapsedTime, messageHistory, socket);
      },
      persistence.getMoveUp(),
      true
    );
    myKeyboard.registerHandler(
      (elapsedTime) => {
        let message = {
          id: messageId++,
          elapsedTime: elapsedTime,
          type: "right",
        };
        socket.emit("input", message);
        messageHistory.enqueue(message);
        playerSelf.model.goRight(elapsedTime, messageHistory, socket);
      },
      persistence.getMoveRight(),
      true
    );

    myKeyboard.registerHandler(
      (elapsedTime) => {
        let message = {
          id: messageId++,
          elapsedTime: elapsedTime,
          type: "left",
        };
        socket.emit("input", message);
        messageHistory.enqueue(message);
        playerSelf.model.goLeft(elapsedTime, messageHistory, socket);
      },
      persistence.getMoveLeft(),
      true
    );
    myKeyboard.registerHandler(
      (elapsedTime) => {
        let message = {
          id: messageId++,
          elapsedTime: elapsedTime,
          type: "down",
        };
        socket.emit("input", message);
        messageHistory.enqueue(message);
        playerSelf.model.goDown(elapsedTime, messageHistory, socket);
      },
      persistence.getMoveDown(),
      true
    );


    myKeyboard.registerHandler(
      (elapsedTime) => {
        let message = {
          id: messageId++,
          elapsedTime: elapsedTime,
          type: "addBodyPart",
        };
        socket.emit("input", message);
        messageHistory.enqueue(message);
        playerSelf.model.addBodyPart(elapsedTime);
      },
      "q",
      true
    );
  }

  //------------------------------------------------------------------
  //
  // Public function used to get the game initialized and then up
  // and running.
  //
  //------------------------------------------------------------------
  function initialize() {
    console.log("game initializing...");

    //
    // Stop the game loop by canceling the request for the next animation frame
    cancelNextRequest = true;
    //
    // Then, return to the main menu
    game.showScreen("main-menu");
  }

  function run() {
    if (persistence.getPlayerName() == "") {
      playerName.updateText("Player");
    } else {
      playerName.updateText(persistence.getPlayerName());
    }

    registerKeys();
    lastTimeStamp = performance.now();
    cancelNextRequest = false;
    // TODO: REFRESH THE PLAYER'S POSITION, LENGTH, ETC.
    endButton.refresh();
    requestAnimationFrame(gameLoop);
  }

  return {
    initialize: initialize,
    run: run,
    updatePlayers: updatePlayers,
    updateFood: updateFood,
  };
})(
  MyGame.game,
  MyGame.components,
  MyGame.renderer,
  MyGame.graphics,
  MyGame.input,
  MyGame.persistence,
  MyGame.objects
);
