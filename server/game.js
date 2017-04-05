/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
	Player = require("./Player").Player;	// Player class


/**************************************************
** GAME VARIABLES
**************************************************/
var socket;	// Socket controller
// var	players;	// Array of connected players

var largeScreenId;

var lanterns;



/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	// players = []; //MC array

	largeScreenId = 0; //have no large screen

	lanterns = []; //lanterns array

	// Set up Socket.IO to listen on port 8000
	socket = io.listen(8000);

	// Configure Socket.IO
	socket.configure(function() {
		// Only use WebSockets
		socket.set("transports", ["websocket"]);

		// Restrict log output
		socket.set("log level", 2);
	});

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	//a client connected maybe MC maybe LS
	util.log("New connected: " + client.id);


	client.on("disconnect", onClientDisconnect);
	//Need to tell if it is Large Screen

	//Below messages from Mobile Client(MC)

	client.on("MC_Connect", onMCConnect);

	// client.on("MC_Disconnect", onMCDisconnect);

	client.on("MC_Start_Lantern", onMCStartLantern);

	//Below messages from Large Screen(LS)

	client.on("LS_Connect", onLSConnect);

	// client.on("LS_Disconnect", onLSDisconnect);

	client.on("LS_End_Lantern", onLSEndLantern);

};

function onClientDisconnect() {
	util.log("Client Offline: " + this.id);
	if(this.id == largeScreenId) { // the main LS offline
		largeScreenId = 0; //reset the LS id
		this.broadcast.emit("LS_Offline");	
		util.log("Now, we have no large screen, waiting for LS...");
		
	}else{
		util.log("MC or others offline");
	}
	
	console.log("LS: " + largeScreenId);
}


function onLSConnect() {
	console.log("LS: " + largeScreenId);
	util.log("Large Screen Online: " + this.id );
	if(largeScreenId == 0) { //have no LS
		largeScreenId = this.id;
		console.log("Now we have largeScreen: " + largeScreenId);
		this.broadcast.emit("LS_Online");
		console.log("emit LS_Online");

	}else{
		console.log("We need just only one LS, so let's ignore the LS: " + this.id);
	}
	
};


function onMCConnect() {
	
	if(largeScreenId != 0){
		// this.broadcast.emit("LS_Online");
		util.log("MC has connected: " + this.id);
		util.log("Server send LS_Online");
		this.emit("LS_Online");
	}else{
		util.log("MC has connected: " + this.id);
		util.log("Server send LS_Offline");
		this.emit("LS_Offline");
	}
};

function onMCDisconnect() {
	util.log("MC has disconnected: " + this.id);
};

//MC send to server just a data(opt) instead of Player obj
function onMCStartLantern(data) {
	// console.log(data);
	var newLantern = new Player(data);
	newLantern.imgNumber = data.imgNumber;
	newLantern.id = this.id;

	// Broadcast new Lantern to connected LS
	console.log("imgNumber: " + newLantern.imgNumber);
	this.broadcast.emit("LS_New_Lantern", newLantern);


	// console.log("send LS_New_Lantern: ", newLantern);

		
	// Add new lantern to the lanterns array
	lanterns.push(newLantern);

};

function onLSEndLantern(data) {

	util.log("This MC's lantern is end: " + data.id);

	var removeLantern = lanternById(data.id);

	// Player not found
	if (!removeLantern) {
		util.log("Lantern not found: "+data.id);
		return;
	};

	// Remove lantern from lanterns array
	lanterns.splice(lanterns.indexOf(removeLantern), 1);

	// Broadcast removed lantern to connected MC
	this.broadcast.emit("MC_End_Lantern", {id: data.id});
};

/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find lantern by ID
function lanternById(id) {
	var i;
	for (i = 0; i < lanterns.length; i++) {
		if (lanterns[i].id == id)
			return lanterns[i];
	};
	
	return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
init();