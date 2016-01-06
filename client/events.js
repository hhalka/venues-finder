Template.body.events({
    "submit .new-query": function (event) {
        event.preventDefault();

        var query = event.target.query.value;
        console.log(query);
        event.target.query.value = "";
    }
});
