var roleRepairer = require("role.repairer");
var collectContainers = require("collect.containers");
var memMgr = require("mgr.memory");

var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep) {
		//creep.memory.building =false;
		var room = creep.room;
		var roomName = room.name; var target = {};


		if (creep.memory.building) {
			if (creep.carry.energy == 0) {
				//Go Harvest
				creep.memory.building = false;
				creep.say('⚡');
			} else {

				//make sure a destination exists in creep memory
				if (!creep.memory.dest) {
					//find all construction sites in room memory
					memMgr.updateConstructionMem(room);
					var targets = []
					for (var site in Memory[roomName].constructionSites.all) {
						targets.push(Game.getObjectById(Memory[roomName].constructionSites.all[site].id));
					}
					//console.log("targets in " + roomName + " " + targets);
					//if no construction sites, try to repair something
					if (!targets || targets.length == 0) {
						//hopefully sets a destination
						roleRepairer.run(creep)
					} else {
						//depending on team set target destination
						switch (creep.memory.team) {
							case 1:
								creep.memory.dest = targets[targets.length - 1].id;
								break;
							case 0:
							default:
								creep.memory.dest = targets[0].id;
								break;
						}
					}

				}
				//check if destination became invalid
				var dest = Game.getObjectById(creep.memory.dest);
				//console.log(dest.pos)
				if (!dest || dest.hits > 0) {
					creep.memory.dest = null;
					//console.log(creep.name + " cannot find work in " + roomName)
					roleRepairer.run(creep);
				} else {
					var status = creep.build(dest);
					switch (status) {
						case 0:
							//worked
							break;
						case -9:
							creep.moveTo(dest);
							break;
						default:
							console.log(status + " error building in " + roomName);
							break;
					}

				}



			}
		} else {
			//make sure memory created
			creep.memory.building = false;
			//changing status
			if (creep.store.getFreeCapacity() == 0) {
				creep.memory.building = true;
				creep.memory.dest = false;
				creep.say('🚧');
			} else {
				collectContainers.run(creep);
			}
		}
	}
};

module.exports = roleBuilder;
