Template.list_draws.helpers({
    draws: function(){
        if (Meteor.user())
            return Draws.find({owner: Meteor.userId()});
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