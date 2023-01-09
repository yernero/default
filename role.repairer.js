var roleUpgrader = require('role.upgrader');
var collectContainers = require("collect.containers");
var memMgr = require("mgr.memory");
var roleRepairer = {

	/** @param {Creep} creep **/
	run: function (creep) {
		var room = creep.room;
		var roomName = room.name;
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
				if (Memory[roomName].repairs.toBeRepaired == null || !Memory[roomName].repairs.toBeRepaired[0]) {
					//creep.memory.upgrading = true;
					//console.log("Nothing to repair in " + roomName);
					memMgr.updateRepairMem(room)
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
						if (Memory[roomName].repairs.toBeRepairedContainers[1]) {
							//check if dest is set
							if (!creep.memory.dest) {
								creep.memory.dest = Memory[roomName].repairs.toBeRepairedContainers[0].id;
							}
							//const towers = creep.room.find(FIND_STRUCTURES, { filter: object => object.energyAvailable < object.energyCapacity });
							var dest = Game.getObjectById(creep.memory.dest);
							//console.log("dest: " + dest.hits + " / " + dest.hitsMax);
							//check if dest is invalid or full
							if (!dest || dest.hits == dest.hitsMax) {
								creep.memory.dest = Memory[roomName].repairs.toBeRepairedContainers[0].id;
								dest = Game.getObjectById(creep.memory.dest);
							}
						} else {
							//check if dest is set
							if (!creep.memory.dest) {
								creep.memory.dest = Memory[roomName].repairs.toBeRepaired[Memory[roomName].repairs.toBeRepaired.length - 1].id;
							}
							//const towers = creep.room.find(FIND_STRUCTURES, { filter: object => object.energyAvailable < object.energyCapacity });
							var dest = Game.getObjectById(creep.memory.dest);
							//console.log("dest: " + dest.hits + " / " + dest.hitsMax);
							//check if dest is invalid or full
							if (!dest || dest.hits == dest.hitsMax) {
								creep.memory.dest = Memory[roomName].repairs.toBeRepaired[Memory[roomName].repairs.toBeRepaired.length - 1].id;
								dest = Game.getObjectById(creep.memory.dest);
							}
						}
						//not team 1
					} else {
						if (!creep.memory.dest) {
							creep.memory.dest = Memory[roomName].repairs.toBeRepaired[0].id;
						}
						var dest = Game.getObjectById(creep.memory.dest);
						//console.log(dest);
						if (!dest || dest.hits == dest.hitsMax) {
							creep.memory.dest = Memory[roomName].repairs.toBeRepaired[0].id;
							dest = Game.getObjectById(creep.memory.dest);
						}
					}
					//console.log("dest: " + dest);
					//console.log(creep.moveTo(dest))
					//move to dest
					if (creep.repair(dest) == ERR_NOT_IN_RANGE) {
						creep.moveTo(dest, {
							visualizePathStyle: {
								fill: 'transparent',
								stroke: '#fff',
								lineStyle: 'dashed',
								strokeWidth: .15,
								opacity: 1
							}
						}
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
				collectContainers.run(creep);

			}
		}
	}
};
module.exports = roleRepairer;
