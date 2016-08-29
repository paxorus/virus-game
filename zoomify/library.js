var loadedNames,con,o,PANEL,panel,zooming,MAX_ZOOM,paint;// antroz.js


var Vector, LoadedImage, Canvas, ImageManager;

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

    this.name = name;
    this.safe = true;
    this.elem = document.createElement("img");
    this.elem.src = this.name;

    // this.elem.onload=function(){
    //     if(zooming){
    //         var blah = new Vector(o.x + panel.x * i, o.y + panel.y * j);
    //         canvas.draw(this, blah, panel);
    //     }else{
    //         var blah = new Vector(o.x + PANEL.x * i, o.y + PANEL.y * j);
    //         canvas.draw(this, blah, PANEL);
    //     }
    // };
    var that = this;
    this.elem.onload = function () {
        that.draw();
    };

    this.print=function(){
        return "{name:" + this.name + ",safe:" + this.safe + "}";
    };

    this.draw = function () {
        if (zooming) {
            var blah = new Vector(o.x + panel.x * i, o.y + panel.y * j);
            canvas.draw(this.elem, blah, panel);
        } else {
            var blah = new Vector(o.x + PANEL.x * i, o.y + PANEL.y * j);
            canvas.draw(this.elem, blah, PANEL);
        }
    }
}

function Canvas() {
    var element, context;

    this.constructor = function () {
        element = document.getElementById("canvas");
        context = element.getContext("2d");
        this.resize();
    }

    this.resize = function () {
        element.style.left = (window.innerWidth - element.width) / 2 + "px";
        element.style.top = (window.innerHeight - element.height) / 2+ "px";
    }

    this.clear = function () {
        element.width = element.width;
    }

    this.draw = function (blurry, o, blur) {
        context.drawImage(blurry, o.x, o.y, blur.x, blur.y);
    }

    this.element = function () {
        return element;
    }

    this.constructor();
}

function ImageManager(){
    var imageNames, loaded, loadedNames;

    this.constructor = function () {
        this.populateImageNames();
        loaded = [];
        loadedNames = [];
    }

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

    this.allUnsafe = function () {
        for(var each in loaded){
           loaded[each].safe = false;
        }
    }

    this.clean = function () {
        // remove unused images (images marked as set to safe)
        for (var i = loaded.length-1; i >=0; i--) {
            if (!loaded[i].safe) {// if unsafe
                var removed = loaded.splice(i, 1)[0].name;
                loadedNames.splice(i, 1);
            }
        }
    }

    this.getBlurry = function () {
        var blurry = document.createElement("img");
        console.log(imageNames);
        console.log(loaded);

        blurry.src = imageNames[0][0];
        blurry.onload = paint;
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
            loaded[index].draw();
        }
    }


    this.constructor();
}
















/*function onRepeat(){// recursive, calls paint
    paint();
    if(!terminate){
        raf(onRepeat);
    }
}*/