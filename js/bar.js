var updatestrength = function(updata) {
  var element = document.getElementById("myprogressBar");
  var width = 1;
  var identity = setInterval(scene, 10);
  function scene() {
    if (width >= 100) {
      clearInterval(identity);
    } else {
      width++;
      element.style.width = updata + '%';
      element.innerHTML = updata * 1  + '%';
    }
  }
}
module.exports.updatestrength = updatestrength;
