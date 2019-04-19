const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var needle = require('./compass');
var host = '10.4.168.215';
var port = 3301;
var port1 = 3302;
var allowData = false;
var oldPoint = 0;

var setupServer = function(map, port) {
    server.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        server.close();
    });
    server.on('message', (msg, rinfo) => {
        $("#rover").html(`${rinfo.address}:${rinfo.port}`);
        processMessage(map, msg, rinfo);
        // console.log(head);
        $("#down").html(` ${msg.length}b`);
        // return head;
    });
    server.on('listening', () => {
        const address = server.address();
        $("#station").html(`${address.address}:${address.port}`);
    });
    server.bind(port);

    // required listners
    $('#updStatus').click(function() {
        host = $("#roverip").val().split(":")[0];
        port = $("#roverip").val().split(":")[1];
        if ($(this).hasClass('btn-warning')) {
            $(this).removeClass('btn-warning').addClass('btn-positive').html('Stop');
            allowData = true;
        } else if ($(this).hasClass('btn-positive')) {
            $(this).removeClass('btn-positive').addClass('btn-warning').html('Start');
            allowData = false;
        }
    });
}

var sendData = function(data, override) { // data should be string
    if (allowData || override) {
        var message = new Buffer(data);
        server.send(message, 0, message.length, port, host, function(err, bytes) {
            if (err) console.error(err);
            $("#up").html(` ${bytes}b`);
            // TODO create log
        });
        // console.log(data);
    }
}

var sendData1 = function(data, override){
     var message = new Buffer(data);
    server.send(message,0,message.length, port1, host, function(err, bytes){
      if (err) console.error(err);
      $("#up").html(` ${bytes}b`);
    });
  
}

var processMessage = function(map, msg) {
    var data = new TextDecoder("ascii").decode(msg);
    // console.log(data);
    if(data[0]=='$')
    {
      var dat = data.split(",");
      // console.log(typeof(parseFloat(dat[1])));
      $('#heading').html(dat[1]);
      needle.compass(dat[1]);
      if(dat[2]=='%')
      {
        $('[id^=send]').prop('disabled', false);
        $('#autoStatus').removeClass('red').removeClass('green').addClass('yellow');
      }
      // console.log((dat[2]));
      else if(dat[2].indexOf("destination:") !== -1)
      {
        $('#info').html(dat[2]);
        if(dat[3] == "~"){
          $('#send').prop('disabled', false);
          $('#autoStatus').removeClass('red').removeClass('green').addClass('yellow');
        }
      }
    }
    if (data[0] === '{')
        data = JSON.parse(data);
    if (data.class === 'TPV') {
        // console.log(data.lat + " , " + data.lon);
        $('#latitude').html(data.lat);
        $('#longitude').html(data.lon);
        $('#speed').html(data.speed + ' m/s');
        if(oldPoint != 0)
            map.removeLayer(oldPoint);
        oldPoint = L.marker([data.lat, data.lon])
        oldPoint = oldPoint.addTo(map);
    }
}

module.exports.setupServer = setupServer;
module.exports.sendData = sendData;
module.exports.sendData1 = sendData1;
