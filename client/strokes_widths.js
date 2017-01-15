Template.strokes_widths.helpers({
    lineWidth: function(){
        return Session.get("strokeWidth");
    },
    currentColor: function(){
        return Session.get("currentColor");
    },
    currentWidth: function(width){
        return Session.get("strokeWidth") == width;
    },
    strokesWidths: function(){
        var sizes = [{size: "", width: 3}, {size: "fa-lg", width: 7}, 
                     {size: "fa-2x", width: 10}, {size: "fa-3x", width: 15}, 
                     {size: "fa-4x", width: 20}, {size: "fa-5x", width: 30}];
        return sizes;
    }
});

Template.strokes_widths.events({
    'click .js-set-stroke-width': function(e){
        e.preventDefault();
        //Uses font awesome icon font size to set stroke width
        Session.set("strokeWidth", $(e.target).css('font-size').replace('px',''));
        mainCanvas.freeDrawingBrush.width = parseInt(Session.get("strokeWidth"), 10) || 3;
        //Set active stroke width
        var width = $(e.target).data('width');
        $('#strokes-container .active').removeClass('active');
        $('#strokes-container div[data-width=' + width + ']').addClass('active');
    }
});