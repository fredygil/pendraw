Template.paint_brushes.created = function() {
    Session.setDefault("currentBrush", "Pencil");
}

Template.paint_brushes.helpers({
    'paintBrushes': function(){
        var brushes = [{name: "pencil", icon: "pencil.svg", brush: "Pencil"}, 
                       {name: "circle", icon: "ellipsis.svg", brush: "Circle"},
                       {name: "spray", icon: "paint-spray.svg", brush: "Spray"},
                       {name: "pattern", icon: "dots-circular-shape.svg", brush: "Pattern"}
                      ];
        return brushes;
    },
    'isCurrentBrush': function(brush){
        return brush == Session.get("currentBrush");
    }
});


Template.paint_brushes.events({
    'click .js-select-brush': function(e){
        e.preventDefault();

        var brush = $(e.target).data('brush');
        mainCanvas.freeDrawingBrush = new fabric[brush + 'Brush'](mainCanvas);
        if (mainCanvas.freeDrawingBrush) {
            mainCanvas.freeDrawingBrush.color = Session.get("currentColor");
            mainCanvas.freeDrawingBrush.width = parseInt(Session.get("strokeWidth"), 10) || 3;

            //Set active brush
            $('#paint-brushes-container .active').removeClass('active');
            $('#paint-brushes-container div[data-brush=' + brush + ']').addClass('active');
        }
    }
});