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
				//find targets that need repairing
				//var targets = creep.room.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax });

				//console.log("repair these " +targets);
				//console.log("repair this: " + creep.memory.dest); 
				if (Memory.toBeRepaired.length < 1) {
					//creep.memory.upgrading = true;
					roleUpgrader.run(creep);

				} else {
					//sorted least hits/hitsmax to most
					//targets.sort((a, b) => a.hits / a.hitsMax - b.hits / b.hitsMax);
					//console.log((targets[targets.length-1].hits/ targets[targets.length-1].hitsMax))
					//console.log("sorted repair targets" +targets);
					//team 1
					if (creep.memory.team == 1) {
						//check for containers
						//var a = targets.filter(structure => structure.structureType == STRUCTURE_CONTAINER);
						//if containers need repairing delete extra targets
						if (Memory.toBeRepairedContainers.length > 0) {
							//check if dest is set
							if (!creep.memory.dest) {
								creep.memory.dest = Memory.toBeRepairedContainers[0].id;
							}
							//const towers = creep.room.find(FIND_STRUCTURES, { filter: object => object.energyAvailable < object.energyCapacity });
							var dest = Game.getObjectById(creep.memory.dest);
							//console.log("dest: " + dest.hits + " / " + dest.hitsMax);
							//check if dest is invalid or full
							if (!dest || dest.hits == dest.hitsMax) {
								creep.memory.dest = Memory.toBeRepairedContainers[0].id;
								dest = Game.getObjectById(creep.memory.dest);
							}
						} else {
							//check if dest is set
							if (!creep.memory.dest) {
								creep.memory.dest = Memory.toBeRepaired[Memory.toBeRepaired.length - 1].id;
							}
							//const towers = creep.room.find(FIND_STRUCTURES, { filter: object => object.energyAvailable < object.energyCapacity });
							var dest = Game.getObjectById(creep.memory.dest);
							//console.log("dest: " + dest.hits + " / " + dest.hitsMax);
							//check if dest is invalid or full
							if (!dest || dest.hits == dest.hitsMax) {
								creep.memory.dest = Memory.toBeRepaired[Memory.toBeRepaired.length - 1].id;
								dest = Game.getObjectById(creep.memory.dest);
							}
						}
						//not team 1
					} else {
						if (!creep.memory.dest) {
							creep.memory.dest = Memory.toBeRepaired[0].id;
						}
						var dest = Game.getObjectById(creep.memory.dest);
						//console.log(dest);
						if (!dest || dest.hits == dest.hitsMax) {
							creep.memory.dest = Memory.toBeRepaired[0].id;
							dest = Game.getObjectById(creep.memory.dest);
						}
					}
					//console.log("dest: " + dest);
					//console.log(creep.moveTo(dest))
					//move to dest
					if (creep.repair(dest) == ERR_NOT_IN_RANGE) {
						creep.moveTo(dest ,{
							visualizePathStyle: {
								fill: 'solid',
								stroke: '#fff',
								lineStyle: 'dashed',
								strokeWidth: .15,
								opacity: 1
							}}
						);
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
