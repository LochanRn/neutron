var keyMap = { "w":false , "a": false, "s":false, "d":false ,
               "q":false , "e":false , "t":false , "Control":false ,
               "ArrowRight":false , "ArrowLeft":false , "ArrowUp":false , "ArrowDown":false ,
               "j":false , "k":false , "l": false, "Shift":false, "i": false, "o": false };

var initKeyboard = function() {
    $('body').keydown(function(event) {
        if (keyMap.hasOwnProperty(event.key))
            keyMap[event.key] = true;
    });
    $('body').keyup(function(event) {
        if (keyMap.hasOwnProperty(event.key))
            keyMap[event.key] = false;
    });
}

var processKeys = function() {
    var output = "";
    Object.keys(keyMap).forEach(function(key) {
        output += (keyMap[key] ? "1" : "0");
    });
    var drive = parseInt(output.substring(0, 8), 2);
    var arm = parseInt(output.substring(8, 16), 2);
    return [drive, arm];
}

module.exports.initKeyboard = initKeyboard;
module.exports.processKeys = processKeys;
