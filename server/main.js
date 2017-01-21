
Meteor.startup(function() {
    
    //Redefine URL sent to user for password resseting. reset-password is 
    //intercepted for iron router and properly handles the action
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('reset-password/' + token);
    };

    //Create drawing templates
    if (!Templates.findOne()){
        var templates = [{extension: 'svg', files: 2}, {extension: 'png', files: 7}];
        templates.forEach(function(template){
            for (i=1; i<=template.files; i++){
                Templates.insert({file: i + '.' + template.extension});
            }
        });
    }
});

//Publish draws where current user is owner or are public or
//are shared with the current user
Meteor.publish("draws", function(){
    return Draws.find({
        $or: [
            {owner: this.userId},
            {private: false},
            {sharedUsers: this.userId}
            ]
    }); 
});

//Only publish actions for current draw
Meteor.publish("actions", function(){
    return Actions.find({});
});

//Shares for each draw
Meteor.publish("shares", function(){
    return Shares.find({});
});

//Users for email searching
Meteor.publish('allUsers', function() {
    return Meteor.users.find({});
});

//Draws templates
Meteor.publish('templates', function() {
    return Templates.find({});
});

