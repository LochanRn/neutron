var tilesDb = {
    getItem: function (key) {
        return localforage.getItem(key);
    },
    saveTiles: function (tileUrls) {
        var self = this;
        var promises = [];
        for (var i = 0; i < tileUrls.length; i++) {
            var tileUrl = tileUrls[i];
            (function (i, tileUrl) {
                promises[i] = new Promise(function (resolve, reject) {
                    var request = new XMLHttpRequest();
                    request.open('GET', tileUrl.url, true);
                    request.responseType = 'blob';
                    request.onreadystatechange = function () {
                        if (request.readyState === XMLHttpRequest.DONE) {
                            if (request.status === 200) {
                                resolve(self._saveTile(tileUrl.key, request.response));
                            } else {
                                reject({
                                    status: request.status,
                                    statusText: request.statusText
                                });
                            }
                        }
                    };
                    request.send();
                });
            })(i, tileUrl);
        }
        return Promise.all(promises);
    },
    clear: function () {
        return localforage.clear();
    },
    _saveTile: function (key, value) {
        return this._removeItem(key).then(function () {
            return localforage.setItem(key, value);
        });
    },
    _removeItem: function (key) {
        return localforage.removeItem(key);
    }
}

var offlineLayer = L.tileLayer.offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', tilesDb, {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abc',
    minZoom: 1,
    maxZoom: 19,
    crossOrigin: true
});

var offlineControl = L.control.offline(offlineLayer, tilesDb, {
    confirmSavingCallback: function (nTilesToSave, continueSaveTiles) {
        if (window.confirm('Save ' + nTilesToSave + '?')) {
            continueSaveTiles();
        }
    },
    confirmRemovalCallback: function (continueRemoveTiles) {
        if (window.confirm('Remove all the tiles?')) {
            continueRemoveTiles();
        }
    },
    minZoom: 1,
    maxZoom: 19
});

var LeafIcon = L.Icon.extend({
    options: {
        iconSize:     [100,100],
        iconAnchor:   [50,50],
    }
});

var getIcons = function(url){
    var ficon = new LeafIcon({iconUrl:url});
    return ficon;
}


var initMap = function (latitude, longitude) {
    var map = L.map('map');
    var position = L.control.mousePosition();
    var coordinates = L.control.coordinates({
                position:"topright",
                useDMS:true,
                labelTemplateLat:"N {y}",
                labelTemplateLng:"E {x}",
                useLatLngOrder:true
            });
    offlineControl.addTo(map);
    offlineLayer.addTo(map);
    position.addTo(map);
    coordinates.addTo(map);
    map.setView({
        lat: latitude,
        lng: longitude
    }, 50);
    return map;
}

module.exports.initMap = initMap;
module.exports.getIcons = getIcons;
