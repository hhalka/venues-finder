Template.registerHelper("formatDate", function(date) {
    return moment(date).format("MMM DD HH:mm");
});

Template.registerHelper("_", function(){
    return _;
});

