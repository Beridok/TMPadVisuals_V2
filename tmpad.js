//config
var gamepadID = 1; //Leave "0" if you have only one. If more, then you need to try switching this number.

var deadzone = 0.01;
var accButton = 1;
var brkButton = 5;

/*
visit this website and check what is value of AXIS0 and AXIS1 when your stick is in rest position
https://html5gamepad.com/
Also check which number of button is pressed when you use Acceleration and Brake, for me it's 1 and 5.
*/

var frames = 60;
//Default frames per second

var alertMode = false;
//Change into "true" if script should alert about disconnected gamepad. False will not alert about disconnecting.

var transparency = 0.5;
//1 = solid, 0 = invisible. How much transparent all visuals are.

var color = {
	bg : "#102030", //background (for chroma key)
	def : "rgb(85,85,85,"+transparency+")", //off state color (buttons not pressed)
	alr : "rgb(205,91,51,"+transparency+")", //active direction
	up : "rgb(0,255,0,"+transparency+")", //active direction
	down : "rgb(255,0,0,"+transparency+")", //active direction
}

var pixels = 500; //How wide are the triangles for analog sticks.
//end of config



//Executive code.
var startTime = new Date();
console.log("Script started @ "+startTime); //Just to see in console it's really working.

document.getElementsByTagName("body")[0].style = "background-color:"+color.bg; //Change background to desired color code.

//Detect connecting of gamepad
window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});

//Detect disconnecting of gamepad
window.addEventListener("gamepaddisconnected", function(e) {
  console.log("Gamepad disconnected from index %d: %s",
    e.gamepad.index, e.gamepad.id);
	if ( alertMode === true ){
		alert("Gamepad disconnected! Replug it to initate detection.");
	}
});

//Buttons functions effects.
function accelOn(){
	document.getElementById('up').style["border-bottom"] = "400px solid "+color.up;
}
function accelOff(){
	document.getElementById('up').style["border-bottom"] = "0px solid "+color.up;
}
function brakeOn(){
	document.getElementById('down').style["border-top"] = "400px solid "+color.down;
}
function brakeOff(){
	document.getElementById('down').style["border-top"] = "0px solid "+color.down;
}

function analog(value){
	if ( value == 0 || value < deadzone && value > -deadzone )
	{
		document.getElementById('left').style['border-right'] = "0px solid "+color.alr;
		document.getElementById('right').style['border-left'] = "0px solid "+color.alr;
	}
	else if ( value <= -deadzone )
	{
		stickLevel = -pixels*value;
		document.getElementById('left').style['border-right'] = stickLevel+"px solid "+color.alr;
		document.getElementById('right').style['border-left'] = "0px solid "+color.alr;
		
	}
	else if ( value >= deadzone )
	{
		stickLevel = pixels*value;
		document.getElementById('left').style['border-right'] = "0px solid "+color.alr;
		document.getElementById('right').style['border-left'] = stickLevel+"px solid "+color.alr;
	}
}

//Refresh button states
var refreshInterval = (1000/frames).toFixed(3);
setInterval(() => {
	var gp = navigator.getGamepads()[gamepadID];
	var gpAnal = gp.axes[0];
	var gpAcc = gp.buttons[accButton].pressed;
	var gpBrk = gp.buttons[brkButton].pressed;
	if ( gpAnal != 0 )
	{
		analog(gpAnal);
	}
	if ( gpAcc === true ) { accelOn() }
	else if ( gpAcc === false ) { accelOff() }
	if ( gpBrk === true ) { brakeOn() }
	else if ( gpBrk === false ) { brakeOff() }
}, refreshInterval)
