var roleRepairer = require("role.repairer");
var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep) {
		//change modes
		if (creep.memory.building && creep.carry.energy == 0) {
			//Go Harvest
			creep.memory.building = false;
			creep.say('🔄 harvest');
		}
		if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			//Go build
			creep.memory.building = true;
			creep.say('🚧 build');
		}
		//creep.memory.building =false;
		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

		//console.log(targets);
		if (targets.length < 1) {
			//There are no construction sites
			//if(creep.carry.energy <creep.carryCapacity && !creep.memory.building){
			roleRepairer.run(creep);

		} else {
			if (creep.memory.building) {
				if (creep.memory.team == 1) {
					//var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
					if (targets.length > 1) {
						if (creep.build(targets[targets.length - 1]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[targets.length - 1], { visualizePathStyle: { stroke: '#ffffff' } });
						}
					} else {
						if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
						}
					}
				} else {
					if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
					}
				}
				// creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});
			} else {
				var droppedres = creep.room.find(FIND_DROPPED_RESOURCES, {
					filter: { resourceType: RESOURCE_ENERGY }
				});
				var sources = creep.room.find(FIND_STRUCTURES, {
					filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
						i.store[RESOURCE_ENERGY] > 0
				});
				if (droppedres.length > 0 && droppedres[0].amount > 100) {
					//console.log("Dropped res[0] amount: " + droppedres[0].amount);
					if (creep.pickup(droppedres[0]) == -9) {
						if (creep.moveTo(droppedres[0], { visualizePathStyle: { stroke: '#ffffff' } }) == -2 && droppedres.length > 1) {
							creep.moveTo(droppedres[droppedres.length - 1], { visualizePathStyle: { stroke: '#ffffff' } })

						} else {
							if (sources.length < 1) {
								var sources = creep.room.find(FIND_SOURCES);
								if (creep.harvest(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
									creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
								}
								// roleRepairer.run(creep);
							} else {
								// console.log(sources);
								if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
									creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#000000' } });
								}
							}
						}
					}
				} else {
					//.filter(structure => structure.store.energy >0);
					//console.log(sources[0].store.energy);
					if (sources.length < 1) {
						var sources = creep.room.find(FIND_SOURCES);
						if (creep.harvest(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
						}
						// roleRepairer.run(creep);
					} else {
						// console.log(sources);
						if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#000000' } });
						}
					}
				}
			}

		}
	}
};

module.exports = roleBuilder;
