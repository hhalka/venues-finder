Queries = new Mongo.Collection("Queries");

Meteor.methods({

    appendQuery: function(query) {
        if (query.owner !== Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Queries.insert(query);
    },

    setSelected: function(query) {
        if (query.owner !== Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Queries.update(query._id, {$set: {selected: true}});
    },

    clearSelected: function() {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Queries.update({selected: true}, {$set: {selected: false}});
    },

    deleteQuery: function(query) {
        if (query.owner !== Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Queries.remove(query._id);
    }
});

