/* Prakhar Sahay 03/24/2015

Infecting host cell generates more viruses
*/

var HOST_NUM=10;
var DIM=[window.innerWidth,window.innerHeight];
var body=document.body;
var PROLIFERATION = 4;

function Host(elem,i){

	this.lyse = function () {
		// Remove from host_arr.
		host_arr.remove(this);

		// Remove from DOM.
		body.removeChild(this.h_disp);

		this.expand(0);

		// Spawn child viruses.
		var x=this.x+63;
		var y=this.y+63;
		for(var i=0;i<PROLIFERATION;i++){
			var elem=getProgeny();
			var new_vir=new ChildVirus(elem,x,y);
			setProgeny(new_vir);
		}

		// Start the motion loop for child viruses.
		if(!floating){
			floating = true;
			floatProgeny();
		}
	};

	this.expand = function (percent) {
		if(percent>=100){
			body.removeChild(elem);
		} else {
			percent+=3;
			elem.style.width=200+percent;
			elem.style.left= this.x-percent/2;
			elem.style.top= this.y-percent/2;
			elem.style.height=200+percent;
			elem.style.opacity=1-percent/100;
			requestAnimationFrame(() => this.expand(percent));
		}
	};

	this.buildHealthPointsView = function (x,y){
		var h_disp=document.createElement("div");
		h_disp.className="health_disp";
		h_disp.style.left=(x)+"px";
		h_disp.style.top=(y)+"px";
		body.appendChild(h_disp);
		return h_disp;
	};

	this.elem=elem;
	this.health=50;
	this.rate=0;
	this.x=Math.floor(Math.random()*(DIM[0]-200));
	this.elem.style.left=this.x+"px";
	this.y=Math.floor(Math.random()*(DIM[1]-200));
	this.elem.style.top=this.y+"px";
	this.h_disp = this.buildHealthPointsView(this.x,this.y);
}