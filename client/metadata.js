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
        return {};
    }
});


Template.share_draw.helpers({
    drawName: function(){
        var draw = Session.get("currentDraw");
        if (draw)
            return draw.title;
        return '';
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
