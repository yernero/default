var roleUpgrader = require('role.upgrader');

var roleRepairer = {

	/** @param {Creep} creep **/
	run: function (creep) {
		if(!creep.memory.reparing){
			creep.memory.repairing = false;
		}
		if (creep.memory.repairing && creep.carry.energy == 0) {
			creep.memory.repairing = false;
			creep.say('🔄');
		}
		if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
			creep.memory.repairing = true;
			creep.say('🚧 repair');
		}

		if (creep.memory.repairing) {
			var targets = creep.room.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax });
			console.log("repair these " +targets);

			if (targets.length < 1) {
				creep.memory.upgrading = true;
				roleUpgrader.run(creep);
			} else {
				targets.sort((a, b) => b.hits / b.hitsMax - a.hits / a.hitsMax);
				// console.log(targets);
				if (targets.length > 0) {
					if (creep.memory.team == 2) {
						const towers = creep.room.find(FIND_STRUCTURES, { filter: object => object.energyAvailable < object.energyCapacity });
						if (towers.length > 0) {
							if (creep.repair(towers[0]) == ERR_NOT_IN_RANGE) {
								creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' } });
							}
						} else {
							if (creep.repair(targets[1]) == ERR_NOT_IN_RANGE) {
								creep.moveTo(targets[1], { visualizePathStyle: { stroke: '#000000' } });
							}
						}

					} else {
						if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#000000' } });
						}
					}
				}
			}
		} else {
			
			var sources = creep.room.find(FIND_STRUCTURES, {
				filter: (i) => (i.structureType == STRUCTURE_CONTAINER ||
					 i.structureType == STRUCTURE_STORAGE) &&
							   i.store[RESOURCE_ENERGY] > 0});
				//console.log(sources);

			if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#000000' } });
			}
		}
		//  creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});

	}
};
module.exports = roleRepairer;
