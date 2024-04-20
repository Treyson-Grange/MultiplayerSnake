MyGame.persistence = (function () {
  "use strict";

  // High scores
  let highScores = {};

  let previousScores = localStorage.getItem("MyGame.highScores");

  if (previousScores !== null) {
    highScores = JSON.parse(previousScores);
  }

  // Player name
  let playerName = "Anon";

  let previousPlayerName = localStorage.getItem("MyGame.playerName");

  if (previousPlayerName !== null) {
    playerName = JSON.parse(previousPlayerName);
  }

  // Controls
  let customControls = { left: "a", right: "d", up: "w", down: "s" };

  let previousControls = localStorage.getItem("MyGame.customControls");
  // console.log(previousControls);

  if (previousControls !== null) {
    customControls = JSON.parse(previousControls);
  }

  // High scores functions
  function addScore(value) {
    console.log("Adding score: " + value);
    highScores = JSON.parse(localStorage.getItem("MyGame.highScores")) || [];
    highScores.push(value);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5);
    localStorage.setItem("MyGame.highScores", JSON.stringify(highScores));
  }

  function removeScore(key) {
    delete highScores[key];
    localStorage["MyGame.highScores"] = JSON.stringify(highScores);
  }

  function reportScores() {
    let htmlNode = document.getElementById("high-scores-list");

    htmlNode.innerHTML = "";
    for (let key in highScores) {
      htmlNode.innerHTML += highScores[key] + "<br/>";
    }

    htmlNode.style.overflow = "scroll";

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
    localStorage["MyGame.playerName"] = JSON.stringify(playerName);

    // location.reload();
  }

  // Custom keys functions

  function getMoveLeft() {
    return customControls["left"];
  }

  function getMoveRight() {
    return customControls["right"];
  }

  function getMoveUp() {
    return customControls["up"];
  }

  function getMoveDown() {
    return customControls["down"];
  }

  function changeCustomControl(key, value) {
    customControls[key] = value;
    console.log(customControls);
    localStorage["MyGame.customControls"] = JSON.stringify(customControls);

    reportCustomControls();
  }

  function reportCustomControls() {
    let htmlNodeLeft = document.getElementById("id-custom-control-move-left");
    htmlNodeLeft.innerHTML = "";
    htmlNodeLeft.innerHTML = "Left: " + customControls["left"];

    let htmlNodeRight = document.getElementById("id-custom-control-move-right");
    htmlNodeRight.innerHTML = "";
    htmlNodeRight.innerHTML = "Right: " + customControls["right"];

    let htmlNodeUp = document.getElementById("id-custom-control-move-up");
    htmlNodeUp.innerHTML = "";
    htmlNodeUp.innerHTML = "Up: " + customControls["up"];

    let htmlNodeDown = document.getElementById("id-custom-control-move-down");
    htmlNodeDown.innerHTML = "";
    htmlNodeDown.innerHTML = "Down: " + customControls["down"];
  }

  return {
    get highScores() {
      return highScores;
    },
    addScore: addScore,
    removeScore: removeScore,
    reportScores: reportScores,
    getPlayerName: getPlayerName,
    changePlayerName: changePlayerName,
    getMoveLeft: getMoveLeft,
    getMoveRight: getMoveRight,
    getMoveUp: getMoveUp,
    getMoveDown: getMoveDown,
    changeCustomControl: changeCustomControl,
    reportCustomControls: reportCustomControls,
  };
})();
