var msgCount = 0;

function appendResource(id, html, onclick, onclickId, onclickhtml) {
	$("#wood").after("<div id=\""+id+"\" class=\"resource\">\
		 <span id=\""+id+"_amount\">"+html+"</span><br>\
		 <button onclick=\""+onclick+"\" id=\""+onclickId+"\">"+onclickhtml+"</button>\
		 </div>");
}

function addMessage(msg) {
	if(msgCount > 9) {
		$(".msg:last-child").remove();
		$("#messages_content").prepend('<div class="msg" style="display: none;">'+msg+'</div>');
		$(".msg:first-child").slideDown(400);
	} else {
		$("#messages_content").prepend('<div class="msg" style="display: none;">'+msg+'</div>');
		$(".msg:first-child").slideDown(400);
		msgCount++;
	}
}

var gm = {
	started: false,
	fps: 10,
	cps: 0,
	lastTime: (new Date).getTime(),
	tickTime: 0,
	loops: 0,

	stats: {
		heat: 0,
		hunger: 0,
		comfort: 0,
	},

	money: {
		platinum: 0,
		gold: 0,
		silver: 0,
		copper: 0,

		addPlatinum: function(n) {
			gm.money.platinum += n;
			gm.money.draw();
		},

		subPlatinum: function(n) {
			if(n <= gm.money.platinum) {
				gm.money.platinum -= n;
				gm.money.draw();
				return true;
			}
			return false;
		},

		addGold: function(n) {
			if((gm.money.gold + n) >= 100) {
				gm.money.addPlatinum(Math.round((n+gm.money.gold)/100));
				gm.money.gold = (n+gm.money.gold)%100;
			} else
				gm.money.gold += n;
			gm.money.draw();
		},

		subGold: function(n) {
			if(n > gm.money.gold) {
				if(gm.money.subPlatinum(1)) {
					gm.money.gold = (100-n);
					gm.money.draw();
					return true;
				}
				return false;
			} else {
				gm.money.gold -= n;
				gm.money.draw();
				return true;
			}

			return false;
		},

		addSilver: function(n) {
			if((gm.money.silver + n) >= 1000) {
				gm.money.addGold(Math.round((n+gm.money.silver)/1000));
				gm.money.silver = (n+gm.money.silver)%1000;
			} else
				gm.money.silver += n;
			gm.money.draw();
		},

		subSilver: function(n) {
			if(n > gm.money.silver) {
				if(gm.money.subGold(1)) {
					gm.money.silver = (1000-n);
					gm.money.draw();
					return true;
				}
				return false;
			} else {
				gm.money.silver -= n;
				gm.money.draw();
				return true;
			}
			return false;
		},

		addCopper: function(n) {
			if((gm.money.copper + n) >= 10000) {
				gm.money.addSilver(Math.round((n+gm.money.copper)/10000));
				gm.money.copper = (n+gm.money.copper)%10000;
			} else
				gm.money.copper += n;
			gm.money.draw();
		},

		subCopper: function(n) {
			if(n > gm.money.copper) {
				if(gm.money.subSilver(1))
					gm.money.copper = (10000-n);
			} else
				gm.money.copper -= n;
			gm.money.draw();
		},

		draw: function() {
			if((gm.money.copper != 0) || (gm.money.silver != 0) || (gm.money.gold != 0) || (gm.money.platinum != 0)) {
				$("#no_money").hide();
				if(gm.money.platinum > 1)
					$("#platinum_amount").html(gm.money.platinum+' platinum coins').show();
				else if(gm.money.platinum == 1)
					$("#platinum_amount").html(gm.money.platinum+' platinum coin').show();
				else
					$("#platinum_amount").hide();

				if(gm.money.gold > 1)
					$("#gold_amount").html(gm.money.gold+' gold coins').show();
				else if(gm.money.gold == 1)
					$("#gold_amount").html(gm.money.gold+' gold coin').show();
				else
					$("#gold_amount").hide();

				if(gm.money.silver > 1)
					$("#silver_amount").html(gm.money.silver+' silver coins').show();
				else if(gm.money.silver == 1)
					$("#silver_amount").html(gm.money.silver+' silver coin').show();
				else
					$("#silver_amount").hide();

				if(gm.money.copper > 1)
					$("#copper_amount").html(gm.money.copper+' copper coins').show();
				else if(gm.money.copper == 1)
					$("#copper_amount").html(gm.money.copper+' copper coin').show();
				else
					$("#copper_amount").hide();
			} else {
				$("#no_money").show();
				$("#copper_amount").hide();
				$("#silver_amount").hide();
				$("#gold_amount").hide();
				$("#platinum_amount").hide();
			}
		},
	},

	rsrc: {
		wood: {
			amt: 0,
			platinum: 0,
			gold: 0,
			silver: 0,
			copper: 10,

			sell: function(n) {
				if(n <= gm.rsrc.wood.amt) {
					gm.rsrc.wood.amt -= n;
					gm.money.addCopper(n*gm.rsrc.wood.copper);
				} else {
					gm.rsrc.wood.amt = 0;
					gm.money.addCopper(gm.rsrc.wood.amt*gm.rsrc.wood.copper);
				}

				if(gm.rsrc.wood.amt == 1)
					$('#wood_amount').html(gm.rsrc.wood.amt+' log');
				else
					$('#wood_amount').html(gm.rsrc.wood.amt+' logs');
			},

			add: function(n) {
				gm.rsrc.wood.amt += n;

				if(gm.rsrc.wood.amt == 1)
					$('#wood_amount').html(gm.rsrc.wood.amt+' log');
				else
					$('#wood_amount').html(gm.rsrc.wood.amt+' logs');
			},

			sub: function(n) {
				if((gm.rsrc.wood.amt - n) >= 0)
					gm.rsrc.wood.amt -= n;

				if(gm.rsrc.wood.amt == 1)
					$('#wood_amount').html(gm.rsrc.wood.amt+' log');
				else
					$('#wood_amount').html(gm.rsrc.wood.amt+' logs');
			},
		},
		stone: {
			amt: 0,
			platinum: 0,
			gold: 0,
			silver: 0,
			copper: 100,
			on: false,

			sell: function(n) {
				if(n <= gm.rsrc.stone.amt) {
					gm.rsrc.stone.amt -= n;
					gm.money.addCopper(n*gm.rsrc.stone.copper);
				} else {
					gm.rsrc.stone.amt = 0;
					gm.money.addCopper(gm.rsrc.stone.amt*gm.rsrc.stone.copper);
				}

				if(gm.rsrc.stone.amt == 1)
					$('#stone_amount').html(gm.rsrc.stone.amt+' stone piece');
				else
					$('#stone_amount').html(gm.rsrc.stone.amt+' stone pieces');
			},

			add: function(n) {
				gm.rsrc.stone.amt += n;

				if(gm.rsrc.stone.amt == 1)
					$('#stone_amount').html(gm.rsrc.stone.amt+' stone piece');
				else
					$('#stone_amount').html(gm.rsrc.stone.amt+' stone pieces');
			},

			sub: function(n) {
				if((gm.rsrc.stone.amt - n) >= 0)
					gm.rsrc.stone.amt -= n;

				if(gm.rsrc.stone.amt == 1)
					$('#stone_amount').html(gm.rsrc.stone.amt+' stone piece');
				else
					$('#stone_amount').html(gm.rsrc.stone.amt+' stone pieces');
			},
		},
		food: {
			amt: 0,
			platinum: 0,
			gold: 0,
			silver: 0,
			copper: 50,

			sell: function(n) {
				if(n <= gm.rsrc.food.amt) {
					gm.rsrc.food.amt -= n;
					gm.money.addCopper(n*gm.rsrc.food.copper);
				} else {
					gm.rsrc.food.amt = 0;
					gm.money.addCopper(gm.rsrc.food.amt*gm.rsrc.food.copper);
				}

				if(gm.rsrc.food.amt == 1)
					$('#food_amount').html(gm.rsrc.food.amt+' meat chunk');
				else
					$('#food_amount').html(gm.rsrc.food.amt+' meat chunks');
			},

			add: function(n) {
				gm.rsrc.food.amt += n;

				if(gm.rsrc.food.amt == 1)
					$('#food_amount').html(gm.rsrc.food.amt+' meat chunk');
				else
					$('#food_amount').html(gm.rsrc.food.amt+' meat chunks');
			},

			sub: function(n) {
				if((gm.rsrc.food.amt - n) >= 0)
					gm.rsrc.food.amt -= n;

				if(gm.rsrc.food.amt == 1)
					$('#food_amount').html(gm.rsrc.food.amt+' meat chunk');
				else
					$('#food_amount').html(gm.rsrc.food.amt+' meat chunks');
			},
		},
		peasant: {
			amt: 1,
			platinum: 0,
			gold: 0,
			silver: 0,
			copper: 0,
		},
	},

	builds: {
		campf: {
			amt: 0,
			wood: 10,
			stone: 5,
			stock: 0,

			build: function() {
				if(gm.rsrc.wood.amt >= gm.builds.campf.wood && gm.rsrc.stone.amt >= gm.builds.campf.stone) {
					gm.rsrc.wood.sub(gm.builds.campf.wood);
					gm.rsrc.stone.sub(gm.builds.campf.stone);
					gm.builds.campf.amt++;
					$("#campf_amt").html('<b>'+gm.builds.campf.amt+'</b');
				}
			},

			store: function() {

			},

			update: function() {
				if(gm.builds.campf.amt > 0) {
					$('#campf_stock').show();
				} else {
					$('#campf_stock').hide();
					return false;
				}

				if(gm.builds.campf.stock > 0) {
					gm.builds.campf.stock--;
					if(gm.stats.heat < 15)
						gm.stats.heat = 20;
					else if(hgm.stats.eat < 20)
						gm.stats.heat++;
					if(gm.stats.heat > 25)
						gm.stats.heat = 25;
				} else {
					gm.builds.campf.amt--;
				}
			},
		},
	},

	lands: {
		quarry: {
			sqmt: 0,
			platinum: 0,
			gold: 0,
			silver: 0,
			copper: 1000,

			buy: function() {
				if(gm.money.copper >= gm.lands.quarry.copper) {
					gm.lands.quarry.sqmt++;
					gm.money.subCopper(gm.lands.quarry.copper);
					$("#quarry_sqmt").html(gm.lands.quarry.sqmt+' sqmt');
				}

				if(!gm.rsrc.stone.on && gm.lands.quarry.sqmt > 0){
					appendResource('stone', '0 stone pieces', 'gm.mineStone()', 'mine', 'MINE!');
					gm.rsrc.stone.on = true;
				}
			},

			sell: function() {
				if(gm.lands.quarry.sqmt > 0) {
					gm.lands.quarry.sqmt--;
					gm.money.addCopper(Math.round(gm.lands.quarry.copper/2));
					$("#quarry_sqmt").html(gm.lands.quarry.sqmt+' sqmt');
				}
			},
		},

		forest: {
			sqmt: 0,
			platinum: 0,
			gold: 0,
			silver: 1,
			copper: 0,

			buy: function() {
				if(gm.money.silver >= gm.lands.forest.silver) {
					gm.lands.forest.sqmt++;
					gm.money.subSilver(gm.lands.forest.silver);
					$("#forest_sqmt").html(gm.lands.forest.sqmt+' sqmt');
				}
			},

			sell: function() {
				if(gm.lands.forest.sqmt > 0) {
					gm.lands.forest.sqmt--;
					gm.money.addCopper(Math.round(gm.lands.forest.silver*10000/2));
					$("#forest_sqmt").html(gm.lands.forest.sqmt+' sqmt');
				}
			},
		},
	},

	getDelta: function () {
		var currTime = (new Date).getTime();
		var delta = (currTime - gm.lastTime);
		gm.lastTime = currTime;
		return delta;
	},

	huntGame: function() {
		gm.cps++;
		gm.rsrc.food.add(1);
	},

	chopWood: function() {
		gm.cps++;
		gm.rsrc.wood.add(1);
	},

	mineStone: function() {
		gm.cps++;
		gm.rsrc.stone.add(1);
	},

	update: function () {
		/*if((gm.rsrc.wood.amt >= 10) && (!gm.rsrc.stone.on)) {
			appendResource('stone', '0 stone pieces', 'gm.mineStone()', 'mine', 'MINE!');
			gm.rsrc.stone.on = true;
		}*/

		//gm.builds.campf.update();
	},

	perSecondUpdate: function() {
	},

	start: function() {
		if(!gm.started) { 
			gm._intervalId = setInterval(function () {
				gm.tickTime += gm.getDelta();

				gm.update();
				gm.loops++;

				if(gm.tickTime >= 1000) {
					gm.perSecondUpdate();
					console.log("FPS: "+gm.loops);
					console.log("CPS: "+gm.cps);
					gm.cps = 0;
					gm.loops = 0;
					gm.tickTime = 0;

					//Other debbuggin logs
					/*console.log(gm.rsrc.food.amt+' meat chunks');
					console.log(gm.rsrc.wood.amt+' logs');
					console.log(gm.rsrc.stone.amt+' stone pieces');
					console.log(gm.rsrc.peasant.amt+' peasants');*/
				}
			}, (1000/gm.fps));
			gm.started = true;
		} else {
			console.log("There is alredy one instance of Game running.");
		}
	},

	stop: function() {
		if(gm.started) {
			clearInterval(gm._intervalId);
			gm.started = false;
		} else {
			console.log("There is no instance of Game running.");
		}
	},
};

$(document).ready(function() {
	addMessage("You are a lonely guy who's in strange forest with an axe.\
		 You don't know much, but you might wat to try chopping some wood for heat and money\
		  or try to hunt for some food.");
	gm.start();
});