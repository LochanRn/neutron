var MapLayer = require('./map');
var link = require('./communication');
//var control = require('./keyboard');
//var h= require('./testt.js');
var controlKJ = require('./controlkj');
// var point = [0, 0, 0, 0, 0];
var point = [];
var polylinePoints = [];
var Poly;
var fileName = ['Index', 'Spectro', 'Micro', 'Store', 'Image Processing'];
var count = 0;

var DATA_RATE = 1; //ms
var map = MapLayer.initMap(38.4065, -110.7919); //12.821260, 80.038329  38.4065 -110.7919
var ploticon = MapLayer.getIcons("../images/Black_dot.png");
// var testicon = MapLayer.getIcons("../images/pointer_marker.png",[35,35]);

link.setupServer(map, 23907, 23911); // Groud Station server listning on 23907 never change!!!!
controlKJ.initKeyboard();


// setting up required listners
setInterval(function () {

    //    var data = control.processKeys();
    //    link.sendData("<"+data[1]+","+data[0]+","+data[2]+","+data[3] + ",>");

    var data = controlKJ.processKeys();
    //console.log(data);
    link.sendData("<" + data[0] + "," + data[1] + "," + data[2] + "," + data[3] + "," + data[4] + "," + data[5] + ">", 0);

    // console.log(data);

}, DATA_RATE);

map.on('click', function (e) {
    if (point.length > 4) {
        map.removeLayer(point[0]);
        point = point.slice(1);
    }

    if (polylinePoints.length > 4)
        polylinePoints = polylinePoints.slice(1);

    var a = L.marker(e.latlng, {
        icon: ploticon
    });

    if(count > 4){
        for (var i = 0; i < 4; i++) {
            $('#lat' + i).val($('#lat' + (i + 1)).val());
            $('#lon' + i).val($('#lon' + (i + 1)).val());
        }
        $('#lat' + 4).val(e.latlng.lat.toFixed(6));
        $('#lon' + 4).val(e.latlng.lng.toFixed(6));
        count = 5;
    }
    else{
        $('#lat' + count).val(e.latlng.lat.toFixed(6));
        $('#lon' + count).val(e.latlng.lng.toFixed(6));    
        count = (count + 1);
    }
    a.addTo(map);
    point.push(a);
    polylinePoints.push([e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6)]);
});

$('#remove').click(function () {
    for (var i = 0; i < 5; i++) {
        $('#lat' + i).val(null);
        $('#lon' + i).val(null);
        if (point[i])
            map.removeLayer(point[i]);
        // console.log(polylinePoints[i]);

    }

    for (i in map._layers) {
        if (map._layers[i].options.format == undefined) {
            console.log(i);
            if (i != 29) {  //map layer

                try {
                    map.removeLayer(map._layers[i]);
                } catch (e) {
                    console.log("problem with " + e + map._layers[i]);
                }
            }
        }
    }
    map.removeLayer(Poly);
    polylinePoints = [];
    count = 0;
    link.sendData('$#', 1);
    $('[id^=send]').prop('disabled', true);
    $('#autoStatus').removeClass('yellow').removeClass('green').addClass('red');
    // console.log(polylinePoints);
});

$('#send').click(function () {
    link.sendData('@', 1);
    $('#autoStatus').removeClass('yellow').removeClass('red').addClass('green');
    $('[id^=send]').prop('disabled', true);
});

$('#sendall').click(function () {
    link.sendData('*', 1);
    $('#autoStatus').removeClass('yellow').removeClass('red').addClass('green');
    $('[id^=send]').prop('disabled', true);
});

$('#show').click(function () {
    for (var i = 0; i < 5; i++) {
        if ($('#lat' + i).val() && $('#lon' + i).val()) {
            if (point[i])
                map.removeLayer(point[i]);

            var urlNum = "../images/" + (i + 1) + ".png";
            var numberPoint = L.icon({
                iconUrl: urlNum,
                iconAnchor: [15, 15]
            });

            point[i] = L.marker([$('#lat' + i).val(), $('#lon' + i).val()], { icon: numberPoint });
            point[i].addTo(map);
        }
    }
});

$('#load').click(function () {
    var data = '#';
    for (var i = 0; i < 5; i++) {
        if ($('#lat' + i).val() && $('#lon' + i).val()) {
            data += $('#lat' + i).val() + ',' + $('#lon' + i).val() + '!';
        }
    }
    Poly = L.polyline(polylinePoints).addTo(map);
    // console.log(Poly); 
    data = data.slice(0, -1) + '$';
    link.sendData(data, 1);
});

for (i = 1; i <= fileName.length; i++) {
    $('#fileName' + i).html(fileName[i - 1]);
    $('#k' + i).click(function () {
        var a = $(this).attr('id');
        if ($(this).hasClass('btn-danger')) {
            link.sendFileNo("~" + a[1] + "~");
        } else if ($(this).hasClass('btn-positive')) {
            link.sendFileNo("~" + -a[1] + "~");
        } else if ($(this).hasClass('btn-negative')) {
            $(this).removeClass('btn-negative').addClass('btn-danger').html('Start');
            link.sendFileNo("~" + -a[1] + "~");
        }
    });
}

