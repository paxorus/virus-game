var Vector, Canvas, LoadedImage, ImageManager, Zoomer;

// MODELS

function Vector(xarg, yarg){
    this.set = function (x, y){
        this.x = x;
        this.y = y;
    };
    this.set(xarg, yarg);

    this.print = function(){
        return "(" + this.x + "," + this.y + ")";
    };
}

function LoadedImage(i, j, name){

    this.constructor = function () {
        this.name = name;
        this.safe = true;
        this.elem = document.createElement("img");
        this.elem.src = this.name;

        var that = this;
        this.elem.onload = function () {
            that.draw();
        };
    }

    this.draw = function () {
        this.safe = true;
        var panel = zoomer.panel();
        var origin = zoomer.origin();
        var coordinates = new Vector(origin.x + panel.x * i, origin.y + panel.y * j);
        canvas.draw(this.elem, coordinates, panel);
    }

    this.toString=function(){
        return "{name:" + this.name + ", safe:" + this.safe + "}";
    };

    this.constructor();
}

function ImageManager(){
    var imageNames, loaded, loadedNames;

    this.constructor = function () {
        this.populateImageNames();
        loaded = [];
        loadedNames = [];
    }

    // generate all possible image names from 0 to MAX_ZOOM
    this.populateImageNames = function() {
        imageNames = [];
        // from a to c's, 0,1,2
        for (var i = 0; i <= MAX_ZOOM; i++){
            var atZoom = [];
            var int = Math.pow(2, i);

            // 0,0-->3,0-->15
            for (var j = 0; j < Math.pow(4, i); j++){
                var newId = String.fromCharCode(i + 97) + Math.floor(j / int) + j % int;
                atZoom.push("images/400-by-300/" + newId + ".bmp"); // "a00.bmp", "c32.bmp"
            }
            imageNames.push(atZoom);
        }
    }

    // assume all loaded images are unnecessary
    this.allUnsafe = function () {
        for (var each in loaded) {
           loaded[each].safe = false;
        }
    }

    // remove unused (safe) images
    this.clean = function () {
        for (var i = loaded.length - 1; i >= 0; i --) {
            if (!loaded[i].safe) {// if unsafe
                var removed = loaded.splice(i, 1)[0].name;
                loadedNames.splice(i, 1);
            }
        }
    }

    this.getBlurry = function () {
        var blurry = document.createElement("img");
        blurry.src = imageNames[0][0];
        blurry.onload = function () {
            zoomer.update();
        }
        return blurry;
    }

    this.load = function (z, i, j, callback) {
        var id = String.fromCharCode(97 + z) + i + j;// "a00", "c34"
        var name = "images/400-by-300/" + id + ".bmp";
        var index = loadedNames.indexOf(name);

        if (index == -1) {
            loaded.push(new LoadedImage(i, j, name, callback));
            loadedNames.push(name);
        } else {
            loaded[index].safe = true;
            loaded[index].draw();
        }
    }

    this._dump = function () {
        return loadedNames;
    }

    this.constructor();
}





