Template.strokes_widths.helpers({
    drawingLineWidth: function(){
        return Session.get("drawingLineWidth");
    },
    currentColor: function(){
        return Session.get("currentColor");
    },
    strokesWidths: function(){
        var sizes = [{size: ""}, {size: "fa-lg"}, 
                     {size: "fa-2x"}, {size: "fa-3x"}, 
                     {size: "fa-4x"}, {size: "fa-5x"}];
        return sizes;
    } 
});