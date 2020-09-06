/* Prakhar Sahay 03/24/2015

Hitting spacebar begins the attack. Each animation frame, the proximities are studied and damage is applied.
*/

var floating=false;// ignore extraneous lysing
var CHILD_VIRUS_SPEED = 3;
const DAMAGE_RATE = 0.3;
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

		// Pause any child viruses.
		if (virus instanceof ChildVirus) {
			virus.pushing = targets.length === 0;
		}

		any_targets+=targets.length;
	});

	if (any_targets > 0) {
		applyDamage(cells);
	}

	setTimeout(() => infectAll(viruses, cells), 100);
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
			cell.health -= cell.rate;
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
	virus_arr.push(virus);
	body.appendChild(virus.elem);
	virus.applyAngle(theta);
}

function floatProgeny(){

	const progeny = virus_arr.filter(virus => virus instanceof ChildVirus);

	for(var i=0;i<progeny.length;i++){
		const p=progeny[i];

		// Move the child virus.
		if (p.pushing) {
			p.x += Math.cos(p.theta)* CHILD_VIRUS_SPEED;
			p.y -= Math.sin(p.theta)* CHILD_VIRUS_SPEED;
			p.elem.style.left = Math.floor(p.x);
			p.elem.style.top = Math.floor(p.y);
		}

		// Delete if out of bounds.
		if (hasExitedBoundaries(p)) {
			virus_arr.remove(p);
			body.removeChild(p.elem);
		}
	}
	
	// check if any within map
	if(progeny.length === 0){
		floating = false;
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