var roleUpgrader = require("role.upgrader");
var roleFiller = {

	/** @param {Creep} creep **/
	run: function (creep) {
		/* var targets = creep.room.find(FIND_STRUCTURES,{filter: (structure) => return (structure.structureType == STRUCTURE_STORAGE ||structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity() > 0});
		 *///finding all storage containers not spawn with space left
		if (creep.memory.storing) {
			if (creep.carry.energy == 0) {
				creep.memory.storing = false;
				creep.say('⚡');
			} else {
				var targets = creep.room.find(FIND_STRUCTURES)
					.filter(i => i.structureType == STRUCTURE_EXTENSION).filter(i => i.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
				//console.log(targets);
				if (targets.length < 1) {
					var targets = creep.room.find(FIND_STRUCTURES)
						.filter(structure => i.structureType == STRUCTURE_SPAWN);
				}
				//console.log(targets);

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
							if (creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
							}
						} else {
							if (creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
							}
						}
					}
				} else {

					/* var targets = creep.room.find(FIND_STRUCTURES,
						{ filter: (structure) => { 
							return (structure.structureType == STRUCTURE_EXTENSION 
								|| structure.structureType == STRUCTURE_SPAWN) 
								&& structure.energy < structure.energyCapacity; } }); */
					if (targets.length < 1) {
						roleUpgrader.run(creep);
					} else {
						if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
						}
					}
				}
			}

		} else {
			//make sure memory created
			creep.memory.storing = false;
			//changing status
			if (creep.carry.energy == creep.carryCapacity) {
				creep.memory.storing = true;
				creep.say('🧪');
			} else {
				//check for loose energy
				var droppedres = creep.room.find(FIND_DROPPED_RESOURCES, {
					filter: x => x.resourceType == RESOURCE_ENERGY
						&& x.amount > 1000
				});
				//console.log("Dropped Energy: " + droppedres); //prints list
				//console.log("Dropped Energy: " + droppedres[0].pos); //prints location of first

				//check if any Dropped res worth collecting
				if (droppedres.length > 0) {
					//console.log("Dropped res[0] amount: " + droppedres[0].amount);

					//check if creep can pickup energy
					if (creep.pickup(droppedres[0]) == ERR_NOT_IN_RANGE) {
						//check if accessible, try last dropped energy in list instead
						if (creep.moveTo(droppedres[0],
							{ visualizePathStyle: { stroke: '#ffffff' } }) == ERR_NO_PATH
							&& droppedres.length > 1) {

							creep.moveTo(droppedres[droppedres.length - 1],
								{ visualizePathStyle: { stroke: '#ffffff' } })
						}
					}

					//No droppres energy
				} else {
					//find structures with energy
					var targets = creep.room.find(FIND_STRUCTURES,
						{
							filter: (i) => (i.structureType == STRUCTURE_CONTAINER ||
								i.structureType == STRUCTURE_STORAGE)
								&& i.store[RESOURCE_ENERGY] > 50
						});
					//console.log("containers with more than 50 energy" +targets);

					//sort by largest to smallest
					targets = targets.sort((a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY));
					//console.log("Sorted targs" + targets);
					//console.log(targets[0])

					//console.log(creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' }}))

					//if more than 1 structure with energy, go to first one
					if (targets.length > 1) {
						if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' } });
						}
						//if just 1 structure with energy, go to first one
					} else if (targets.length == 1) {
						if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' } });
						}
						//if no structure with energy, go to a source
					} else {
						var sources = creep.room.find(FIND_SOURCES);
						if (creep.harvest(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
						}
					}
				}

			}


		}
		//creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});

	}
};

module.exports = roleFiller;
