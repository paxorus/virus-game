/* Prakhar Sahay 03/10/2015

team[] and enemy[] are initialized. The Pokemon and moves are rendered, and attacks are handled.
*/

function Organic(img_src,name,lvl,hp,moves){
	this.img=document.createElement("img");
	this.img.src=img_src;
	this.name=name;
	this.lvl=lvl;
	this.hp=hp;
	this.moves=moves;
	console.log(args);
}

var move_library={
	"Surf":[60,90],
	"Aqua sphere":[30,40],
	"Drown":[0,100],
	"Bone crush":[25,75],
	"High beam":[60,90],
	"Low beam":[30,60],
};


// BEGIN
var team=[new Organic("poke1.jpg","Swampy",36,160,["Surf","Aqua sphere","Drown"])];
var enemy=[new Organic("poke2.jpg","Nidoking",100,1600),["Bone crush","High beam","Low beam"]];
var p1=document.getElementById("poke1");
var p2=document.getElementById("poke2");

display(team[0],p1);
display(enemy[0],p2);

function display(poke,elem){
	elem.appendChild(poke.img);
	var meter=elem.getElementsByClassName("hp");
	meter.value=meter.max=poke.hp;
	elem.getElementsByClassName("lvl")[0].textContent=poke.lvl;
}

