// var updatestrength = function(updata) {
//   var element = document.getElementById("myprogressBar");
//   function scene() {
//       element.style.width = updata + '%';
//       element.innerHTML = updata * 1  + '%';
//   }
//   scene();
// }

var updatestrength = function(updata) {
  if(updata <= 100)
    $('#myprogressBar').css("width",updata + '%').html(updata * 1  + '%');
}

module.exports.updatestrength = updatestrength;
