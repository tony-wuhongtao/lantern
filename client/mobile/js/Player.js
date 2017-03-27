/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY, color) {
	var x = startX,
		y = startY,
		color = color,
		id,
		moveAmount = 2;
	var canvasWidth = 1024;
	var canvasHeight =	768;

	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var getColor = function() {
		return color;
	};

	var setColor = function(newColor) {
		color = newColor;
	};

	// Update player position
	var updateMove = function(devOris) {

		var prevX = x,
			prevY = y;

		// Up key takes priority over down
		if (devOris.up) {
			if(prevY > 3+5){
				y -= 1;
			}			
		} else if (devOris.down) {
			if(prevY < canvasHeight-3-5){
				y += 1;
			}
			
		};

		// Left key takes priority over right
		if (devOris.left) {
			if(prevX > 3+5){
				x -= 1;
			}
			
		} else if (devOris.right) {
			if(prevX < canvasWidth-3-5){
				x += 1;
			}
			
		};

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
		ctx.fillStyle = color;
		ctx.fillRect(x-5, y-5, 10, 10);
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getColor: getColor,
		setX: setX,
		setY: setY,
		setColor: setColor,
		updateMove: updateMove,
		draw: draw
	}
};