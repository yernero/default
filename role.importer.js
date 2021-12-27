var roleImporter = {

	/** @param {Creep} creep **/
	run: function (creep) {
		if (creep.memory.gathering) {
			if (creep.room == Game.rooms["E69S33"]) {
				creep.moveTo(Game.flags.Flag1, { visualizePathStyle: { stroke: '#ffaa00' } });
			} else {
				var sources = creep.room.find(FIND_SOURCES);
				if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
				}
			}
			if (creep.carry.energy == creep.carry.energyCapacity) {
				creep.memory.gathering = false;
			}
		} else {
			if (creep.room == Game.rooms["E69S32"]) {
				creep.moveTo(Game.flags["y"], { visualizePathStyle: { stroke: '#ffaa00' } });
			} else {
				var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE) && structure.store.energy < structure.storeCapacity; } });
				if (targets.length < 1) {
					var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity; } });
				}
				if (targets.length > 0) {
					if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
					}
				}
				console.log("dd" + targets);
				if (creep.carry.energy == 0) {
					creep.memory.gathering = true;
				}


			}
		}
	}
};

module.exports = roleImporter;
