
var updatestrength = function(updata) {
  if(updata <= 100)
    $('#myprogressBar').css("width",updata + '%').html(updata * 1  + '%');
}

module.exports.updatestrength = updatestrength;
