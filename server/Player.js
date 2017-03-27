/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY, startColor) {
	var x = startX,
		y = startY,
		color = startColor,
		id;

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

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getColor: getColor,
		setColor: setColor,
		id: id
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;