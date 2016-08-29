var loadedNames,con,o,PANEL,panel,zooming,MAX_ZOOM,imgs,paint;// antroz.js
var MAX_ZOOM=2;
var zoomer=document.getElementById("zoomer");
var canvas=document.getElementById("canvas");
var con=canvas.getContext("2d");
var body=document.getElementsByTagName("body")[0];

function Vector(xarg,yarg){
    this.set=function(x,y){this.x=x;this.y=y};
    this.set(xarg,yarg);
    this.print=function(){return "("+this.x+","+this.y+")"};
}

function LoadedImage(i,j,name){
    //var valid=["a00","b00","b01","b10","b11","c00","c01","c02","c03","c10","c11","c12","c13",
    // "c20","c21","c22","c23","c30","c31","c32","c33"];

    this.name=name;
    loadedNames.push(this.name);
    this.elem=document.createElement("img");

    //var x=name.substring(7,10);
    //console.log("here: "+x);
    //if(valid.indexOf(x)==-1){console.log("halt!");return}

    this.elem.src=this.name;
    this.elem.onload=function(){
        if(zooming){
            con.drawImage(this,o.x+panel.x*i,o.y+panel.y*j,panel.x,panel.y);
        }else{
            con.drawImage(this,o.x+PANEL.x*i,o.y+PANEL.y*j,PANEL.x,PANEL.y);
        }
    };
    this.safe=true;
    this.print=function(){return "{name:"+this.name+",safe:"+this.safe+"}"};
}

function windowResize(){
    canvas.style.left=(window.innerWidth-canvas.width)/2+"px";
    canvas.style.top=(window.innerHeight-canvas.height)/2+"px";
}windowResize();

var imgs=[];
function getImageNames(){
    for(var loop=0;loop<=MAX_ZOOM;loop++){// from a to c's, 0,1,2
        var atZoom=[];
        var int=Math.pow(2,loop);
        for(var loop2=0;loop2<Math.pow(4,loop);loop2++){ // 0,0-->3,0-->15
            var newId=String.fromCharCode(loop+97)+Math.floor(loop2/int)+loop2%int;
            atZoom.push("images/400-by-300/"+newId+".bmp"); // "a00.bmp", "c32.bmp"
        }
        imgs.push(atZoom);
    }
}getImageNames();












canvas.addEventListener("mousedown",function(ev){
    ev.preventDefault();
    dragStart(ev);
});// dragStart on mousedown
body.addEventListener("mouseup",function(ev){
    dragStop(ev);
});// dragStop on mouseup

function dragStart(ev){
    canvas.className="closedHand";
    start.set(ev.clientX,ev.clientY);
    document.addEventListener("mousemove",translate);
}

function dragStop(ev){
    canvas.className="openHand";
    oldo.set(o.x,o.y);
    document.removeEventListener("mousemove",translate);
}

/*function onRepeat(){// recursive, calls paint
    paint();
    if(!terminate){
        raf(onRepeat);
    }
}*/