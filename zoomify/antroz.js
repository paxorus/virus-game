/* Prakhar Sahay 05/01/2014

Double-clicking the canvas calls zoomToPoint, which repeatedly calls fatten, which calls paint.
Paint utilizes correctOrigin to quickly give a blurry background and then drawImage to draw clearer images on top.

*/

var Vector,LoadedImage;// library.js

var MAX_ZOOM = 2;

var canvas = new Canvas();
var imageManager = new ImageManager();
var zoomRange = document.getElementById("zoomRange");
var body = document.getElementsByTagName("body")[0];

var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(f) {setTimeout(f,15)};
var zoomLevel = 1;
var FRAMES = 20;
var o = new Vector(0,0);// origin, top-left
var oldo = new Vector(0,0);// helper variable for o
var start = new Vector(0,0);// helper variable for o
var PANEL = new Vector(400,300);// base image dimensions
var panel = new Vector(PANEL.x,PANEL.y);// during zooming 400x300-->800x600
var blur = new Vector(PANEL.x,PANEL.y);// image dimensions
var VIEW = new Vector(400,300);// canvas dimensions
var finalPoint;
var point = new Vector(0,0);// for zoomToPoint
var zooming = false;// true while zooming effect
// prepare zoomRange
zoomRange.max = MAX_ZOOM;
zoomRange.value = zoomLevel;
// prepare blurry
var blurry = imageManager.getBlurry();




// EVENT LISTENERS
// call zoomToPoint on double-click
var canvasElem = canvas.element();
canvasElem.addEventListener("dblclick", function(evt) {
    if(zoomLevel >= MAX_ZOOM){
        return;
    }
    zoomRange.value = zoomLevel + 1;
    point.set(evt.clientX - canvasElem.offsetLeft, evt.clientY - canvasElem.offsetTop);
    zoomToPoint(point);
});

canvasElem.addEventListener("mousedown", function(evt) {
    evt.preventDefault();
    canvasElem.className = "closedHand";
    start.set(evt.clientX, evt.clientY);
    document.addEventListener("mousemove", translate);
});

document.addEventListener("mouseup", function(evt) {
    canvasElem.className = "openHand";
    oldo.set(o.x, o.y);
    document.removeEventListener("mousemove", translate);
});

// called on mousemove, listener life from mousedown to mouseup
function translate(evt){
    o.set(evt.clientX - start.x + oldo.x, evt.clientY - start.y + oldo.y);
    paint();
    evt.stopPropagation();
}

zoomRange.addEventListener("change", function(evt){
    zoomLevel = parseInt(evt.target.value,10);
    paint();
});

// '+'
var zoomInButton = document.getElementById("zoomInButton");
zoomInButton.addEventListener("click", function (evt) {
    if (zoomLevel >= MAX_ZOOM || zooming) {
        return;
    }
    zoomRange.value=zoomLevel + 1;
    point.set(VIEW.x / 2, VIEW.y / 2);
    zoomToPoint();
});

// '-'
var zoomOutButton = document.getElementById("zoomOutButton");
zoomOutButton.addEventListener("click", function (evt) {
    if (zoomLevel <= 0 || zooming) {
        return;
    }
    zoomRange.value = zoomLevel - 1;
    point.set(VIEW.x / 2, VIEW.y / 2);
    zoomFromPoint();
});






