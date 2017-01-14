Template.canvas.created = function() {
    console.log("Template.canvas.created");
    //renderCurrentDraw();
}

Template.canvas.onRendered(function() {
    console.log("Template.canvas.onRendered");
    initFabricDrawing();
});


function initFabricDrawing(){

    var $ = function(id){
                return document.getElementById(id)
            };   

    var canvas = this.__canvas = new fabric.Canvas('canvas', {
        isDrawingMode: true
    });

    //Change canvas size on window resizing
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();


    fabric.Object.prototype.transparentCorners = false;

    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = Session.get("initialColor") || "#0000ff";
        canvas.freeDrawingBrush.width = parseInt(Session.get("drawingLineWidth"), 10) || 1;
        canvas.freeDrawingBrush.shadowBlur = 0;
    }    

    //renderCurrentDraw();
    //canvas.on('object:added', newCanvasObject);
}


function resizeCanvas(){
    var width = $('#canvas-container').width();
    var height = $(window).innerHeight() - $('#canvas-container').position().top - 10;
    var canvas = this.__canvas;
    console.log("width: " + width)
    console.log("height: " + height)
    canvas.setWidth(width);
    canvas.setHeight(height);
}
