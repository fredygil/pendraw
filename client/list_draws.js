Template.list_draws.helpers({
    draws: function(){
        if (Meteor.user())
            return Draws.find({owner: Meteor.userId()});
        return;
    },
    //Draws shared with current user
    shared_draws: function(){
        if (Meteor.user()){
            //Get current user email
            var email = Meteor.user().emails[0].address;
            if (email){
                return Shares.find({userEmail: email});
            }
        }
        return;
    },
    draw_templates: function(){
        return Templates.find({});
    },
    formatDate: function(date){
        return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
    },
    //Uses current date to version thumbnails calling. 
    //This avoids cache
    version: function(){
        return moment().unix();
    },
    drawTitle: function(drawId){
        var draw = Draws.findOne({_id: drawId});
        console.log(drawId);
        if (draw)
            return draw.title;
        return '';
    },
    drawLastUpdate: function(drawId){
        var draw = Draws.findOne({_id: drawId});
        if (draw)
            return moment(draw.lastUpdate).format("dddd, MMMM Do YYYY, h:mm:ss a");
        return '';
    }    
});


Template.list_draws.events({
    'click .js-open-draw': function(e){
        e.preventDefault();
        var drawId = $(e.target).data('id');
        var draw = Draws.findOne({_id: drawId});

        if (draw){
            mainCanvas.clear();
            Session.set({"currentDraw": draw, "renderedVersion": 0});
        }
        return;
    }
});