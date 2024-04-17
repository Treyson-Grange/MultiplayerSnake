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
  });

  Object.defineProperty(that, "position", {
    get: () => position,
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

  // that.move = function (elapsedTime, direction) {
  //   let vectorX = Math.cos(direction) * speed * elapsedTime;
  //   let vectorY = Math.sin(direction) * speed * elapsedTime;

  //   position.x += vectorX;
  //   position.y += vectorY;
  // };

  that.follow = function (elapsedTime) {
    // console.log(position);
    // console.log("follow");
  };

  return that;
}
module.exports.createBody = () => createBody();
