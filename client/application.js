Meteor.subscribe("queries");

venues = new ReactiveArray();

Tracker.autorun(function() {
    venues.depend();
    if (Mapbox.loaded() && typeof view !== "undefined") {
        var points =_.map(venues, function(venue) {
             return {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [venue.longitude.toString(), venue.latitude.toString()]
                },
                "properties": {
                    "title": venue.name,
                    "description": venue.address,
                    "marker-color": "#fc4353",
                    "marker-symbol": "marker",
                    "marker-size": "large"
                }
            };
        });
        view.featureLayer.setGeoJSON(points);
    }
});

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
        ll: query.latitude.toString() + ", " + query.longitude.toString(),
        query:  query.term,
        radius: 1000 * query.radius,
        // intent: 'browse',
        // sw: query.south_west.lat.toString() + ", " + query.south_west.lng.toString(),
        // ne: query.north_east.lat.toString() + ", " + query.north_east.lng.toString()
    };
    Foursquare.find(params, function(error, result) {
        venues.clear();
        if(!error) {
            Array.prototype.push.apply(venues, _.map(result.response.venues, function(venue) {
                return {
                    name : venue.name,
                    city : venue.location.city,
                    address : venue.location.address,
                    latitude : venue.location.lat.toFixed(8),
                    longitude : venue.location.lng.toFixed(8)
                }
            }));
        }
    });
}

Template.LoginMenu.events({
    "click [data-action=login]": function(event) {
        event.preventDefault();
        Meteor.loginWithGoogle({requestPermissions: ["profile"]});
    },

    "click [data-action=logout]": function(event) {
        event.preventDefault();
        Meteor.logout();
    }
});

Template.LoginMenu.helpers({
    isLoginServicesConfigured() {
        return Accounts.loginServicesConfigured();
    }
});

Template.Map.onRendered(function () {
    Mapbox.load({
        plugins: ["markercluster", "heat"]
    });

    this.autorun(function () {
        if (Mapbox.loaded()) {
            L.mapbox.accessToken = "pk.eyJ1IjoiaGFsa2FoIiwiYSI6ImNpajA1M2l4ODAwMnp2Ym0waThudzV0b2EifQ.VcaWhErFHuoh6IoyQ84ZtQ";
            map = L.mapbox.map("map", "mapbox.streets");
        }
    });

    this.autorun(function() {
        if (Mapbox.loaded() && typeof map !== "undefined") {
            selected = Queries.findOne({selected: true});
            if (selected !== undefined) {
                find_venues(selected);
                view = map.setView([selected.latitude, selected.longitude], selected.zoom);
            } else {
                venues.clear();
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
        if (Mapbox.loaded() && typeof map !== "undefined") {
            var center =  map.getCenter();
            var bounds = map.getBounds();
            var radius = getDistanceFromLatLonInKm(center.lat, center.lng, bounds._northEast.lat, center.lng).toFixed(2);
            
            var query = {
                term: term,
                latitude: center.lat.toFixed(8),
                longitude: center.lng.toFixed(8),
                radius: radius,
                zoom: map.getZoom(),
                selected: true,
                createdAt: new Date(),
                owner: Meteor.userId(),
                // north_east: bounds._northEast,
                // south_west: bounds._southWest
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
        Meteor.call("deleteQuery", this);
    },

    "click .query-list > .list-group-item": function(event) {
        Meteor.call("clearSelected");
        Meteor.call("setSelected", this);
    }
});

