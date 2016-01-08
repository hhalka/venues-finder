venues = new ReactiveArray();

Template.body.helpers({
    queries: function(){
        return Queries.find({});
    },
    /*queries: [
       {
            term: "Museums",
            latitude: 139.71038,
            longitude: 12.4801, 
            radius: 2,
            date: new Date ("Sep 23 13:10"),
        }
    ],*/
    venues: function() {
        return venues.list();
    }
});

