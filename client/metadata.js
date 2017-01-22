Template.metadata.helpers({
    drawName: function(){
        var draw = Session.get("currentDraw");
        if (draw)
            return draw.title;
        return '';
    },
    currentDraw: function(){
        var draw = Session.get("currentDraw");
        if (draw)
            return draw;
        return;
    },
    currentUser: function(){
        if (Meteor.user() && Meteor.user().emails)
            return Meteor.user().emails[0].address;
        return '';
    },
    isOwner: function(){
        var draw = Session.get("currentDraw");
        if (draw && Meteor.user()) {
            return draw.owner == Meteor.userId();
        }
        return false;
    }
});


Template.share_draw.helpers({
    drawName: function(){
        var draw = Session.get("currentDraw");
        if (draw)
            return draw.title;
        return '';
    },
    shares: function(){
        var draw = Session.get("currentDraw");
        if (draw) {
            var shares = Shares.find({drawId: draw._id});
            return shares;
        }
        return;
    },
    selectedPermission: function(permission, match){
        return (permission == match) ? 'selected' : '';
    }
});


Template.metadata.events({
    'click .js-set-privacy': function(e){
        e.preventDefault();
        Meteor.call("changeDrawPrivacy", Session.get("currentDraw"), function(err, result){
            if (!err && result){
                Session.set("currentDraw", result);
            }
        });
    }
});


Template.share_draw.events({
    'submit .js-save-share': function(e){
        e.preventDefault();
        //Save draw sharing
        var draw = Session.get("currentDraw");
        if (!draw) {
            Session.set("displayMessage", "No current draw");
            return false;
        }

        var user = Meteor.users.findOne({"emails.address": e.target.email.value});
        if (!user){
            Session.set("displayMessage", "Email " + e.target.email.value + " not registered");
            return false;
        }

        Meteor.call("saveSharing", draw, user, Meteor.user(), e.target.permission.value, function(err, result){
            if (!err && result){
                Session.set("displayMessage", {message: "Draw shared with " + e.target.email.value, status: "success"});
                e.target.reset();
            } else {
                Session.set("displayMessage", err);
            }
        });
    },
    'click .js-update-share': function(e){
        e.preventDefault();
        var shareId = $(e.target).parents('tr:first').find('input[name=id]').val();
        var permission = $(e.target).parents('tr:first').find('select[name=permission] option:selected').val();

        Meteor.call("updateSharePermission", shareId, permission, function(err, result){
            if (!err && result){
                Session.set("displayMessage", {message: "Share permission updated", status: "success"});
            } else {
                Session.set("displayMessage", err);
            }
        });

    },
    'click .js-remove-share': function(e){
        e.preventDefault();
        var shareId = $(e.target).parents('tr:first').find('input[name=id]').val();

        Meteor.call("removeSharePermission", shareId, function(err, result){
            if (!err && result){
                Session.set("displayMessage", {message: "Share permission removed", status: "success"});
            } else {
                Session.set("displayMessage", err);
            }
        });

    }
});