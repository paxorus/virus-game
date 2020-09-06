/* Prakhar Sahay 03/24/2015

Hitting spacebar begins the attack. Each animation frame, the proximities are studied and damage is applied.
*/

var lysing=false;// ignore extraneous space bar pressing
var floating=false;// ignore extraneous lysing
var STICKINESS=0.2;// probability of sticking
var CHILD_VIRUS_SPEED = 3;
const DAMAGE_RATE = 24;
const DAMAGE_RADIUS = 100;

function infectAll(viruses, cells){
	// recalculate infection rates, lysing
	cells.forEach(cell => {
		cell.rate = 0;
	});

	var any_targets=0;

	viruses.forEach(virus => {
		// find cells in range
		const targets = cells.filter(cell => getDistance(virus, cell) < DAMAGE_RADIUS);

		// divide damage across targets
		targets.forEach(cell => {
			cell.rate += DAMAGE_RATE / targets.length;
		});

		any_targets+=targets.length;
	});

	if (any_targets > 0) {
		applyDamage(cells);
	}

	setTimeout(() => infectAll(viruses, cells), 1000);
}

function getDistance(virus, host){
	var piercer=[virus.x+50-6*Math.sin(virus.theta), virus.y+50+6*Math.cos(virus.theta)];
	var cellCenter=[host.x+100,host.y+100];
	return Math.sqrt(Math.pow(piercer[0]-cellCenter[0],2)+Math.pow(piercer[1]-cellCenter[1],2));
}

function applyDamage(cells){
	cells
		.filter(cell => cell.rate > 0)
		.forEach(cell => {
			cell.health -= cell.rate / DAMAGE_RATE;
			cell.h_disp.textContent = Math.floor(cell.health);
			if (cell.health <= 0) {
				cell.lyse();
			}
		});
}

function getProgeny(){
	var img=document.createElement("img");
	img.src="images/virus.svg";
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
		p.x+=Math.cos(p.theta)* CHILD_VIRUS_SPEED;
		p.y-=Math.sin(p.theta)* CHILD_VIRUS_SPEED;
		p.elem.style.left= Math.floor(p.x);
		p.elem.style.top = Math.floor(p.y);

		if (hasExitedBoundaries(p)) {
			progeny.splice(i,1);
			body.removeChild(p.elem);
		}else if(Math.random()<STICKINESS){
			for(var k=0;k<host_arr.length;k++){
				if(getDistance(p,host_arr[k]) < DAMAGE_RADIUS){
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
		requestAnimationFrame(floatProgeny);
	}
}

function hasExitedBoundaries(virus) {
	return virus.x < -80
		|| virus.x > DIM[0] + 80
		|| virus.y < -80
		|| virus.y > DIM[1] + 80;
}