/**************************************************
** GAME VARIABLES
**************************************************/
var canvas;		// Canvas DOM element
var players=[]; //

var myId = 0;

var isLSOnline = true;
var hadSentLantern = false;

var toSendLantern = {};

var mousePos = { x:0, y:0 };
var lastPos = mousePos;

// var serverURL = "http://demo.redline-china.com";
var serverURL = "http://localhost";
/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	
	isLSOnline = true;
	isCanSendLantern = false;



	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");

	canvas.width = window.innerWidth-60;
	canvas.height = window.innerHeight-60;
	canvas.style.margin = 'auto auto';
	canvas.style.position='absolute';
	canvas.style.top = '20px';
	canvas.style.left = '30px';

	// Initialise the local player array to select
	createLocalSelecterList();
	gameLoop();

	// Initialise socket connection
	socket = io.connect(serverURL, {port: 8000, transports: ["websocket"]});

	// Start listening for events
	setEventHandlers();

	// For mouse 
	canvas.addEventListener("mousedown", onMouseDown, false);
	
	canvas.addEventListener("mouseup", onMouseUp, false);
	
	canvas.addEventListener("mousemove", onMouseMove, false);

	//For Mobile Touch
	// Set up touch events for mobile, etc
	// canvas.addEventListener("touchstart", onTouchStart, false);
	// canvas.addEventListener("touchend", onTouchEnd, false);
	// canvas.addEventListener("touchmove", onTouchMove, false);

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
		sendLantern(1);
	}else{
		console.log("Click Down");
		sendLantern(2);
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
		sendLantern(1);
	}else{
		console.log("Click Down");
		sendLantern(2);
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

//============================
function sendLantern(whichOne) {
	console.log("hadSentLantern: "+hadSentLantern);
	console.log("isLSOnline: " + isLSOnline);
	// if(hadSentLantern == false && isLSOnline == true) {
		if(isLSOnline == true) {
		switch(whichOne){
			case 1:
				var c1 = {};
				c1.scaleRatio = 2.5;
				// c1.img = "images/c1.png";
				c1.imgNumber = 1;
				c1.width = 1000;
				c1.height = 100;
				c1.numberOfFrames = 10;
				c1.ticksPerFrame =  4;
				toSendLantern = createPlayer(c1.imgNumber, c1.width, c1.height, c1.numberOfFrames, c1.ticksPerFrame);
				socket.emit("MC_Start_Lantern", toSendLantern);
				hadSentLantern = true;
				break;
			case 2:
				var c2 = {};
				c2.scaleRatio = 2;
				// c2.img = "images/l1.png";
				c2.imgNumber = 2;
				c2.width = 500;
				c2.height = 97;
				c2.numberOfFrames = 5;
				c2.ticksPerFrame = 12;
				toSendLantern = createPlayer(c2.imgNumber, c2.width, c2.height, c2.numberOfFrames, c2.ticksPerFrame);
				socket.emit("MC_Start_Lantern", toSendLantern);
				hadSentLantern = true;
				break;
		}
	}else{
		//wait for next chance
		console.log("There is no LS or had sent, please wait...");
	}
};



//=================


//Below functions are all used for Local Display
//============================================

function gameLoop () {
	
  var i;

  window.requestAnimationFrame(gameLoop);
  
  // Clear the canvas
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

  for (i = 0; i < players.length; i += 1) {
	  players[i].update();
	  players[i].render();
  }
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
	// console.log("c2: " + c2.scaleRatio);
	createLocalPlayer(1, c2.img, c2.width, c2.height, c2.numberOfFrames, c2.ticksPerFrame, c2.x, c2.y, c2.scaleRatio);//lantern2
};

//================================
function createPlayer (imgNumber, width, height, numberOfFrames, ticksPerFrame) {

	// var playerImg;

	// // Create sprite sheet
	// playerImg = new Image();	

	// // Load sprite sheet
	// playerImg.src = image;

	// Create sprite
	var player = Player({
		// context: canvas.getContext("2d"),
		width: width,
		height: height,
		// image: playerImg,
		numberOfFrames: numberOfFrames,
		ticksPerFrame: ticksPerFrame,
	});

	player.speed = randomNum(2,10);
	player.scaleRatio = Math.random() * 0.5 + 0.5;
	player.imgNumber = imgNumber;

	// player.x = Math.random() * (canvas.width - player.getFrameWidth() * player.scaleRatio);
	// player.y = canvas.height;

	return player;

	
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	socket.on("LS_Online", onLSOnline);

	socket.on("LS_Offline", onLSOffline);

	socket.on("MC_End_Lantern", onMCEndLantern);


};


// Socket connected
function onSocketConnected() {
	myId = socket.socket.sessionid;
	console.log("Connected to socket server:" + myId);


	// Send Mobile Client Connect message to the game server
	socket.emit("MC_Connect");
	console.log("send to server MC_Connect");
};

function onLSOnline() {
	console.log("get LSOnline");
	isLSOnline = true;
};

function onLSOffline() {
	console.log("get LSOffline");
	isLSOnline = false;
}


// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

function onMCEndLantern(data) {
	console.log(myId);
	if(data.id == myId){
		hadSentLantern = false;
		console.log("MC_End_Lantern get, it's me!");
	}else{
		console.log("MC_End_Lantern get, but not me.");
	}
}





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