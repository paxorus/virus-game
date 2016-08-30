/* Prakhar Sahay 05/01/2014

Double-clicking the canvas calls zoomToPoint, which repeatedly calls fatten, which calls paint.
Paint utilizes correctOrigin to quickly give a blurry background and then drawImage to draw clearer images on top.

*/

// CONSTANTS
var MAX_ZOOM = 2;
var FRAMES = 20;
var MSPF = 15;

var zoomRange = document.getElementById("zoomRange");
var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame || function(f) {setTimeout(f, MSPF)};

// VARIABLES
zoomRange.max = MAX_ZOOM;

// initialize objects
var canvas = new Canvas();
var imageManager = new ImageManager();
var zoomer = new Zoomer();
var blurry = imageManager.getBlurry();


// CONTROLLERS

// zoom in on double-click
var canvasElem = canvas.element();
canvasElem.addEventListener("dblclick", function(evt) {
    if(zoomer.depth() >= MAX_ZOOM){
        return;
    }
    zoomRange.value = zoomer.depth() + 1;
    var point = new Vector(evt.clientX - canvasElem.offsetLeft, evt.clientY - canvasElem.offsetTop);
    zoomer.zoomInTo(point);
});

// start translation on mouse down
canvasElem.addEventListener("mousedown", function(evt) {
    evt.preventDefault();
    canvasElem.className = "closedHand";
    zoomer.startTranslate(evt.clientX, evt.clientY);
    document.addEventListener("mousemove", translate);
});

// end translation on mouse up
document.addEventListener("mouseup", function(evt) {
    evt.preventDefault();
    canvasElem.className = "openHand";
    zoomer.endTranslate();
    document.removeEventListener("mousemove", translate);
});

// called on mousemove, listener life from mousedown to mouseup
function translate(evt) {
    zoomer.translate(evt.clientX, evt.clientY);
}

// change zoom depth to match range
zoomRange.addEventListener("change", function(evt){
    var desiredDepth = parseInt(evt.target.value,10);
    zoomer.setDepth(desiredDepth);
});

// zoom in when '+' clicked
var zoomInButton = document.getElementById("zoomInButton");
zoomInButton.addEventListener("click", function (evt) {
    if (zoomer.depth() >= MAX_ZOOM || zoomer.busy()) {
        return;
    }
    zoomRange.value = zoomer.depth() + 1;
    zoomer.zoomInTo(canvas.center());
});

// zoom out when '-' clicked
var zoomOutButton = document.getElementById("zoomOutButton");
zoomOutButton.addEventListener("click", function (evt) {
    if (zoomer.depth() <= 0 || zoomer.busy()) {
        return;
    }
    zoomRange.value = zoomer.depth() - 1;
    zoomer.zoomOutFrom(canvas.center());
});
