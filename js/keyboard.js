var keyMap = { "1":false, "2":false, "3":false, "4":false, "6":false, "8":false ,
               " ":false,"e":false, "q":false, "a":false, "s":false, "d":false, "w":false ,
               "Control":false,"z":false, "/":false, "ArrowRight":false, "ArrowLeft":false , "ArrowDown":false , "ArrowUp":false , "Shift":false,
               "c":false,"x":false,"r":false, "o":false, "i":false, "l":false, "k":false, "j":false
            };
var initKeyboard = function() {
    $('body').keydown(function(event) {
        // console.log(event.key);
        if (keyMap.hasOwnProperty(event.key))
            keyMap[event.key] = true;
    });
    $('body').keyup(function(event) {
        console.log(event.key);
        if (keyMap.hasOwnProperty(event.key))
            keyMap[event.key] = false;
    });
}                                                                                                                                                                                                                                                                                                      

var processKeys = function() {
    var output = "";
    Object.keys(keyMap).forEach(function(key) {
        output += (keyMap[key] ? "1" : "0");
    });

    var camera = parseInt(output.substring(0, 6), 2);
    var drive = parseInt(output.substring(6, 13), 2);
    var arm = parseInt(output.substring(13, 21), 2);
    var ypr = parseInt(output.substring(21, 29), 2);
    return [camera, drive, arm, ypr];
}

module.exports.initKeyboard = initKeyboard;
module.exports.processKeys = processKeys;
