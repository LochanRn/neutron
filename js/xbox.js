var gamepad = require("gamepad");
gamepad.init()

for (var i = 0, l = gamepad.numDevices(); i < l; i++) {
  gamepad.deviceAtIndex();
}

setInterval(gamepad.processEvents, 16);
setInterval(gamepad.detectDevices, 500);

var butMap = { "0": false, "1": false, "2": false, "3": false, "4": false, "5": false, "6": false, "7": false };
var channels = [0, 0, 0, 0, 0, 0, 0, 0];

var changeButMap = function (event, type) {
  if (butMap.hasOwnProperty(event))
    if (type == 1)
      butMap[event] = true;
    else
      butMap[event] = false;
}

gamepad.on("move", function (id, axis, value) {
    channels[axis] = parseInt(value * 100);
});

gamepad.on("down", function (id, num) {
  changeButMap(num.toString(), 1);
});

gamepad.on("up", function (id, num) {
  changeButMap(num.toString(), 0);
});

var processKeys = function () {

  var output = "";

  Object.keys(butMap).forEach(function (key) {
    output += (butMap[key] ? "1" : "0");
  });

  return [channels[0], channels[1]];

};

module.exports.processKeys = processKeys;





