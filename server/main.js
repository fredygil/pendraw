import { Meteor } from 'meteor/meteor';

Meteor.startup(function() {
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('reset-password/' + token);
    };
});