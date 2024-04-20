"use strict";
let random = require("./random");

function createBody() {
  let that = {};
  let position = { x: 0, y: 0 };
  let size = { width: 0.05, height: 0.05 };
  let direction;
  let rotateRate = Math.PI / 1000;
  let speed = 0.0002;
  let reportUpdate = false;

  Object.defineProperty(that, "direction", {
    get: () => direction,
    set: (value) => {
      direction = value;
    },
  });

  Object.defineProperty(that, "position", {
    get: () => position,
    set: (setPosition) => { position = setPosition},
  });

  Object.defineProperty(that, "size", {
    get: () => size,
  });

  Object.defineProperty(that, "speed", {
    get: () => speed,
  });

  Object.defineProperty(that, "rotateRate", {
    get: () => rotateRate,
  });

  Object.defineProperty(that, "reportUpdate", {
    get: () => reportUpdate,
    set: (value) => (reportUpdate = value),
  });

  that.follow = function (elapsedTime) {};
  that.update = function (elapsedTime, turnPoints) {};

  return that;
}
module.exports.createBody = () => createBody();
