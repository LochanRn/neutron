
console.log("im herer");
addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index , e.gamepad.id,
      e.gamepad.buttons.length, e.gamepad.axes.length);

    });
addEventListener("gamepaddisconnected",function(e){
    console.log("Gamepad is disconnected %d: %s",e.gamepad.index ,e.gamepad.id);
});
 