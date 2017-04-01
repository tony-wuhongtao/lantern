/**************************************************
** GAME VARIABLES
**************************************************/
var canvas;		// Canvas DOM element
var numPlayers = 1;
var players = [];

// var serverURL = "http://demo.redline-china.com";
// var serverURL = "http://localhost";
/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {

	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");

	// Maximise the canvas
	canvas.width = window.innerWidth-60;
	canvas.height = window.innerHeight-60;
	canvas.style.margin = 'auto auto';
	canvas.style.position='absolute';
	canvas.style.top = '20px';
	canvas.style.left = '30px';





	// var i;

	// for (i = 0; i < numPlayers; i += 1) {
	
	// 	createPlayer2();
	// }
	
	createLocalSelecterList();
	gameLoop();
	
	// For mouse 
	canvas.addEventListener("mousedown", onMouseDown, false);
	
	canvas.addEventListener("mouseup", onMouseUp, false);
	
	canvas.addEventListener("mousemove", onMouseMove, false);

	//For Mobile Touch
	// Set up touch events for mobile, etc
	canvas.addEventListener("touchstart", onTouchStart, false);
	canvas.addEventListener("touchend", onTouchEnd, false);
	canvas.addEventListener("touchmove", onTouchMove, false);

	// Prevent scrolling when touching the canvas
	document.body.addEventListener("touchstart", function (e) {
	  if (e.target == canvas) {
	    e.preventDefault();
	  }
	}, false);
	document.body.addEventListener("touchend", function (e) {
	  if (e.target == canvas) {
	    e.preventDefault();
	  }
	}, false);
	document.body.addEventListener("touchmove", function (e) {
	  if (e.target == canvas) {
	    e.preventDefault();
	  }
	}, false);

	



};

//Mouse event handle
//==================
// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: mouseEvent.clientX - rect.left,
    y: mouseEvent.clientY - rect.top
  };
};

function onMouseDown (e) {
	lastPos = getMousePos(canvas, e);
};

function onMouseUp (e) {
	console.log("mouse up send message");
	// console.log("x,y: %o", lastPos);
	if(lastPos.y < canvas.height/2){
		console.log("Click Up");
	}else{
		console.log("Click Down");
	}
};

function onMouseMove (e) {
	mousePos = getMousePos(canvas, e);
};

//=============
function onTouchStart(e) {
	mousePos = getTouchPos(canvas, e);
	var touch = e.touches[0];
	var mouseEvent = new MouseEvent("mousedown", {
		clientX: touch.clientX,
		clientY: touch.clientY
	});
	canvas.dispatchEvent(mouseEvent);
};

function onTouchEnd(e) {
	var mouseEvent = new MouseEvent("mouseup", {});
	canvas.dispatchEvent(mouseEvent);
	if(mousePos.y < canvas.height/2){
		console.log("Click Up");
	}else{
		console.log("Click Down");
	}

};

function onTouchMove(e) {
	var touch = e.touches[0];
	var mouseEvent = new MouseEvent("mousemove", {
	clientX: touch.clientX,
	clientY: touch.clientY
	});
	canvas.dispatchEvent(mouseEvent);
};
// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
	var rect = canvasDom.getBoundingClientRect();
	return {
		x: touchEvent.touches[0].clientX - rect.left,
		y: touchEvent.touches[0].clientY - rect.top
	};
};


//======================


function gameLoop () {
	
  var i;

  window.requestAnimationFrame(gameLoop);
  
  // Clear the canvas
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

  for (i = 0; i < players.length; i += 1) {
	  players[i].update();
	  players[i].render();
	  // console.log("%o", players[i]);
  }


};

function createPlayer () {

	var playerIndex,
		playerImg;

	// Create sprite sheet
	playerImg = new Image();	

	playerIndex = players.length;

	// Create sprite
	players[playerIndex] = Player({
		context: canvas.getContext("2d"),
		width: 1000,
		height: 100,
		image: playerImg,
		numberOfFrames: 10,
		ticksPerFrame: 4,
		speed: 2,
	});

	players[playerIndex].x = Math.random() * (canvas.width - players[playerIndex].getFrameWidth() * players[playerIndex].scaleRatio);
	// players[playerIndex].y = players.height - players[playerIndex].height * players[playerIndex].scaleRatio;
	players[playerIndex].y = canvas.height;

	players[playerIndex].speed = randomNum(2,10);

	players[playerIndex].scaleRatio = Math.random() * 0.5 + 0.5;

	// Load sprite sheet
	playerImg.src = "images/c1.png";
};

