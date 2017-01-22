Template.draw_templates.helpers({
    draw_templates: function(){
        return Templates.find({});
    }
});


Template.draw_templates.events({
    'click .js-choose-template': function(e){
        e.preventDefault();
        UIkit.modal('#drawTemplates').hide();           
        var file = $(e.target).data('file');
        console.log(file);
        fabric.loadSVGFromURL('templates/' + file, function(objects, options) {
            var shape = fabric.util.groupSVGElements(objects, options);
            mainCanvas.add(shape.scale(0.6));
            shape.set({ left: 50, top: 50 }).setCoords();
            mainCanvas.renderAll();

            mainCanvas.forEachObject(function(obj) {
                var setCoords = obj.setCoords.bind(obj);
                obj.on({
                    moving: setCoords,
                    scaling: setCoords,
                    rotating: setCoords
                });
            });
            //Click on Move brush. This allows new
            //image object manipulation
            $('a.js-select-brush[data-brush="Move"]').click();
        });        
    }
});