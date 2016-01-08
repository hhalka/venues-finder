venues = new ReactiveArray();

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
    return deg * (Math.PI/180);
}

function find_venues(query) {
    var params = {
        ll: query.latitude.toString() + ', ' + query.longitude.toString(),
        query:  query.term,
        radius: 1000 * query.radius
    };

    Foursquare.find(params, function(error, result) {
        venues.splice(0, venues.length);
        if(!error) {
            queryResult = result.response.venues;
            queryResult.forEach(function(venue, index) {
                venues.push({
                    name : venue.name,
                    city : venue.location.city,
                    address : venue.location.address,
                    latitude : venue.location.lat.toFixed(8),
                    longitude : venue.location.lng.toFixed(8)
                });
            });
        }
    });
}

Template.Map.onRendered(function () {
    Mapbox.load({
        plugins: ['markercluster', 'heat']
    });

    this.autorun(function () {
        if (Mapbox.loaded()) {
            L.mapbox.accessToken = 'pk.eyJ1IjoiaGFsa2FoIiwiYSI6ImNpajA1M2l4ODAwMnp2Ym0waThudzV0b2EifQ.VcaWhErFHuoh6IoyQ84ZtQ';
            map = L.mapbox.map('map', 'mapbox.streets');
        }
    });

    this.autorun(function() {
        if (Mapbox.loaded() && !!map) {
            selected = Queries.findOne({selected: true});
            if (selected !== undefined) {
                find_venues(selected);
                map.setView([selected.latitude, selected.longitude], selected.zoom);
            }
        }
    });
});

Template.body.helpers({
    queries: function(){
        return Queries.find({}, {sort: {createdAt: -1}});
    },
    venues: function() {
        return venues.list();
    }
});

Template.body.events({
    "submit .new-query": function (event) {
        event.preventDefault();

        var term = event.target.query.value;
        if (Mapbox.loaded()) {
            var center =  map.getCenter();
            var north_east = map.getBounds()._northEast
            var radius = getDistanceFromLatLonInKm(center.lat, center.lng, north_east.lat, center.lng).toFixed(2);
            
            var query = {
                term: term,
                latitude: center.lat.toFixed(8),
                longitude: center.lng.toFixed(8),
                radius: radius,
                zoom: map.getZoom(),
                selected: true,
                createdAt: new Date()
            };

            Meteor.call("clearSelected");
            Meteor.call("appendQuery", query);

            find_venues(query);
        }
        event.target.query.value = "";
    },

    "click .export-data > .btn" : function() {
        csv = json2csv(venues, true, true);
        var blob = new Blob([csv], {type: "text/plain;charset=utf-8;"});
        saveAs(blob, "venues.csv");    
    },

    "click .delete": function() {
        venues.splice(0, venues.length);
        Meteor.call("deleteQuery", this._id);
    },

    "click .query-list > .list-group-item": function(event) {
        Meteor.call("clearSelected");
        Meteor.call("setSelected", this._id);
        find_venues(this);
    }
});

