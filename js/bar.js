var updatestrength = function(updata) {
  var element = document.getElementById("myprogressBar");
  var width = 1;
  function scene() {
      width++;
      element.style.width = updata + '%';
      element.innerHTML = updata * 1  + '%';
  }
  scene();
}

module.exports.updatestrength = updatestrength;
