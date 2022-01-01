var roleUpgrader = require('role.upgrader');

var roleRepairer = {

	/** @param {Creep} creep **/
	run: function (creep) {
		//check state
		if (creep.memory.repairing) {
			if (creep.carry.energy == 0) {
				creep.memory.repairing = false;
				creep.memory.dest = false;
				creep.say('🔄');
			} else {
				var	targets = creep.room.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax });

				
				//console.log("repair these " +targets);

				if (targets.length < 1) {
					creep.memory.upgrading = true;
					roleUpgrader.run(creep);
				
				} else {
					targets.sort((b, a) => b.hits / b.hitsMax - a.hits / a.hitsMax);
					//console.log("sorted repair targets" +targets);
					if (targets.length > 0) {
						if (creep.memory.team == 1) {
							//repair containers first
							var a = targets.filter(structure => structure.structureType == STRUCTURE_CONTAINER);
							if(a.length >0){
								targets = a;
							}
							//console.log("Containers: " +targets);
							if(!creep.memory.dest){
								creep.memory.dest = targets[targets.length-1].id;
							}
							//const towers = creep.room.find(FIND_STRUCTURES, { filter: object => object.energyAvailable < object.energyCapacity });
							var dest = Game.getObjectById(creep.memory.dest);
							//console.log("dest: " + dest);
							if (creep.repair(dest) == ERR_NOT_IN_RANGE) {
								creep.moveTo(dest, { visualizePathStyle: { stroke: '#000000' } });
							}


						} else {
							if(!creep.memory.dest){
								creep.memory.dest = targets[0].id;
							}
							var dest = Game.getObjectById(creep.memory.dest);
							//console.log("dest: " + dest);
							if (creep.repair(dest) == ERR_NOT_IN_RANGE) {
								creep.moveTo(dest, { visualizePathStyle: { stroke: '#000000' } });
							}
						}
					}
				}
			}
		} else {
			//making sure repairing exists
			creep.memory.repairing = false;
			//check if time to switch modes
			if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
				creep.memory.repairing = true;
				creep.say('🚧 repair');
			} else {
				//find sources- only containers and structures
				var sources = creep.room.find(FIND_STRUCTURES, {
					filter: (i) => (i.structureType == STRUCTURE_CONTAINER ||
						i.structureType == STRUCTURE_STORAGE) &&
						i.store[RESOURCE_ENERGY] > 0
				});
				sources = sources.sort((a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY));
			
				//console.log("Containers and storage in room " + creep.room.name + ": " +sources);

				if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#000000' } });
				}
			}
		}
	}
};
module.exports = roleRepairer;
