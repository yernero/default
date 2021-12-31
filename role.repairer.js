var roleUpgrader = require('role.upgrader');

var roleRepairer = {

	/** @param {Creep} creep **/
	run: function (creep) {
		//check state
		if (creep.memory.repairing) {
			if (creep.carry.energy == 0) {
				creep.memory.repairing = false;
				creep.say('🔄');
			} else {
				var targets = creep.room.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax });
				//console.log("repair these " +targets);

				if (targets.length < 1) {
					creep.memory.upgrading = true;
					roleUpgrader.run(creep);
				} else {
					targets.sort((b, a) => b.hits / b.hitsMax - a.hits / a.hitsMax);
					//console.log("sorted repair targets" +targets);
					if (targets.length > 0) {
						if (creep.memory.team == 1) {
							const towers = creep.room.find(FIND_STRUCTURES, { filter: object => object.energyAvailable < object.energyCapacity });

							if (creep.repair(targets[1]) == ERR_NOT_IN_RANGE) {
								creep.moveTo(targets[1], { visualizePathStyle: { stroke: '#000000' } });
							}


						} else {
							if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
								creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#000000' } });
							}
						}
					}
				}
			}
		} else {
			//making sure repairing exists
			creep.memory.repairing = false;
			//check if time to switch modes
			if (!creep.carry.energy == creep.carryCapacity) {
				creep.memory.repairing = true;
				creep.say('🚧 repair');
			} else {
				//find sources- only containers and structures
				var sources = creep.room.find(FIND_STRUCTURES, {
					filter: (i) => (i.structureType == STRUCTURE_CONTAINER ||
						i.structureType == STRUCTURE_STORAGE) &&
						i.store[RESOURCE_ENERGY] > 0
				});
				//console.log("Containers and storage in room " + creep.room.name + ": " +sources);

				if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#000000' } });
				}
			}
		}
	}
};
module.exports = roleRepairer;
