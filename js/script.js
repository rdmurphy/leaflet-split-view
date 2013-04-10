// load the maps/tiles

var startingLng = -99.84;
var startingZoom = 6;
var startingCenter = new L.LatLng(31.41, startingLng);

var mapLeft = new L.Map('map_left', {
  center: startingCenter,
  zoom: startingZoom,
  fadeAnimation: false
});

var mapRight = new L.Map('map_right', {
  center: startingCenter,
  zoom: startingZoom,
  zoomControl: false,
  fadeAnimation: false
});

var terrainTileURL = 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg';
var stamenTerrain = new L.TileLayer(terrainTileURL);

var tonerTileURL = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';

var stamenToner = new L.TileLayer(tonerTileURL);

mapLeft.addLayer(stamenTerrain);
mapRight.addLayer(stamenToner);

// initial map sync

(function() {
  var lng,
    bounds = mapLeft.getBounds(),
    southWest = bounds.getSouthWest(),
    center = mapLeft.getCenter(),
    distance = center.lng - southWest.lng,
    lat = center.lat;

  var lngL = startingLng - distance;
  var lngR = startingLng + distance;

  mapLeft.panTo(new L.LatLng(lat, lngL));
  mapRight.panTo(new L.LatLng(lat, lngR));
})();

// where the magic happens

var mapIsMoving = false;

var mapMover = function(a, b) {
  if (mapIsMoving) { return; }
  mapIsMoving = true;

  var lng,
      newZoom = a.getZoom(),
      otherZoom = b.getZoom(),
      bounds = a.getBounds(),
      southWest = bounds.getSouthWest(),
      northEast = bounds.getNorthEast(),
      center = a.getCenter(),
      lat = center.lat;

  if (a === mapLeft) {
    lng = ((southWest.lng + northEast.lng) / 2) - (southWest.lng - northEast.lng);
    console.log(lng);
  } else {
    lng = ((southWest.lng + northEast.lng) / 2) + (southWest.lng - northEast.lng);
  }

  b.panTo(new L.LatLng(lat, lng));
  if (newZoom !== otherZoom) {
    b.setZoom(newZoom);
  }
  mapIsMoving = false;
};

mapLeft.on("drag", function() {
  mapMover(mapLeft, mapRight);
});

mapRight.on("drag", function() {
  mapMover(mapRight, mapLeft);
});

mapLeft.on("zoomend", function() {
    mapMover(mapLeft, mapRight);
});

mapRight.on("zoomend", function() {
  mapMover(mapRight, mapLeft);
});
