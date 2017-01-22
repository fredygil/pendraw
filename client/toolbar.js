Template.toolbar.helpers({
    tools: function(){
        var tools = [
                    {name: "open", icon: "pictures.svg", title: "Open Draw"},
                    {name: "new", icon: "add-image.svg", title: "New Draw"}, 
                    {name: "clear", icon: "image-3.svg", title: "Clear Draw"}, 
                    {name: "logout", icon: "logout.svg", title: "Sign Out"}
                    ];
        return tools;
    }
});


Template.toolbar.events({
    'click .toolbar-logout': function(e){
        e.preventDefault();
        Meteor.logout(function(err, result){
            if (err){
                Session.set("displayMessage", err);
            } else {
                Session.set("loginMode", "LOGIN");
                Session.set("userStatus", "loggedIn");
                Router.go("/");        
            }
        });
    },
    'click .toolbar-clear': function(e){
        e.preventDefault();
        
        var currentDraw = Session.get("currentDraw");
        if (currentDraw.owner == Meteor.userId()){
            Meteor.call("removeDrawContent", currentDraw._id, function(err, result){
                if (err){
                    Session.set("displayMessage", err);
                } else {
                    mainCanvas.clear();
                    Session.set("renderedVersion", 0);
                    Session.set("currentDraw", result);
                }
            });
        }
    },
    'click .toolbar-new': function(e){
        e.preventDefault();
        Meteor.call("newDraw", function(err, result){
            if (err){
                Session.set("displayMessage", err);
            } else {
                Session.set("displayMessage", {message: "New draw created", status: "success"});
                Session.set("renderedVersion", 0);
                Session.set("currentDraw", result);
            }
        });
    },
    'click .toolbar-open': function(e){
        e.preventDefault();
        UIkit.modal('#listDraws').show();
    },

});