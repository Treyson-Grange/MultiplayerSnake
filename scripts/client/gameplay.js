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
  systems
) {
  "use strict";

  const WORLD_SIZE = 4; // Both x and y
  const DEBUG = false;
  let arrScores = [];
  let allPlayerNames = {};
  let game_over = false;
  let score_added = false;
  let strPlayerName = "";
  let canvas = document.getElementById("canvas-main");
  let otherPlayerName;
  let playedEndSound = false;
  let hitHeadParticles = false;
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
      font: "30pt Arial",
      fillStyle: "#FFFFFF",
      strokeStyle: "#000000",
      position: { x: 0.35, y: 0.25 },
      player: false,
    }),
    scoreText = MyGame.objects.Text({
      text: "Score: ",
      font: "20pt Arial",
      fillStyle: "#FFFFFF",
      position: { x: 0.35, y: 0.35 },
    }),
    killsText = MyGame.objects.Text({
      text: "Kills: ",
      font: "20pt Arial",
      fillStyle: "#FFFFFF",
      position: { x: 0.35, y: 0.45 },
    }),
    topPosText = MyGame.objects.Text({
      text: "Top Position: ",
      font: "20pt Arial",
      fillStyle: "#FFFFFF",
      position: { x: 0.35, y: 0.55 },
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
      text: "Main Menu",
      font: "25pt Arial",
      fillStyle: "#FFFFFF",
      strokeStyle: "#000000",
      position: { x: 0.4, y: 0.67 },
    }),
    endButton = MyGame.objects.Button({
      imageSrc: "assets/green_button.png",
      size: { width: 0.35, height: 0.12 },
      center: { x: 0.54, y: 0.7 },
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
    particleManager = systems.ParticleSystemManager, // TODO: tell gameplay when a food is hit so that this fires particles at that spot
    soundSystem = systems.SoundSystem,
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

  socket.on("updatePlayerNames", function (playerNames) {
    allPlayerNames = playerNames;
  });

  socket.on("add-body-part", function (data) {
    playerSelf.model.addBodyPart();
  });

  socket.on("add-body-other", function (data) {
    if (playerOthers.hasOwnProperty(data.clientId)) {
      let model = playerOthers[data.clientId].model;
      if (data.hasOwnProperty("numParts")) {
        while (model.segments.length < data.numParts) {
          model.addBodyPart();
        }
      } else {
        model.addBodyPart();
      }

    }
  });

  socket.on("remove-body-other", function (data) {
    if (playerOthers.hasOwnProperty(data.otherId)) {
      let model = playerOthers[data.otherId].model;
      model.removeSegment(data.partIndex);
    }
  });

  socket.on("remove-full-body-other", function (otherId) {
    if (playerOthers.hasOwnProperty(otherId)) {
      let model = playerOthers[otherId].model;
      model.removeAllSegments();
      model.visible = false;
    }
  });

  socket.on("player-visible", function (otherId) {
    if (playerOthers.hasOwnProperty(otherId)) {
      let model = playerOthers[otherId].model;
      model.visible = true;
    }
  });

  socket.on("game-over", function () {
    game_over = true;
    endButton.makeActive();
    playerSelf.isActive = false; // tell the player they aren't alive anymore
  });

  socket.on("remove-segment", function (data) {
    playerSelf.model.removeSegment(data);
  });

  //------------------------------------------------------------------
  //
  // Handler for when a new player connects to the game.  We receive
  // the state of the newly connected player model.
  //
  //------------------------------------------------------------------
  socket.on("connect-other", function (data) {
    let model = components.PlayerRemote();
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
    delete allPlayerNames[data.clientId];
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

  socket.on("update-scores", function (data) {
    arrScores = data;
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
  });

  //------------------------------------------------------------------
  //
  // Handler for receiving state updates about food.
  //
  //------------------------------------------------------------------
  socket.on("food-update", function (data) {
    food.model.update(data);
  });

  socket.on("update-points", function (data) {
    playerSelf.model.points = data;
  });

  //------------------------------------------------------------------
  //
  // Handler for when player hits a piece of food.
  //
  //------------------------------------------------------------------
  socket.on("hit-food", function (data) {
    particleManager.ateFood(data.x, data.y);
    soundSystem.playSound("gulp");
  });

  socket.on("hit-head", function (data) {
    if (!hitHeadParticles) {
      particleManager.playerDeath(data.x, data.y);
      hitHeadParticles = true;
    }
    if (!playedEndSound) {
      soundSystem.playSound("end-game");
      playedEndSound = true;
    }
  });

  socket.on("add-kill", function (data) {
    playerSelf.model.kills += 1;
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
    if (!game_over) {
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
    }
    for (let id in playerOthers) {
      playerOthers[id].model.update(elapsedTime);
    }
    food.model.updateRenderFrames(elapsedTime); // increment the render frame on each sprite so it's animated
    particleManager.update(elapsedTime, {
      width: canvas.width,
      height: canvas.height,
    });
    // scoreText.updateText("Score: ", playerSelf.model.points);
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

    if (!game_over) {
      renderer.Player.render(playerSelf.model, playerSelf.texture);
      renderer.Text.render(playerName);
    }
    segments = playerSelf.model.getSegments();
    for (let id in segments) {
      renderer.Body.render(
        segments[id].model,
        segments[id].texture,
        playerSelf.model.position
      );
      //   renderer.PlayerRemote.render(segments[id].model, segments[id].texture, playerSelf.position);
    }

    for (let id in playerOthers) {
      let otherPlayer = playerOthers[id];
      //(id);//this is the clientID
      if (allPlayerNames[id] === undefined) {
        continue;
      }
      renderer.PlayerRemote.render(
        otherPlayer.model,
        MyGame.assets["player-other"],
        playerSelf.model.position,
        allPlayerNames[id].name
      );
      let otherSegments = otherPlayer.model.segments;
      for (let id in otherSegments) {
        renderer.Body.render(
          otherSegments[id].model,
          otherSegments[id].texture,
          playerSelf.model.position
        );
        //   renderer.PlayerRemote.render(segments[id].model, segments[id].texture, playerSelf.position);
      }
    }
    renderer.Food.render(
      food.model,
      food.texture,
      food.bigTexture,
      playerSelf.model.position,
      WORLD_SIZE
    );
    if (game_over) {
      if (!score_added) {
        persistence.addScore(playerSelf.model.name, playerSelf.model.points);
        persistence.reportScores();
        scoreText.updateText("Score:               " + playerSelf.model.points);
        killsText.updateText(
          "Kills:                  " + playerSelf.model.kills
        );
        topPosText.updateText("Top Position:     " + 0); // TODO: GET TOP POSITION OF PLAYER ON THE LEADERBOARD
        score_added = true;
      }
      graphics.drawImage(
        MyGame.assets["panelDark"],
        { x: 0.5, y: 0.5 },
        { width: 1, height: 0.6 }
      );
      renderer.Text.render(endText);
      renderer.Button.render(endButton);
      renderer.Text.render(scoreText);
      renderer.Text.render(killsText);
      renderer.Text.render(topPosText);
      renderer.Text.render(buttonText);
      if (endButton.clicked) {
        game_over = false;
        cancelNextRequest = true;
        socket.emit("reset-player");
        segments.length = 0;
        score_added = false;
        playedEndSound = false;
        hitHeadParticles = false;
        game.showScreen("main-menu");
      }
    }

    graphics.drawImage(
      MyGame.assets["panelLight"],
      { x: 0.9, y: 0.1 },
      { width: 0.3, height: 0.4 }
    );
    let yPos = -0.02;
    for (let i = 0; i < arrScores.length; i++) {
      if (i == 5) {
        return;
      }

      yPos += 0.05;
      if (allPlayerNames[arrScores[i].clientId] === undefined) {
        continue;
      }
      renderer.Text.render(
        MyGame.objects.Text({
          text:
            allPlayerNames[arrScores[i].clientId].name +
            ": " +
            arrScores[i].points,
          font: "10pt Arial",
          fillStyle: "#FFFFFF",
          strokeStyle: "#FFFFFF",
          position: { x: 0.8, y: yPos },
        })
      );
    }
    particleManager.render(playerSelf.model.position);
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

    if (DEBUG == true) {
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
  }

  //------------------------------------------------------------------
  //
  // Public function used to get the game initialized and then up
  // and running.
  //
  //------------------------------------------------------------------
  function initialize() {
    cancelNextRequest = true;
    //
    // Then, return to the main menu
    game.showScreen("main-menu");
  }

  function run() {
    if (persistence.getPlayerName() == "") {
      strPlayerName = "Player";
      playerName.updateText("Player");
    } else {
      strPlayerName = persistence.getPlayerName();
      playerName.updateText(strPlayerName);
    }
    socket.emit("playerName", { name: strPlayerName, clientID: socket.id });

    registerKeys();
    lastTimeStamp = performance.now();
    cancelNextRequest = false;
    // TODO: REFRESH THE PLAYER'S POSITION, LENGTH, ETC.
    endButton.refresh();
    score_added = false;

    if (playerSelf.model.segments.length < 4) {
      //      playerSelf.model.addBodyPart();
      //    playerSelf.model.addBodyPart();
      //  playerSelf.model.addBodyPart();
      //tell the server we've added three body parts,
      // so we emit the message three times
      socket.emit("add-start-parts");
      console.log("gameply.js add-start-parts");
    }
    playerSelf.model.addTurnPoint();
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
  MyGame.systems
);
