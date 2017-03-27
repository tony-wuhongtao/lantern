/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	devOris,		//Device Orientation
	localPlayer,	// Local player
	remotePlayers,	// Remote players
	socket;			// Socket connection
var startColor = randomColor();

var ball   = document.querySelector('.ball');
var garden = document.querySelector('.garden');
var output = document.querySelector('.output');
var button = document.getElementById('bb');

var maxX = garden.clientWidth  - ball.clientWidth;
var maxY = garden.clientHeight - ball.clientHeight;

var serverURL = "http://demo.redline-china.com";
// var serverURL = "http://localhost";
/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {

	// Declare the canvas and rendering context

	// Maximise the canvas
	var canvasWidth = 1024;
	var canvasHeight = 768;

	// Initialise keyboard controls
	// keys = new Keys();

	devOris = new DevOris();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvasWidth-3-5)),
		startY = Math.round(Math.random()*(canvasHeight-3-5));
	

	// Initialise the local player

	localPlayer = new Player(startX, startY, startColor);

	// Initialise socket connection
	socket = io.connect(serverURL, {port: 8000, transports: ["websocket"]});

	// Initialise remote players array
	remotePlayers = [];

	// Start listening for events
	setEventHandlers();

	button.addEventListener("touchstart", changeColor);
	// button.addEventListener("click", changeColor);

};

function changeColor(e) {
	startColor = randomColor();
	console.log('change color' + startColor);
	localPlayer.setColor(startColor);
	socket.emit("change color player", {color: localPlayer.getColor()});
	console.log('emit color'+localPlayer.getColor());

}

function handleOrientation(event) {
	var x = event.beta;  // In degree in the range [-180,180]
	var y = event.gamma; // In degree in the range [-90,90]

	output.innerHTML  = "beta : " + x + "\n";
	output.innerHTML += "gamma: " + y + "\n";

	// Because we don't want to have the device upside down
	// We constrain the x value to the range [-90,90]
	if (x >  90) { x =  90};
	if (x < -90) { x = -90};
	if (y >  90) { y =  90};
	if (y < -90) { y = -90};
	// To make computation easier we shift the range of 
	// x and y to [0,180]
	x += 90;
	y += 90;

	// To make computation easier we shift the range of 
	// x and y to [0,180]
	// x += 90;
	// y += 90;

	// 10 is half the size of the ball
	// It center the positioning point to the center of the ball
	ball.style.top  = (maxX*x/180 - 10) + "px";
	ball.style.left = (maxY*y/180 - 10) + "px";
	ball.style.background = startColor;
	
}

/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {

	// Device Orientation
	window.addEventListener("deviceorientation", onMove, false);

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);


};

function onMove(e) {
	handleOrientation(e);

	if(localPlayer) {
		devOris.onMove(e);
	}
	
}

// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");

	// Send local player data to the game server
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY(), color:localPlayer.getColor()});
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};


/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	// Update local player and check for change
	// if (localPlayer.update(keys)) {
	// 	// Send local player data to the game server
	// 	socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
	// };

	if (localPlayer.updateMove(devOris)) {

		socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
	};

};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	ball.style.background = startColor;
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