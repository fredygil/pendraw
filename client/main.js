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

    //Change current color? Updates drawing color
    var currentColor = Session.get('currentColor');
    var lastColor = Session.get('lastColor');
    if (currentColor != lastColor) {
        if (this.__canvas.freeDrawingBrush)
            this.__canvas.freeDrawingBrush.color = Session.get("currentColor");
        Session.set('lastColor', currentColor);
    }
});

