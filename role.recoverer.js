var roleRecoverer = {

	/** @param {Creep} creep **/
	run: function (creep) {
		var room = creep.room;
		var roomName = room.name;
		if (creep.memory.storing && creep.carry.energy == 0) {
			creep.memory.storing = false;
			creep.say('🔄 harvest');
		}
		if (!creep.memory.storing && creep.carry.energy == creep.carryCapacity) {
			creep.memory.storing = true;
			creep.say('⚡ storing');
		}

		if (creep.memory.storing) {
			if (creep.room.energyAvailable == creep.room.energyCapacityAvailable) {
				var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE) && structure.store.energy < structure.storeCapacity; } });
				if (targets.length < 1) {
					var targets = creep.room.find(FIND_STRUCTURES,
						{ filter: (structure) => { return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity; } });
				}
				if (targets.length > 0) {
					if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
					}
				}
			} else {
				var targets = creep.room.find(FIND_STRUCTURES,
					{ filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity; } });
				if (targets.length > 0) {
					if (targets.length > 1) {
						if (creep.transfer(targets[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[1], { visualizePathStyle: { stroke: '#ffffff' } });
						}
					} else {
						if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
						}
					}
				}
			}
		}
		else {
			var sources = creep.room.find(FIND_SOURCES);
			if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
			}
		}
		//creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});

	}
};

module.exports = roleHarvester;
