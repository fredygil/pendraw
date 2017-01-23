Template.canvas.onCreated = function() {
    Meteor.subscribe("draws");
    Meteor.subscribe("actions");
    Meteor.subscribe("shares");
    Meteor.subscribe('allUsers')
    Meteor.subscribe('templates')
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
            if (latestDraw.version > renderedVersion || (latestDraw.version == 0 && renderedVersion > 0)) {
                drawChanges();
            }
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
    //Call this function each time an object is removed
    canvas.on('object:removed', removeCanvasObject);
    //Call this function each time an object is modified
    canvas.on('object:modified', modifyCanvasObject);
    //Call this each time an object is selected
    canvas.on('object:selected', selectedObject);
}


function drawChanges(){
    //Add objects from database to canvas and render it
    var currentDraw = Session.get("currentDraw");
    var renderedVersion = Session.get("renderedVersion");
    if (currentDraw) {
        var lastDraw = Draws.findOne({_id: currentDraw._id});
        if (mainCanvas && lastDraw && renderedVersion > 0 && lastDraw.version == 0){
            mainCanvas.clear();
            Session.set("renderedVersion", lastDraw.version);
            Session.set("currentDraw", lastDraw);
        }
        if (lastDraw && lastDraw.version > renderedVersion){
            //Get last actions (not yet rendered) and render them
            // console.log("Search params: drawId: " + currentDraw._id + " | version > " + renderedVersion);
            var actions = Actions.find({drawId: currentDraw._id, version: { $gt: parseInt(renderedVersion)}}, 
                                       {sort: {version: 1}}).fetch();

            // console.log("Versions to add: " + actions.length);
            if (mainCanvas && actions){
                //Add each object to an array
                var objects = new Array();
                actions.forEach(function(action){
                    objects.push({action: action.action, data: action.object || action.objectIndex});
                });
                //Initially, asummes that all actions are of type 'add'
                //Stops object:added event listener (to avoid recursion)
                mainCanvas.off('object:added');
                mainCanvas.off('object:removed');
                //Draw new objects
                drawChangedObjects(objects);
                //Draw added objects on mainCanvas
                mainCanvas.renderAll();
                //Starts listening again for this events
                mainCanvas.on('object:added', newCanvasObject);
                mainCanvas.on('object:removed', removeCanvasObject);
                //Updates session variables
                Session.set("renderedVersion", lastDraw.version);
                Session.set("currentDraw", lastDraw);
            }
        }
        //Update toolbar save button
        updateSaveButton();
    }

}

//Add new objects to mainCanvas
//Credits: http://stackoverflow.com/questions/27972454/canvas-fabric-js-loadfromjson-replaces-entire-canvas
//Credits: http://jsfiddle.net/sFGGV/30/
function drawChangedObjects(objects){
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].action == 'add') {
            var klass = fabric.util.getKlass(objects[i].data.type);
            if (klass.async) {
                klass.fromObject(objects[i].data, function (img) {
                    mainCanvas.add(img);
                });
            } else {
                mainCanvas.add(klass.fromObject(objects[i].data));
            }
        }
        else {
            mainCanvas.remove(mainCanvas.item(objects[i].data));
        }
    }
}

//Logs each new object added to canvas
function newCanvasObject(options){
    //Logs the action for the new object
    //Returns and updated draw object and set it in the session
    var jsonCanvas = mainCanvas.toJSON();
    var lastObject = jsonCanvas.objects[jsonCanvas.objects.length - 1];
    Session.set("renderedVersion", Session.get("renderedVersion") + 1);

    Meteor.call("addDrawObject", Session.get("currentDraw"), lastObject, function(err, result){
        if (!err && result){
            Session.set("currentDraw", result);
            //Export canvas to SVG
            var svg = mainCanvas.toSVG();
            Meteor.call("saveSVG", Session.get("currentDraw"), svg);
        } else {
            Session.set("renderedVersion", Session.get("renderedVersion") - 1);
        }
    });

    //Updates objectsCount
    Session.set("objectsCount", Session.get("objectsCount") + 1);

    //Update toolbar save button
    updateSaveButton();
}

function removeCanvasObject(){
    Session.set("renderedVersion", Session.get("renderedVersion") + 1);
    Meteor.call("removeDrawObject", Session.get("currentDraw"), objectIndex, function(err, result){
        if (!err && result){
            Session.set("currentDraw", result);
            //Export canvas to SVG
            var svg = mainCanvas.toSVG();
            Meteor.call("saveSVG", Session.get("currentDraw"), svg);
        } else {
            Session.set("renderedVersion", Session.get("renderedVersion") - 1);
        }
    });

    //Update toolbar save button
    updateSaveButton();
}

//Object modifying
function modifyCanvasObject(options){
    //Remove existent object and insert new one
    Session.set("renderedVersion", Session.get("renderedVersion") + 1);
    Meteor.call("removeDrawObject", Session.get("currentDraw"), objectIndex, function(err, result){
        if (!err && result){
            var jsonCanvas = mainCanvas.toJSON();
            var lastObject = jsonCanvas.objects[objectIndex];
            Session.set("renderedVersion", Session.get("renderedVersion") + 1);
            Meteor.call("addDrawObject", result, lastObject, function(err, result){
                if (!err && result){
                    Session.set("currentDraw", result);
                    //Export canvas to SVG
                    var svg = mainCanvas.toSVG();
                    Meteor.call("saveSVG", Session.get("currentDraw"), svg);
                } else {
                    Session.set("renderedVersion", Session.get("renderedVersion") - 1);
                }
            });
            //Updates objectsCount
            Session.set("objectsCount", Session.get("objectsCount") + 1);
        } else {
            Session.set("renderedVersion", Session.get("renderedVersion") - 1);
        }
    });
    //Update toolbar save button
    updateSaveButton();
}

function selectedObject(e) {
    objectIndex = mainCanvas.getObjects().indexOf(e.target);
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


function updateSaveButton(){
    if (mainCanvas && Session.get("currentDraw")){
        $('.toolbar-save').attr('href', mainCanvas.toDataURL());
        $('.toolbar-save').attr('download', Session.get("currentDraw").title + '.png');
    }

}