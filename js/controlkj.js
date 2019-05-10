console.log("im IN");
var a, flag = 0;
var b ,flag2= 0;
var but = ['a', 'b', 'x', 'y', 'lb', 'rb', 'lt', 'rt', 'back', 'start', 'lsb', 'rsb', 'up', 'down', 'left', 'right', 'xbox'];
var con = ["control", "z", "/", "ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Shift", "c", "x", "r", "o", "i", "l", "k", "j"]

var keyMap = { "1":false, "2":false, "3":false, "4":false, "6":false, "8":false ,
               " ":false,"e":false, "q":false, "a":false, "s":false, "d":false, "w":false ,
               "Control":false,"z":false, "/":false, "ArrowRight":false, "ArrowLeft":false , "ArrowDown":false , "ArrowUp":false , "Shift":false,
               "c":false,"x":false,"r":false, "o":false, "i":false, "l":false, "k":false, "j":false
            };

var keyMap2 = { "1":false, "2":false, "3":false, "4":false, "6":false, "8":false ,
            " ":false,"e":false, "q":false, "a":false, "s":false, "d":false, "w":false ,
            "Control":false,"z":false, "/":false, "ArrowRight":false, "ArrowLeft":false , "ArrowDown":false , "ArrowUp":false , "Shift":false,
            "c":false,"x":false,"r":false, "o":false, "i":false, "l":false, "k":false, "j":false
         };


var initKeyboard = function () {
    $('body').keydown(function (event) {
        // console.log(event.key);
        if (keyMap.hasOwnProperty(event.key))
            keyMap[event.key] = true;
    });
    $('body').keyup(function (event) {
        if (keyMap.hasOwnProperty(event.key))
            keyMap[event.key] = false;
    });
}

addEventListener("gamepadconnected", function (e) {
    
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
        if(flag==0)
        {a = e.gamepad.index;
            flag = 1;
  
        }
        else
        {b=e.gamepad.index;
         flag2 = 1;
         console.log("Second  GAMEPAD :"+b);
        } 
          });
/*
addEventListener("gamepaddisconnected",function(e){
    console.log("Gamepad is disconnected %d: %s",e.gamepad.index ,e.gamepad.id);
   flag=0;   
});
 */
var changekeyMap = function (event, type) {
    if (keyMap2.hasOwnProperty(event))
      if (type == 1)
        keyMap2[event] = true;
      else
        keyMap2[event] = false;
  }

var processKeys = function () 
{
    var outputk="";
    var outputj="";
    var output="";
    Object.keys(keyMap).forEach(function (key) {
        outputk += (keyMap[key] ? "1" : "0");
    }); 
     
    if(flag==1)
    {
        var gp = navigator.getGamepads()[a];
        if(gp!=null)
        for(var i=0;i<17;i++)
            changekeyMap(con[i],gp.buttons[i].value);
        Object.keys(keyMap2).forEach(function (key) {
                outputj += (keyMap2[key] ? "1" : "0");
            });    
     }
     else 
     {outputj="0000000000000000000000000000";
     }
     var channel1=0;
     var channel2=0;
     if(flag2==1)
     {
         var gpd = navigator.getGamepads()[b];
         if(gpd!=null)
          {
              channel1=parseInt(gpd.axes[0]*100);
              channel2=parseInt(gpd.axes[1]*100);
          }
          else 
          {
              channel1=0;
              channel2=0;
          }
     }
    for(var i=0;i<29;i++)
    output+=(parseInt(outputj[i])||parseInt(outputk[i])).toString();
    /*
    console.log("["+outputk+"]");
    console.log('\n');
    console.log("{"+outputj+"}"); 
    console.log('\n');
    console.log("("+output+")");
    */
  

   var camera = parseInt(output.substring(0, 6), 2);
   var drive = parseInt(output.substring(6, 13), 2);
   var arm = parseInt(output.substring(13, 21), 2);
   var ypr = parseInt(output.substring(21, 29), 2);
    return [camera, drive,channel1,channel2, arm, ypr];
}  
module.exports.initKeyboard = initKeyboard;
module.exports.processKeys = processKeys;
