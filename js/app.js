var MapLayer = require('./map');
var link = require('./communication');
var control = require('./keyboard');
// var tel = require('./tel');  
// var needle = require('./compass');

var point = [0, 0, 0, 0, 0];
var fileName = ['Index', 'Micro', 'Spectro', 'ImageProcessing'];
var count = 0;

var DATA_RATE = 1; //ms
var map = MapLayer.initMap(12.821260, 80.038329); //12.821260, 80.038329
var ploticon = MapLayer.getIcons("../images/Black_dot.png");
// var testicon = MapLayer.getIcons("../images/pointer_marker.png",[35,35]);

link.setupServer(map, 23907); // Groud Station server listning on 23907 never change!!!!
control.initKeyboard();

// setting up required listners
setInterval(function () {
    var data = control.processKeys();
    // console.log(data);
    link.sendData("<" + data[1] + "," + data[0] + "!" + data[2] + ";" + data[3] + ">", 0);
}, DATA_RATE);

map.on('click', function (e) {
    if (point[count])
        map.removeLayer(point[count]);
    point[count] = L.marker(e.latlng, {
        icon: ploticon
    }); //L.marker(e.latlng);
    point[count].addTo(map);
    $('#lat' + count).val(e.latlng.lat.toFixed(6));
    $('#lon' + count).val(e.latlng.lng.toFixed(6));
    count = (count + 1) % 5;
    // console.log(L.marker(e.latlng, {icon:testicon,className: 'rotated-markerdiv'}));
});

$('#remove').click(function () {
    for (var i = 0; i < 5; i++) {
        $('#lat' + i).val(null);
        $('#lon' + i).val(null);
        if (point[i])
            map.removeLayer(point[i]);
    }
    count = 0;
    link.sendData('$#', 1);
    $('[id^=send]').prop('disabled', true);
    $('#autoStatus').removeClass('yellow').removeClass('green').addClass('red');
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
            point[i] = L.marker([$('#lat' + i).val(), $('#lon' + i).val()]);
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
    data = data.slice(0, -1) + '$';
    link.sendData(data, 1);
});

for (i = 1; i < 5; i++) {
    $('#fileName' + i).html(fileName[i-1]);
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
