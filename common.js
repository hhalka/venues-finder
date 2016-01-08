Queries = new Mongo.Collection("Queries");

Meteor.methods({

    appendQuery: function(query) {
        Queries.insert(query);
    },

    setSelected: function(queryId) {
        Queries.update(queryId, {$set: {selected: true}});
    },

    clearSelected: function() {
        Queries.update({selected: true}, {$set: {selected: false}});
    },

    deleteQuery: function(queryId) {
        Queries.remove(queryId);
    }
});

