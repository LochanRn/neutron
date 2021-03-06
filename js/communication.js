const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const IMUdata = dgram.createSocket('udp4');
//var sim = require('./3dsimulator');
//var needle = require('./compass');

var dat2=[0, 0, 0];
var dat=[];
var x=0, y=0, z=0;
var anglex=0, angley=0, anglez=0;
var aglx=0, agly=0, aglz=0;
var host = '127.0.0.1';
var port = 3301;
var portMaster = 3300;
var allowData = false;
var oldPoint = 0;

var setupServer = function (map, port, portIMU) {
  server.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    $("#rover").html(`${rinfo.address}:${rinfo.port}`);
    processMessage(map, msg, rinfo);
    $("#down").html(` ${msg.length}b`);
  });

  server.on('listening', () => {
    const address = server.address();
    $("#station").html(`${address.address}:${address.port}`);
  });
  server.bind(port);

  IMUdata.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    IMUdata.close();
  });

  IMUdata.on('message', (msg) => {
    var data = `${msg}`;
    if (data[0] == '#' && allowData === true) {
    dat2 = data.split(",");
    }
    
  });

  IMUdata.bind(portIMU);
  // required listners
  $('#updStatus').click(function () {
    host = $("#processip").val().split(":")[0];
    port = $("#roverip").val();
    if ($(this).hasClass('btn-warning')) {
      $(this).removeClass('btn-warning').addClass('btn-positive').html('Stop');
      allowData = true;
    } else if ($(this).hasClass('btn-positive')) {
      $(this).removeClass('btn-positive').addClass('btn-warning').html('Start');
      allowData = false;
    }
  });
}

var sendData = function (data, override) { // data should be string
  if (allowData || override) {
    var message = new Buffer(data);
    server.send(message, 0, message.length, port, host, function (err, bytes) {
      if (err) console.error(err);
      $("#up").html(` ${bytes}b`);
      // TODO create log
    });
  }
}

var sendFileNo = function (data) {
  host = $("#processip").val().split(":")[0];
  portMaster = $("#processip").val().split(":")[1];

  var message = new Buffer(data);
  server.send(message, 0, message.length, portMaster, host, function (err, bytes) {
    if (err) console.error(err);
    $("#up").html(` ${bytes}b`);
  });
}

var processMessage = function (map, msg) {

  var data = new TextDecoder("ascii").decode(msg);

  // console.log(msg);
  switch (data[0]) {
    case '@':
      $('#k' + data[1]).removeClass('btn-danger').addClass('btn-positive').html('Stop');
      if (data[1] == 1)
        $("#updStatus").prop('disabled', false);
      break;
    case '~':
      $('#k' + data[1]).removeClass('btn-positive').addClass('btn-danger').html('Start');
      if (data[1] == 1) {
        $('#updStatus').removeClass('btn-positive').addClass('btn-warning').html('Start');
        $("#updStatus").prop('disabled', true);
        allowData = false;
      }
      break;
    case '?':
      $('#k' + data[1]).removeClass('btn-positive').addClass('btn-negative').html('Execv Error');
      break;
    case '!':
      $('#k' + data[1]).removeClass('btn-danger').addClass('btn-positive').html('Stop');
      $("#updStatus").prop('disabled', false);
      break;
    case '^':
      $('#k' + data[1]).removeClass('btn-positive').addClass('btn-danger').html('Start');
      break;
    case '%':
      $('#k' + data[1]).removeClass('btn-danger').addClass('btn-negative').html('Fork Error');
      break;
    default:
      break;
  }
  if (data[0] == '$') {
    dat = data.split(",");
    // console.log(typeof(parseFloat(dat[1])));
    $('#heading').html(dat[1]);
    //simulate3D(dat2[1], dat[1], dat2[2]);
    //needle.compass(dat[1]);
    if (dat[2] == '%') {
      $('[id^=send]').prop('disabled', false);
      $('#autoStatus').removeClass('red').removeClass('green').addClass('yellow');
    }
    // console.log((dat[2]));
    else if (dat[2].indexOf("destination:") !== -1) {
     $('#auto').html(dat[2]);
      if (dat[3] == "~") {
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
    if (oldPoint != 0)
      map.removeLayer(oldPoint);
    oldPoint = L.marker([data.lat, data.lon])
    oldPoint = oldPoint.addTo(map);
  }
}

// var simulate3D = function (x, y, z) {
     
//     anglex += parseFloat(1.57 * (x - aglx) / 10);
//     angley -= parseFloat(1.57 * (y - agly) / 90);
//     anglez -= parseFloat(1.57 * (z - aglz) / 10);
//      //console.log(dat2[1]);
//      //console.log("    ");
//      //console.log(dat2[3]);
//     //anglex += 0.01;
//     //angley += 0.01;
//     //anglez += 0.01;
//     //console.log(angley);
//      aglx = x;
//      agly = y;
//      aglz = z;
//     sim.callRenderer(anglex, angley, anglez);
//   //}
// }

module.exports.setupServer = setupServer;
module.exports.sendData = sendData;
module.exports.sendFileNo = sendFileNo;