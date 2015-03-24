/* Prakhar Sahay 03/24/2015

Infecting host cell generates more viruses
*/

var HOST_NUM=7;
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

function Host(elem){
	this.elem=elem;
	this.elem.style.left=Math.random()*(DIM[0]-200)+"px";
	this.elem.style.top=Math.random()*(DIM[1]-200)+"px";
}