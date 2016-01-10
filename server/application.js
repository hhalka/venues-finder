Meteor.startup(function() {

    Meteor.publish("queries", function() {
        return Queries.find({owner: this.userId});
    });

    ServiceConfiguration.configurations.upsert({service: "google"}, {
        $set: {
            clientId: "801400690937-u6fvkn42g1kknodq08as1i36dd351hln.apps.googleusercontent.com",
            secret: "7covq3s3mtu0f349HYGdbJZL",
            loginStyle: "popup"
        }
    });

    Foursquare.init({
        id: "XHXEMEETBSWJWC0LZGHSDDL0K5ER53LAECPHFLIS5PGGZUYN",
        secret: "HTZW1HWKOF1YCKGDSGJ0YLMKQT4OX3IZVWWCJGABXMOOZ5AQ",
        authOnly: false
    });
});
