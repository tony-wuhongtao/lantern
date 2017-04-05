/**************************************************
** GAME VARIABLES
**************************************************/
var canvas;			// Canvas DOM element
// var	ctx;			// Canvas rendering context
var	socket;			// Socket connection

var lanterns;

// var serverURL = "http://demo.redline-china.com";
var serverURL = "http://localhost";
/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	// ctx = canvas.getContext("2d");

	// Maximise the canvas
	// canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;
	// canvas.width = 1024;
	// canvas.height =	768;
	canvas.width = window.innerWidth-60;
	canvas.height = window.innerHeight-60;
	canvas.style.margin = 'auto auto';
	canvas.style.position='absolute';
	canvas.style.top = '20px';
	canvas.style.left = '30px';

	
	




	// Initialise socket connection
	socket = io.connect(serverURL, {port: 8000, transports: ["websocket"]});

	// Initialise lanterns array
	lanterns = [];

	// Start listening for events
	setEventHandlers();

	//background
	// setBackgroundImage();
};

var setBackgroundImage = function () {
	console.log("setbk");
	var context = canvas.getContext( '2d' );

    var background = new Image();
    background.src = 'images/bk1.png';

    background.onload = function(){
        context.drawImage(background,0,0, canvas.width, canvas.height);
        // console.log("%o", context);
    };


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

	socket.on("LS_New_Lantern", onLSNewLantern);

};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth-60;
	canvas.height = window.innerHeight-60;

	setBackgroundImage();
};

// Socket connected
function onSocketConnected() {
	console.log("Screen Connected to socket server");

	// Send message to server "screen online"
	socket.emit("LS_Connect");
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};


// New lantern
function onLSNewLantern(data) {
	console.log("New Lantern start: "+data.id);

	// Add new Lantern


	data.context = canvas.getContext("2d");
	var lanternImg = new Image();
	data.image = lanternImg;

	var newLantern = Player(data);
	newLantern.x = Math.random() * (canvas.width - newLantern.getFrameWidth() * newLantern.scaleRatio);
	newLantern.y = canvas.height;

	console.log("imgNumber: " + data.imgNumber);
	switch(data.imgNumber){
		case 1:
			data.image.src = "images/c1.png";
			break;
		case 2:
			data.image.src = "images/l1.png";
			break;
	}

	// console.log("newLantern : %o", newLantern);
	lanterns.push(newLantern);

	
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
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

	// Draw the remote players
	var i;
	for (i = 0; i < lanterns.length; i++) {
		lanterns[i].update();
	  	lanterns[i].render();
		if(lanterns[i].y < -lanterns[i].height/2*lanterns[i].scaleRatio){ //out of top 
			socket.emit("LS_End_Lantern", {id:lanterns[i].id});
			lanterns.splice(i, 1);

		}
	};
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < lanterns.length; i++) {
		if (lanterns[i].id == id)
			return lanterns[i];
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