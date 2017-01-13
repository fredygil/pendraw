import { Meteor } from 'meteor/meteor';

Meteor.startup(function() {
    
    //Redefine URL sent to user for password resseting. reset-password is 
    //intercepted for iron router and properly handles the action
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('reset-password/' + token);
    };
    
});