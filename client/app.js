Template.Map.onRendered(function () {
    Mapbox.debug = true;
    Mapbox.load({
        plugins: ['markercluster', 'heat']
    });

    this.autorun(function () {
        if (Mapbox.loaded()) {
            L.mapbox.accessToken = 'pk.eyJ1IjoiaGFsa2FoIiwiYSI6ImNpajA1M2l4ODAwMnp2Ym0waThudzV0b2EifQ.VcaWhErFHuoh6IoyQ84ZtQ';
            map = L.mapbox.map('map', 'mapbox.streets')
            view = map.setView([35.68951, 139.6917], 15)
        }
    });
});