// ensure that view is not out of bounds
function correctOrigin(){
    var blurSize=Math.pow(2,zoomLevel);
    if(zooming){// reassign
        blurSize=(zoomLevel>baseZoomLevel)?Math.pow(2,baseZoomLevel)*(1+df):Math.pow(2,baseZoomLevel)*(1-df/2);
    }
    
    blur.set(blurSize*PANEL.x,blurSize*PANEL.y);
    // console.log("Before: "+o.print());
    o.set(Math.min(o.x,0),Math.min(o.y,0));// origin maxes out at (0,0)
    // console.log("After: "+o.print());
    var generic=(zooming)?panel:PANEL;
    o.set(Math.max(o.x,VIEW.x-blur.x),Math.max(o.y,VIEW.y-blur.y));// origin mins...

    // zoomLevel =0:0, =1:-400, =2:-1200 =n:400(1-2^n)

}







 
// ZOOMING
var f;// fatness, goes 0-->100
var df;// goes 0-->1
var baseZoomLevel;
function zoomToPoint(){// triggered by dblclick or '+'
    if(zooming){
        return;
    }
    zooming=true;
    oldo.set(o.x,o.y);
    finalPoint=new Vector(2*(oldo.x-point.x)+VIEW.x/2,2*(oldo.y-point.y)+VIEW.y/2);
    // console.log("DBLCLICK: "+oldo.print()+"-->"+finalPoint.print());
    baseZoomLevel=zoomLevel;
    f=0;
    df=0;
    raf(fatten);
}
function zoomFromPoint(){// triggered by '-'
    if(zooming){
        return;
    }

    zooming=true;
    oldo.set(o.x,o.y);
    finalPoint=new Vector(oldo.x/2-VIEW.x/4+point.x,oldo.y/2-VIEW.y/4+point.y);
    // finalPoint=new Vector(3/4*oldo.x+point.x/2,3/4*oldo.y+point.y/2);
    // console.log("oldo: "+oldo.print());
    // console.log("finalPoint: "+finalPoint.print());
    baseZoomLevel=zoomLevel;
    f=0;
    df=0;
    raf(fatten2);
}

function fatten(){// recursive
    df=f/FRAMES;// f/100
    o.x=Math.round((finalPoint.x-oldo.x)*df+oldo.x);
    o.y=Math.round((finalPoint.y-oldo.y)*df+oldo.y);
    zoomLevel=baseZoomLevel+df;
    panel.set((1+df)*PANEL.x,(1+df)*PANEL.y);
    paint();

    if(f<FRAMES){
        f++;
        raf(fatten);
    }else{
        console.log("DONE: "+o.print());
        zooming=false;
        baseZoomLevel=zoomLevel;
        panel.set(PANEL.x,PANEL.y);
        oldo.set(o.x,o.y);
        paint();
    }
}

function fatten2(){// recursive
    df=f/FRAMES;// f/100
    o.x=Math.round((finalPoint.x-oldo.x)*df+oldo.x);
    o.y=Math.round((finalPoint.y-oldo.y)*df+oldo.y);
    zoomLevel=baseZoomLevel-df;
    panel.set((1-df/2)*PANEL.x,(1-df/2)*PANEL.y);
    paint();

    // console.log("Full size: "+blur.print());
    if(f<FRAMES){
        f++;
        raf(fatten2);
    }else{
        // console.log("DONE: "+o.print());
        zooming=false;
        baseZoomLevel=zoomLevel;
        panel.set(PANEL.x,PANEL.y);
        oldo.set(o.x,o.y);
        paint();
    }
}

/*function skip(){
    zoomLevel++;
    o.x=Math.round(2*oldo.x-2*point.x+VIEW.x/2);
    o.y=Math.round(2*oldo.y-2*point.y+VIEW.y/2);
    oldo.set(o.x,o.y);
    paint();
}*/








// rendering core: for panning and zooming
// assume each image to be unsafe, calculate left and right limits,
// drawImage and mark safe if in bounds, delete all unsafe images
function paint(){
    correctOrigin();
    canvas.clear();
    canvas.draw(blurry, o, blur);

    // reset all images as unused
    imageManager.allUnsafe();


    
    var generic=(zooming)?panel:PANEL;
    // draw relevant images, mark them as used
    var left=new Vector(Math.floor(-o.x/generic.x),Math.floor(-o.y/generic.y));
    var right=new Vector(Math.ceil((-o.x+VIEW.x)/generic.x)-1,Math.ceil((-o.y+VIEW.y)/generic.y)-1);
    

    for(var i=left.x;i<=right.x;i++){// across x-axis
        for(var j=left.y;j<=right.y;j++){// across y-axis
            imageManager.load(baseZoomLevel, i, j);
        }
    }
    
    imageManager.clean();
}








// print all images in loaded[]
function p(){var str="";for(var each in loaded){str+="\n"+loaded[each].name;}console.log(str.substring(1));}