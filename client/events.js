function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

Template.body.events({
    "submit .new-query": function (event) {
        event.preventDefault();

        var query = event.target.query.value;
        if (Mapbox.loaded() && !!map)   {
            var center =  map.getCenter();
            var north_east = map.getBounds()._northEast
            var radius = 1000 * getDistanceFromLatLonInKm(center.lat, center.lng, north_east.lat, center.lng);
            console.log(radius);
            var params = {
                ll: center.lat.toString() + ', ' + center.lng.toString(),
                query:  query,
                radius: radius
            };
            Foursquare.find(params, function(error, result) {
                console.log(error);
                console.log(result);
            });
        }
        event.target.query.value = "";
    }
});
