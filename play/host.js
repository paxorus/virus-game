/* Prakhar Sahay 03/24/2015

Infecting host cell generates more viruses
*/

var HOST_NUM=3;
var DIM=[window.innerWidth,window.innerHeight];
var body=document.getElementsByTagName("body")[0];
var host_arr=[];
for(var i=0;i<HOST_NUM;i++){
	var img=document.createElement("img");
	img.src="host.svg";
	img.className=(i%2==0)?"host ying":"host yang";
	img.id="host"+i;
	host_arr.push(new Host(img));
	body.appendChild(img);
}

function Host(elem,i){
	this.elem=elem;
	this.x=Math.floor(Math.random()*(DIM[0]-200));
	this.elem.style.left=this.x+"px";
	this.y=Math.floor(Math.random()*(DIM[1]-200));
	this.elem.style.top=this.y+"px";
	this.h_disp=getHDisp(this.x,this.y);
	this.health=50;
	this.rate=0;
}

function getHDisp(x,y){
	var h_disp=document.createElement("div");
	h_disp.className="health_disp";
	h_disp.style.left=(x)+"px";
	h_disp.style.top=(y)+"px";
	body.appendChild(h_disp);
	return h_disp;
}