import { Meteor } from 'meteor/meteor';

Meteor.startup(function() {
    
    //Redefine URL sent to user for password resseting. reset-password is 
    //intercepted for iron router and properly handles the action
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('reset-password/' + token);
    };
    
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

 Meteor.publish('allUsers', function() {
    return Meteor.users.find({});
});