//=============
function createPlayer2 () {

	var playerIndex,
		playerImg;

	// Create sprite sheet
	playerImg = new Image();	

	playerIndex = players.length;

	// Create sprite
	players[playerIndex] = Player({
		context: canvas.getContext("2d"),
		width: 7200,
		height: 300,
		image: playerImg,
		numberOfFrames: 24,
		ticksPerFrame: 0,
		speed: 1,
	});

	players[playerIndex].x = Math.random() * (canvas.width - players[playerIndex].getFrameWidth() * players[playerIndex].scaleRatio);
	// players[playerIndex].y = players.height - players[playerIndex].height * players[playerIndex].scaleRatio;
	players[playerIndex].y = canvas.height;

	players[playerIndex].speed = randomNum(2,10);

	players[playerIndex].scaleRatio = Math.random() * 0.5 + 0.5;

	// Load sprite sheet
	playerImg.src = "images/c2.png";
};


function createLocalPlayer (n, img, width, height, numberOfFrames, ticksPerFrame, x, y, scaleRatio) {
	var playerImg;

	// Create sprite sheet
	playerImg = new Image();	

	// Load sprite sheet
	playerImg.src = img;

	// Create sprite
	players[n] = Player({
		context: canvas.getContext("2d"),
		width: width,
		height: height,
		image: playerImg,
		numberOfFrames: numberOfFrames,
		ticksPerFrame: ticksPerFrame,
	});

	players[n].speed = 0;
	players[n].scaleRatio = scaleRatio;

	players[n].x = x;
	players[n].y = y;

	console.log("create "+ n + " is "+ players[n].x + "," +players[n].scaleRatio);
	// players[n].update();
	// players[n].render();

};

function createLocalSelecterList () {
	var c1 = {};
	c1.scaleRatio = 2.5;
	c1.img = "images/c1.png";
	c1.width = 1000;
	c1.height = 100;
	c1.numberOfFrames = 10;
	c1.ticksPerFrame =  4;
	c1.x = canvas.width/2 - 100/2*c1.scaleRatio;
	c1.y = canvas.height/2 - 100*c1.scaleRatio;


	// var c2 = {};
	// c2.scaleRatio = 1;
	// c2.img = "images/c2.png";
	// c2.width = 7200;
	// c2.height = 300;
	// c2.numberOfFrames = 24;
	// c2.ticksPerFrame = 0;
	// c2.x = canvas.width/2 -300/2*c2.scaleRatio;
	// c2.y = canvas.height/2 + 100*c2.scaleRatio;
	var c2 = {};
	c2.scaleRatio = 2;
	c2.img = "images/l1.png";
	c2.width = 500;
	c2.height = 97;
	c2.numberOfFrames = 5;
	c2.ticksPerFrame = 12;
	c2.x = canvas.width/2 -100/2*c2.scaleRatio;
	c2.y = canvas.height/2 + 97*c2.scaleRatio;



	createLocalPlayer(0, c1.img, c1.width, c1.height, c1.numberOfFrames, c1.ticksPerFrame, c1.x, c1.y, c1.scaleRatio);//lantern1
	console.log("c2: " + c2.scaleRatio);
	createLocalPlayer(1, c2.img, c2.width, c2.height, c2.numberOfFrames, c2.ticksPerFrame, c2.x, c2.y, c2.scaleRatio);//lantern2
};



/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/

function randomNum(max,min){
  return Math.floor(Math.random()*(max-min+1)+min)
}
function randomColor(){
  var color="#";
  var colorArr=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
  for(i=0;i<6;i++){
      var cur=randomNum(15,0);
      color+=colorArr[cur];
  }
  function randomNum(max,min){
      return Math.floor(Math.random()*(max-min+1)+min)
  }
  return color;
}