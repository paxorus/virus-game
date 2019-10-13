/* Prakhar Sahay 03/24/2015

Hitting spacebar begins the attack. Each raf the proximities are studied and damage is applied.
*/

var lysing=false;// ignore extraneous space bar pressing
var floating=false;// ignore extraneous lysing
var STICKINESS=0.2;// probability of sticking
var PROLIFERATION=4;
var PROG_SPEED=3;

document.addEventListener("keypress",function(ev){
	if(ev.keyCode==32 && !lysing){// space
		lysing=true;
		infectAll(virus_arr,host_arr);
	}
});

function infectAll(v,h){
	// recalculate infection rates, lysing
	for(var l=0;l<h.length;l++){
		h[l].rate=0;
	}
	var any_targets=0;
	for(var i=0;i<v.length;i++){
		// find cells in range
		var targets=[];
		for(var j=0;j<h.length;j++){
			if(dist(v[i],h[j])){
				targets.push(h[j]);
			}
		}
		// divide 24 across targets
		for(var k=0;k<targets.length;k++){
			targets[k].rate+=24/targets.length;
		}
		any_targets+=targets.length;
	}
	if(any_targets==0){
		lysing=false;
	}else{
		applyDamage(h,function(){infectAll(v,h)});
	}
}

function dist(v,h){
	var p=[v.x+50-6*Math.sin(v.theta),v.y+50+6*Math.cos(v.theta)];// piercer
	var c=[h.x+100,h.y+100];// cell center
	return Math.sqrt(Math.pow(p[0]-c[0],2)+Math.pow(p[1]-c[1],2))<100;
}

function applyDamage(h,callback){
	for(var i=0;i<h.length;i++){
		if(h[i].rate>0){
			h[i].health-=h[i].rate/24;
			h[i].h_disp.textContent=Math.floor(h[i].health);
			if(h[i].health<=0){
				lyse(h[i]);
			}
		}
	}
	setTimeout(callback,1000);
}

function lyse(host_cell){
	var id=host_cell.elem.id;
	for(var j=0,go=true;go && j<host_arr.length;j++){// selective pop
		if(id==host_arr[j].elem.id){
			go=false;
		}
	}
	host_arr.splice(j-1,1);
	body.removeChild(host_cell.h_disp);
	expand(host_cell,0);

	// spawn viruses
	var x=host_cell.x+63;
	var y=host_cell.y+63;
	for(var i=0;i<PROLIFERATION;i++){
		var elem=getProgeny();
		var new_vir=new Virus(elem,x,y);
		setProgeny(new_vir);
	}
	if(!floating){
		floating=true;
		floatProgeny();
	}
}

function expand(c,percent){
	if(percent>=100){
		body.removeChild(c.elem);
	}else{
		percent+=3;
		var cell=c.elem;
		cell.style.width=200+percent;
		cell.style.left=c.x-percent/2;
		cell.style.top=c.y-percent/2;
		cell.style.height=200+percent;
		cell.style.opacity=1-percent/100;
		raf(function(){expand(c,percent)});
	}
}

function getProgeny(){
	var img=document.createElement("img");
	img.src="virus.svg";
	img.className="virus";
	return img;
}

function setProgeny(virus){
	var theta=Math.random()*2*Math.PI;
	progeny.push(virus);
	body.appendChild(virus.elem);
	virus.theta=theta;
	virus.elem.style.webkitTransform=virus.getTransform();
}

function floatProgeny(){
	// move them all, check for out of bounds, randomly try to anchor one
	for(var i=0;i<progeny.length;i++){
		var p=progeny[i];
		p.x+=Math.floor(Math.sin(p.theta)*PROG_SPEED);
		p.y-=Math.floor(Math.cos(p.theta)*PROG_SPEED);
		p.elem.style.left=p.x;
		p.elem.style.top=p.y;

		if(p.x<-80 || p.x>DIM[0]+80 || p.y<-80 || p.y>DIM[1]+80){
			progeny.splice(i,1);
			body.removeChild(p.elem);
		}else if(Math.random()<STICKINESS){
			for(var k=0;k<host_arr.length;k++){
				if(dist(p,host_arr[k])){
					console.log("here");
					k=host_arr.length+10;// break the loop
					progeny.splice(i,1);
					virus_arr.push(p);
				}
			}
		}
	}
	
	// check if any within map
	if(progeny.length==0){
		floating=false;
	}
	if(floating){
		raf(floatProgeny);
	}
}