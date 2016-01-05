Template.body.helpers({
    queries: [
        { 
            term: "Restaurants",
            latitude: 34.345454,
            longitude: 41.8723,
            radius: 5,
            date: new Date ("Sep 23 13:09"),
        },
        {
            term: "Museums",
            latitude: 139.71038,
            longitude: 12.4801, 
            radius: 2,
            date: new Date ("Sep 23 13:10"),
        }
    ],
    formatDate: function(date) {
        return moment(date).format("MMM DD HH:mm");
    }
});

Template.Query.helpers({
    formatDate: function(date) {
        return moment(date).format("MMM DD HH:mm");
    }
});

