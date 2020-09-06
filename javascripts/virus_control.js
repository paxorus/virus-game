/* Prakhar Sahay 03/24/2015

WASD and arrow keys to move two viruses. 
*/

function Virus(elem,x,y){
	this.elem=elem;
	this.spinning=false;
	this.pushing=false;
	this.theta=0;
	this.x=this.elem.style.left=x;
	this.y=this.elem.style.top=y;
	this.getTransform=function(){
		return "rotate("+Math.floor(this.theta*180/Math.PI)+"deg)";
	}
}

function spinVirus(v,dir){
	if(v.spinning){
		v.theta+=dir;
		v.elem.style.webkitTransform=v.getTransform();
		requestAnimationFrame(function(){spinVirus(v,dir)});
	}
}

function pushVirus(v,dir){
	if(v.pushing){
		v.x+=Math.sin(v.theta)*dir;
		v.y-=Math.cos(v.theta)*dir;
		v.elem.style.left=Math.floor(v.x);
		v.elem.style.top=Math.floor(v.y);
		requestAnimationFrame(function(){pushVirus(v,dir)});
	}
}

document.addEventListener("keydown",function(ev){
	var index=(ev.keyCode<60)?0:1;

	switch(ev.keyCode){
		case 37:case 39:case 65:case 68://left,right
			var inProgress=virus_arr[index].spinning;
			if(!inProgress){
				virus_arr[index].spinning=true;	
				requestAnimationFrame(function(){spinVirus(virus_arr[index],(ev.keyCode==37 || ev.keyCode==65)?-0.04:0.04)});
			}
			break;
		case 38:case 40:case 87:case 83://up,down
			var inProgress=virus_arr[index].pushing;
			if(!inProgress){
				virus_arr[index].pushing=true;
				requestAnimationFrame(function(){pushVirus(virus_arr[index],(ev.keyCode==40 || ev.keyCode==83)?-5:5)});
			}
			break;
		default:return;
	}
});

document.addEventListener("keyup",function(ev){
	var index=(ev.keyCode<60)?0:1;
	switch(ev.keyCode){
		case 37:case 39:case 65:case 68:virus_arr[index].spinning=false;break;
		case 38:case 40:case 87:case 83:virus_arr[index].pushing=false;break;
		default:return;
	}
});
