/**************************************************
** GAME VARIABLES
**************************************************/
var canvas;		// Canvas DOM element
var players=[]; //

var myId = 0;

var isLSOnline = true;
var hadSentLantern = false;

var toSendLantern = {};

// var serverURL = "http://demo.redline-china.com";
var serverURL = "http://localhost";
/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	
	isLSOnline = false;
	isCanSendLantern = false;

	// Initialise socket connection
	socket = io.connect(serverURL, {port: 8000, transports: ["websocket"]});

	// Start listening for events
	setEventHandlers();

};


//============================
function sendLantern(whichOne) {
	console.log("hadSentLantern: "+hadSentLantern);
	console.log("isLSOnline: " + isLSOnline);
	if(hadSentLantern == false && isLSOnline == true) {
		// if(isLSOnline == true) {
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
			default:
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

		}
		return true;
	}else{
		//wait for next chance
		console.log("There is no LS or had sent, please wait...");
		return false;
	}
};



//=================

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
	// console.log("send to server MC_Connect");
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
		document.getElementById("cb").style.display = "block";
		document.getElementById("sd").style.display = "none";
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