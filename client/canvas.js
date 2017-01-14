Template.canvas.created = function() {
    //renderCurrentDraw();
}

Template.canvas.onRendered(function() {
    //Init fabric.js stuff
    initFabricDrawing();
});

//Init fabric.js stuff
function initFabricDrawing(){

    //Create the canvas for drawing and assign it to this.__canvas
    var canvas = this.__canvas = new fabric.Canvas('canvas', {
        isDrawingMode: true
    });

    //Change canvas size on window resizing
    window.addEventListener('resize', resizeCanvas, false);
    //Initial resizing according to window size
    resizeCanvas();

    //First drawing brush
    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = Session.get("currentColor");
        canvas.freeDrawingBrush.width = parseInt(Session.get("drawingLineWidth"), 10) || 1;
        canvas.freeDrawingBrush.shadowBlur = 0;
    }    

    //renderCurrentDraw();
    //canvas.on('object:added', newCanvasObject);
}

//Resize canvas. Takes all width and all height minus 10px
function resizeCanvas(){
    var width = $('#canvas-container').width();
    var height = $(window).innerHeight() - $('#canvas-container').position().top - 10;
    var canvas = this.__canvas;

    canvas.setWidth(width);
    canvas.setHeight(height);
}
