var a;
var flag=[0,0];
var but= ['a','b','x','y','lb','rb','lt','rt','back','start','lsb','rsb','up','down','left','right','xbox'];
var butMap = {'a':false,'b':false,'x':false,'y':false,'lb':false,'rb':false,'lt':false,'rt':false,'back':false,
         'start':false,'lsb':false,'rsb':false,'up':false,'down':false,'left':false,'right':false,'xbox':false};

addEventListener("gamepadconnected", function(e) {
   flag[e.gamepad.index]=1;
   console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
     e.gamepad.index, e.gamepad.id,
     e.gamepad.buttons.length, e.gamepad.axes.length);
     a=e.gamepad.index;
   });
  /*
   addEventListener("gamepaddisconnected",function(e){
    console.log("Gamepad is disconnected %d: %s",e.gamepad.index ,e.gamepad.id);
  flag[e.gamepad.index]=0;
  });
*/
  var changeButMap = function (event, type) {
      if (butMap.hasOwnProperty(event))
        if (type == 1)
          butMap[event] = true;
        else
          butMap[event] = false;
    }

var processKeys = function() 
{
   var output="";
   
    var gp = navigator.getGamepads()[a];
   
  if(flag[0]==1)
  {
     //return [parseInt(gp.axes[0]*100),parseInt(gp.axes[1]*100)]; 
   console.log("im in");
   for(var i=0;i<17;i++)
   changeButMap(but[i],gp.buttons[i].value);
 
   Object.keys(butMap).forEach(function (key) {
   output += (butMap[key] ? "1" : "0");
  });
  var camera = parseInt(output.substring(0, 8), 2);
  var drive = parseInt(output.substring(8, 16), 2);
  //var arm = parseInt(output.substring(12, 20), 2);
  return [camera,drive];
  }
  else 
  return[0,0];
  //return [gp.buttons[0].value,gp.buttons[1].value,gp.buttons];
}
module.exports.processKeys = processKeys;