function Zoomer(){
    var origin = new Vector(0, 0);// origin, top-left
    var oldOrigin = new Vector(0, 0);// helper variable for origin
    var start = new Vector(0, 0);// helper variable for origin
    var PANEL = new Vector(400, 300);// base image dimensions
    var panel = new Vector(PANEL.x, PANEL.y);// during zooming 400x300-->800x600
    var blur = new Vector(PANEL.x, PANEL.y);// image dimensions
    var depth = 1;
    var f;// fatness, goes 0-->100
    var df;// goes 0-->1
    var baseDepth = depth;
    var that = this;

    var finalPoint;
    var zooming = false;// true while zooming effect
    zoomRange.value = depth;


    // ensure that canvas.dim() is not out of bounds
    this.correctOrigin = function() {
        var blurSize = Math.pow(2, depth);
        if (zooming) {// reassign
            blurSize = (depth > baseDepth) ? Math.pow(2, baseDepth) * (1 + df) : Math.pow(2, baseDepth) * (1 - df / 2);
        }
        
        blur.set(blurSize * PANEL.x, blurSize * PANEL.y);
        origin.set(Math.min(origin.x, 0), Math.min(origin.y, 0));// origin maxes out at (0,0)
        origin.set(Math.max(origin.x, canvas.dim().x - blur.x), Math.max(origin.y, canvas.dim().y - blur.y));// origin mins...

        // depth =0:0, =1:-400, =2:-1200 =n:400(1-2^n)
    }


    this.zoomInTo = function(point) {// triggered by dblclick or '+'
        if (zooming) {
            return;
        }
        finalPoint = new Vector(2 * (oldOrigin.x - point.x) + canvas.dim().x / 2, 2 * (oldOrigin.y - point.y) + canvas.dim().y / 2);
        this.step = this.stepIn;
        this.startZooming();
    }

    // zoom out while recentering, starts rendering loop
    this.zoomOutFrom = function(point) {
        if (zooming) {
            return;
        }
        finalPoint = new Vector(oldOrigin.x / 2 - canvas.dim().x / 4 + point.x, oldOrigin.y / 2 - canvas.dim().y / 4 + point.y);
        this.step = this.stepOut;
        this.startZooming();
    }

    this.stepIn = function () {// recursive
        depth = baseDepth + df;
        panel.set((1 + df) * PANEL.x, (1 + df) * PANEL.y);
    }

    this.stepOut = function () {// recursive
        depth = baseDepth - df;
        panel.set((1 - df / 2) * PANEL.x, (1 - df / 2) * PANEL.y);
    }

    this.startZooming = function () {
        zooming = true;
        oldOrigin.set(origin.x, origin.y);

        baseDepth = depth;
        f = 0;
        df = 0;
        raf(function () {
            that.animate();
        });        
    }

    this.animate = function () {// recursive
        df = f / FRAMES;// f/100
        origin.x = Math.round((finalPoint.x - oldOrigin.x) * df + oldOrigin.x);
        origin.y = Math.round((finalPoint.y - oldOrigin.y) * df + oldOrigin.y);
        this.step();
        this.update();

        if (f < FRAMES) {
            f ++;
            raf(function () {
                that.animate();
            });
        } else {
            zooming = false;
            baseDepth = depth;
            panel.set(PANEL.x, PANEL.y);
            oldOrigin.set(origin.x, origin.y);
            this.update();
        }
    }

    // rendering core: for panning and zooming
    // assume each image to be unsafe, calculate left and right limits,
    // drawImage and mark safe if in bounds, delete all unsafe images
    this.update = function () {
        this.correctOrigin();
        canvas.clear();
        canvas.draw(blurry, origin, blur);

        // reset all images as unused
        imageManager.allUnsafe();
        
        // draw relevant images, mark them as used
        var left = _getLeft();
        var right = _getRight();

        for(var i = left.x; i <= right.x; i ++){// across x-axis
            for(var j = left.y; j <= right.y; j ++){// across y-axis
                imageManager.load(baseDepth, i, j);
            }
        }
        
        imageManager.clean();
    }

    this.origin = function () {
        return origin;
    }

    this.setOrigin = function (x, y) {
        origin.set(x, y);
        this.update();
    }

    this.setDepth = function (z) {
        depth = z;
        this.update();
    }

    this.depth = function () {
        return depth;
    }

    this.startTranslate = function (x, y) {
        start = new Vector(x, y);
    }

    this.endTranslate = function () {
        oldOrigin.set(origin.x, origin.y);
    }

    this.translate = function (x, y) {
        zoomer.setOrigin(x - start.x + oldOrigin.x, y - start.y + oldOrigin.y);
    }

    this.panel = function () {
        return panel;
    }

    this.busy = function () {
        return zooming;
    }

    function _getLeft() {
        var x = Math.floor(-origin.x / panel.x);
        var y = Math.floor(-origin.y / panel.y);
        return new Vector(x, y);
    }

    function _getRight() {
        var x = Math.ceil((-origin.x + canvas.dim().x) / panel.x) - 1;
        var y = Math.ceil((-origin.y + canvas.dim().y) / panel.y) - 1;
        return new Vector(x, y);
    }
}


// VIEW

function Canvas() {
    var element, context;

    // initial resize
    this.constructor = function () {
        element = document.getElementById("canvas");
        context = element.getContext("2d");
        this.resize();
    }

    // center canvas on page
    this.resize = function () {
        element.style.left = (window.innerWidth - element.width) / 2 + "px";
        element.style.top = (window.innerHeight - element.height) / 2+ "px";
    }

    // clear the canvas
    this.clear = function () {
        element.width = element.width;
    }

    // 
    this.draw = function (image, position, dimensions) {
        context.drawImage(image, position.x, position.y, dimensions.x, dimensions.y);
    }

    // get the DOM element 
    this.element = function () {
        return element;
    }

    this.dim = function () {
        return new Vector(element.width, element.height);
    }

    this.center = function () {
        return new Vector(element.width / 2, element.height / 2);
    }

    this.constructor();
}