Template.canvas.onCreated = function() {
    Meteor.subscribe("draws");
    Meteor.subscribe("actions");
}


Template.canvas.onRendered(function() {
    //Defaults
    Session.set("strokeWidth", "3");
    Session.set("objectsCount", 0);
    //Version of the rendered canvas
    Session.set("renderedVersion", 0);

    //Init fabric.js stuff
    initFabricDrawing();
    //Renders a draw, i.e., last one created by the user or one opened or
    //a new empty canvas
    drawChanges();
});


//Checks if there is a new version of the draw
Meteor.autorun(function() {
    var renderedVersion = Session.get("renderedVersion");
    var draw = Session.get("currentDraw");
    if (draw){
        var latestDraw = Draws.findOne({_id: draw._id});
        if (latestDraw){
            //New objects or canvas cleared
            if (latestDraw.version > renderedVersion || (latestDraw.version == 0 && renderedVersion > 0))
                drawChanges();
        }
    }
});


//Init fabric.js stuff
function initFabricDrawing(){

    //Create the canvas for drawing and assign it to this.__canvas
    var canvas = mainCanvas = this.__canvas = new fabric.Canvas('canvas', {
        isDrawingMode: true
    });

    //Change canvas size on window resizing
    window.addEventListener('resize', resizeCanvas, false);
    //Initial resizing according to window size
    resizeCanvas();

    //First drawing brush
    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = Session.get("currentColor");
        canvas.freeDrawingBrush.width = parseInt(Session.get("strokeWidth"), 10) || 3;
        canvas.freeDrawingBrush.shadowBlur = 0;
    }    

    //Call this function each time a new object is added to canvas
    canvas.on('object:added', newCanvasObject);
}


function drawChanges(){
    //Add objects from database to canvas and render it
    var currentDraw = Session.get("currentDraw");
    if (currentDraw) {
        var lastDraw = Draws.findOne({_id: currentDraw._id});
        if (lastDraw && Session.get("renderedVersion") > 0 && lastDraw.version == 0){
            mainCanvas.clear();
            Session.set("renderedVersion", lastDraw.version);
            Session.set("currentDraw", lastDraw);
        }
        if (lastDraw && lastDraw.version > Session.get("renderedVersion")){
            // var actions = Actions.find({$and: [{drawId: draw._id}, {version: { $gt: Session.get("renderedVersion")}}]}, 
            //                            {sort: {version: 1}}).fetch();
            /*
            * TODO: This is loading and rendering all revisions. Must load only last revisions
            *       and draw then on the canvas
            */
            var actions = Actions.find({drawId: draw._id}, 
                                       {sort: {version: 1}}).fetch();

            if (mainCanvas && actions){
                //Add each object to an array
                var objects = new Array();
                actions.forEach(function(action){
                    objects.push(action.object);
                });
                //Initially, asummes that all actions are of type 'add'
                //Stops object:added event listener
                mainCanvas.off('object:added');
                mainCanvas.loadFromJSON({objects: objects});
                mainCanvas.renderAll();
                //Starts listening again for this event
                mainCanvas.on('object:added', newCanvasObject);
                Session.set("renderedVersion", lastDraw.version);
                Session.set("currentDraw", lastDraw);
            }
        }
    }

}


function newCanvasObject(options){
    //Logs the action for the new object
    //Returns and updated draw object and set it in the session
    var jsonCanvas = mainCanvas.toJSON();
    var lastObject = jsonCanvas.objects[jsonCanvas.objects.length - 1];
    Meteor.call("addDrawObject", Session.get("currentDraw"), lastObject, function(err, result){
        if (!err && result){
            Session.set("currentDraw", result);
        }
    });

    //Updates objectsCount
    Session.set("objectsCount", Session.get("objectsCount") + 1);
}

//Resize canvas. Takes all width and all height minus 10px
function resizeCanvas(){
    if ($('#canvas-container').length){
        var width = $('#canvas-container').width();
        var height = $(window).innerHeight() - $('#canvas-container').position().top - 10;

        mainCanvas.setWidth(width);
        mainCanvas.setHeight(height);
    }
}
