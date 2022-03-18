var roleUpgrader = require("role.upgrader");
var collectContainers = require("collect.containers");
var towerGuard = {

	run: function (creep) {
		var towers = creep.room.find(FIND_STRUCTURES,
			{
				filter: (structure) => structure.structureType == "tower" &&
					structure.store.getFreeCapacity([RESOURCE_ENERGY]) > 0
			});
		//console.log("towers: " + towers);

		//creep.memory.filling = false;
		if (creep.memory.filling) {
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
		} else {
			//change mode
			if (creep.carry.energy == creep.carryCapacity) {
				creep.memory.filling = true;
				creep.say('⚡ filling');
			} else {
				collectContainers.run(creep);
			}

		}

	}
}
module.exports = towerGuard;
