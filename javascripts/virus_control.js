/* Prakhar Sahay 03/24/2015

WASD and arrow keys to move two viruses. 
*/

class Virus {

	constructor(elem, x, y) {
		this.elem=elem;
		this.spinning=false;
		this.pushing=false;
		this.theta= Math.PI / 2;
		this.x=this.elem.style.left=x;
		this.y=this.elem.style.top=y;
	}

	applyAngle(theta) {
		// Theta is counter-clockwise from +x, but rotate(deg) works clockwise from +y.
		this.elem.style.webkitTransform = "rotate("+Math.floor(90 - theta * 180 / Math.PI)+"deg)";
		this.theta = theta;
	}
}

class ChildVirus extends Virus {

	constructor(elem, x, y) {
		super(elem, x, y);
		this.pushing = true;
	}

}

function spinVirus(v,dir){
	if(v.spinning){
		v.applyAngle(v.theta + dir);
		requestAnimationFrame(function(){spinVirus(v,dir)});
	}
}

function pushVirus(v,dir){
	if(v.pushing){
		v.x+=Math.cos(v.theta)*dir;
		v.y-=Math.sin(v.theta)*dir;
		v.elem.style.left=Math.floor(v.x);
		v.elem.style.top=Math.floor(v.y);
		requestAnimationFrame(function(){pushVirus(v,dir)});
	}
}

document.addEventListener("keydown",function(ev){
	var index=(ev.keyCode<60)?0:1;
	const virus = virus_arr[index];

	switch(ev.keyCode){
		case Keys.Left:
		case Keys.Right:
		case Keys.A:
		case Keys.D:
			var inProgress=virus.spinning;
			if(!inProgress){
				virus.spinning=true;
				const direction = (ev.keyCode==Keys.Left || ev.keyCode==Keys.A)? 1 : -1;
				requestAnimationFrame(function(){spinVirus(virus, direction * 0.04)});
			}
			break;
		case Keys.Up:
		case Keys.Down:
		case Keys.W:
		case Keys.S:
			var inProgress=virus.pushing;
			if(!inProgress){
				virus.pushing=true;
				const direction = (ev.keyCode==Keys.Down || ev.keyCode==Keys.S) ? -1 : 1;
				requestAnimationFrame(function(){pushVirus(virus, direction * 5)});
			}
			break;
		default:return;
	}

	// Prevent things like Ctrl+D opening a browser bookmark, or Ctrl+S opening a page save, where the new modal
	// will swallow all keyups.
	ev.preventDefault();
});

document.addEventListener("keyup",function(ev){
	var index=(ev.keyCode<60)?0:1;
	const virus = virus_arr[index];
	switch(ev.keyCode){
		case 37:case 39:case 65:case 68:virus.spinning=false;break;
		case 38:case 40:case 87:case 83:virus.pushing=false;break;
		default:return;
	}
});

const Keys = {
	Left: 37,
	Up: 38,
	Right: 39,
	Down: 40,
	A: 65,
	D: 68,
	S: 83,
	W: 87
}