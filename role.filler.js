var roleUpgrader = require("role.upgrader");
var roleFiller = {

	/** @param {Creep} creep **/
	run: function (creep) {

		if (creep.memory.storing && creep.carry.energy == 0) {
			creep.memory.storing = false;
			creep.say('🔄 harvest');
		}
		if (!creep.memory.storing && creep.carry.energy == creep.carryCapacity) {
			creep.memory.storing = true;
			creep.say('⚡ storing');
		}
		/* var targets = creep.room.find(FIND_STRUCTURES,{filter: (structure) => return (structure.structureType == STRUCTURE_STORAGE ||structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity() > 0});
		 *///finding all storage containers not spawn with space left


		if (creep.memory.storing) {
			var targets = creep.room.find(FIND_STRUCTURES)
				.filter(structure => [STRUCTURE_EXTENSION, STRUCTURE_SPAWN].indexOf(structure.structureType) !== -1)

			if (creep.room.energyAvailable == creep.room.energyCapacityAvailable) {
				//all extensions and spawn is full
				//console.log("ALL STORAGE FULL");

				var targets = creep.room.find(FIND_STRUCTURES).filter(structure => [STRUCTURE_TOWER, STRUCTURE_CONTAINER].indexOf(structure.structureType) !== -1)
					.filter(structure => structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
				//console.log(targets);
				if (targets.length < 1) {
					roleUpgrader.run(creep);
					/*var targets = creep.room.find(FIND_STRUCTURES,
						{filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;}});*/
				} else {

					if (creep.memory.team == 1) {
						if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
						}
					} else {
						if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
						}
					}
				}
			} else {

				var targets = creep.room.find(FIND_STRUCTURES,
					{ filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity; } });
				if (targets.length < 1) {
					roleUpgrader.run(creep);
				} else {
					if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
					}
				}
			}
		} else {
			var sources = creep.room.find(FIND_STRUCTURES).filter(structure => [STRUCTURE_STORAGE].indexOf(structure.structureType) !== -1).filter(structure => structure.store.energy > 0);
			//	console.log(sources);
			//console.log(sources[0].store.energy);
			//if(sources[0].store.energy == 0){
			// console.log("harvesters need to work harder");
			// }
			//.filter(return (structure) => structure.energy >0);

			if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
			}
		}
		//creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});

	}
};

module.exports = roleFiller;
