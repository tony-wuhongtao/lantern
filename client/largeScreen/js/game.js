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

var serverURL = "http://demo.redline-china.com";
// var serverURL = "http://localhost";
/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	// canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;
	canvas.width = 1024;
	canvas.height =	768;



	// Initialise socket connection
	socket = io.connect(serverURL, {port: 8000, transports: ["websocket"]});

	// Initialise remote players array
	remotePlayers = [];

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {

	// Window resize
	window.addEventListener("resize", onResize, false);

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	socket.on("existing players", onExistingPlayer);

	// New player message received
	socket.on("new player", onNewPlayer);

	// Player move message received
	socket.on("move player", onMovePlayer);

	// Player change color message received
	socket.on("change color player", onChangeColorPlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);

};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

// Socket connected
function onSocketConnected() {
	console.log("Screen Connected to socket server");

	// Send message to server "screen online"
	socket.emit("screen online");
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// Exiting player
function onExistingPlayer(data) {
	// Initialise the new player
	var newPlayer = new Player(data.x, data.y, data.color);
	newPlayer.id = data.id;

	// Add new player to the remote players array
	remotePlayers.push(newPlayer);
}

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);

	// Initialise the new player
	var newPlayer = new Player(data.x, data.y, data.color);
	newPlayer.id = data.id;

	// Add new player to the remote players array
	remotePlayers.push(newPlayer);
};

// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
};

function onChangeColorPlayer(data) {
	var changePlayer = playerById(data.id);
	// Player not found
	if (!changePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};
	changePlayer.setColor(data.color);
};

// Remove player
function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};


/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the remote players
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		remotePlayers[i].draw(ctx);
	};
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};

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