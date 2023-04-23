var roleUpgrader = require("role.upgrader");

var collect = require("collect");
var fill = require("fill");
var memMgr = require("mgr.memory");
var towerGuard = {

	run: function (creep) {
		var room = creep.room;
		var roomName = room.name;

		if (!Memory[roomName].towers) {
			memMgr.updateTowerMem(room);
		}
		var towers = memMgr.getTowers(room);

		//console.log("towers: " + towers);

		//creep.memory.filling = false;
		if (creep.memory.filling) {

			if (towers.length < 1) {
				fill.fillTerminals(creep);
				//roleUpgrader.run(creep)
			} else {
				//change mode
				if (creep.carry.energy == 0) {
					creep.memory.filling = false;
					creep.say('🔄 harvest');
				} else if (towers.length > 0) {
					if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(towers[0], { visualizePathStyle: { stroke: '#ffffff' } });
					} else {
						roleUpgrader.run(creep);
					}
				}
			}

		} else {
			//change mode
			if (creep.carry.energy == creep.carryCapacity) {
				creep.memory.filling = true;
				creep.say('⚡ filling');
			} else {
				collect.containers(creep);
			}

		}

	}
}
module.exports = towerGuard;
