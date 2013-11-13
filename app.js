var wood_amount = 0;
var stone_amount = 0;
var food_amount = 0;
var peasant_amount = 0;
var appended = false;

//Lembrar de fazer isso!!
/*var stone_resource_html = "<div id=\"stone\" class=\"resource\">\
								<span id=\"stone_amount\">You Have: 0 stone pieces</span><br>\
								<button onclick=\"Game.mineStone()\" id=\"mine\">MINE!</button>\
							</div>";*/

var Game = {
	started: false,
	fps: 10,
	lastTime: (new Date).getTime(),
	tickTime: 0,
	loops: 0,
	amount: {
		wood: 0,
		stone: 0,
		food: 0,
		peasant: 1,
	},

	getDelta: function () {
		var currTime = (new Date).getTime();
		var delta = (currTime - Game.lastTime);
		Game.lastTime = currTime;
		return delta;
	},

	huntGame: function() {
		Game.amount.food++;
		$('#food_amount').html('You Have: '+Game.amount.food+' meat chunks');
	},

	chopWood: function() {
		Game.amount.wood++;
		$('#wood_amount').html('You Have: '+Game.amount.wood+' logs');
	},

	mineStone: function() {
		Game.amount.stone++;
		$('#stone_amount').html('You Have: '+Game.amount.stone+' stone pieces');
	},

	update: function () {
		Game.chopWood();
	},

	start: function() {
		if(!Game.started) { 
			Game._intervalId = setInterval(function () {
				Game.tickTime += Game.getDelta();

				Game.update();
				Game.loops++;

				if(Game.tickTime >= 1000) {
					console.log("FPS: "+Game.loops);
					Game.loops = 0;
					Game.tickTime = 0;

					//Other debbuggin logs
					console.log(Game.amount.food+' meat chunks');
					console.log(Game.amount.wood+' logs');
					console.log(Game.amount.stone+' stone pieces');
					console.log(Game.amount.peasant+' peasants');
				}
			}, (1000/Game.fps));
			Game.started = true;
		} else {
			console.log("There is alredy one instance of Game running.");
		}
	},

	stop: function() {
		if(Game.started) {
			clearInterval(Game._intervalId);
			Game.started = false;
		} else {
			console.log("There is no instance of Game running.");
		}
	},
};