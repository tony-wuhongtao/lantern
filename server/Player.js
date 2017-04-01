/**************************************************
** GAME PLAYER CLASS WITH SPRITE
**************************************************/
var Player = function(opt) {
	var frameIndex = 0;	//The current frame to be displayed
	var tickCount = 0; 	//The number updates since the current frame was first displayed

	var that = {};
	
	that.ticksPerFrame = opt.ticksPerFrame || 0;//The number updates until the next frame should be displayed
	that.numberOfFrames = opt.numberOfFrames || 1; //How many frames in a whole animate sprite

	that.context = opt.context || 0;
	that.width = opt.width;
	that.height = opt.height;

	that.image = opt.image;

	that.x = opt.x || 0;
	that.y = opt.y || 0;

	that.scaleRatio = opt.scaleRatio || 1;

	that.speed = opt.speed;

	that.id = opt.id || 0;

	that.update = function () {
		tickCount += 1;

		if(tickCount > that.ticksPerFrame) {
			tickCount = 0;
			if(frameIndex < that.numberOfFrames - 1) {
				frameIndex += 1;
			} else {
				frameIndex = 0;
			}
			
			that.y -= that.speed;
		}
	};

	that.render = function () {
		//Draw the animation
		that.context.drawImage(
			that.image,
			frameIndex * that.width / that.numberOfFrames,
			0,
			that.width / that.numberOfFrames,
			that.height,
			that.x,
			that.y,
			that.width / that.numberOfFrames * that.scaleRatio,
			that.height * that.scaleRatio);
	};

	that.getFrameWidth = function () {
		return that.width / that.numberOfFrames;
	};

	return that;
};

exports.Player = Player;
