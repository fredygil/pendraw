//Checks for changes on session variable displayMessages ans shows the message
Meteor.autorun(function() {
    // Whenever this session variable changes, run this function.
    var message = Session.get('displayMessage');
    var messageText, messageStatus;
    if (message) {
        if ($.isPlainObject(message)){
            messageText = message.message;
            messageStatus = message.status || 'danger';
        } else {
            messageText = message;
            messageStatus = 'danger';
        }
        UIkit.notify(messageText, {status: messageStatus});
        Session.set('displayMessage', null);
    }
});

