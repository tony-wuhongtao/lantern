/**************************************************
** GAME DEVICE ORIENTATION CLASS
**************************************************/
var DevOris = function(up, left, right, down) {
	var up = up || false,
		left = left || false,
		right = right || false,
		down = down || false;
	var dltY = 0, dltX = 0;
		
	var onMove = function(e) {
		var that = this,
		dltY = e.beta;
		//beta < 0 -----UP
		//beta > 0 -----DOWN
		dltX = e.gamma;
		//gamma >0 -----RIGHT
		//gamma <0 -----LEFT
		if(dltY > 1){
			that.down = true;
		}else if(dltY < -1) {
			that.up = true;
		}else{
			that.up = false;
			that.down = false;
		}

		if(dltX > 1){
			that.right = true;
		}else if(dltX < -1) {
			that.left = true;
		}else{
			that.right = false;
			that.left = false;
		}

	}

	return {
		up: up,
		left: left,
		right: right,
		down: down,
		stepX: Math.abs(dltX),
		stepY: Math.abs(dltY),
		onMove: onMove
	};
};