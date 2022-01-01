var roleRepairer = require("role.repairer");
var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep) {
		//creep.memory.building =false;
		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		//console.log(targets);
		if (targets.length < 1) {
			//console.log("repair");
			//There are no construction sites
			//if(creep.carry.energy <creep.carryCapacity && !creep.memory.building){
			roleRepairer.run(creep);
		} else {
			if (creep.memory.building) {
				if (creep.carry.energy == 0) {
					//Go Harvest
					creep.memory.building = false;
					creep.say('⚡');
				} else {
					if (creep.memory.team == 1) {
						//var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
						if (targets.length > 1) {
							//build containers first
							var a = targets.filter(structure => structure.structureType == STRUCTURE_CONTAINER);
							//console.log(a)
							if (a.length > 0) {
								targets = a;
							}
							if(!creep.memory.dest){
								creep.memory.dest = targets[targets.length-1].id;
							}
							//const towers = creep.room.find(FIND_STRUCTURES, { filter: object => object.energyAvailable < object.energyCapacity });
							var dest = Game.getObjectById(creep.memory.dest);
							//if already built
							if(!dest){
								creep.memory.dest = targets[targets.length-1].id;
								dest = targets[targets.length-1];
							}
							//console.log("dest: " + dest);
							if (creep.build(dest) == ERR_NOT_IN_RANGE) {
								creep.moveTo(dest, { visualizePathStyle: { stroke: '#000000' } });
							}
						} else {
							if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
								creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
							}
						}
					} else {
						if(!creep.memory.dest){
							creep.memory.dest = targets[0].id;
						}
						var dest = Game.getObjectById(creep.memory.dest);
						//already built
						if(!dest){
							creep.memory.dest = targets[targets.length-1].id;
							dest = targets[targets.length-1];
						}
						//console.log("dest: " + dest);
						if (creep.build(dest) == ERR_NOT_IN_RANGE) {
							creep.moveTo(dest, { visualizePathStyle: { stroke: '#000000' } });
						}
					}
				}

				// creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});
			} else {
				//make sure memory created
				creep.memory.building = false;
				//changing status
				if (creep.store.getFreeCapacity() == 0) {
					creep.memory.building = true;
					creep.say('🚧');
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

		}
	}
};

module.exports = roleBuilder;
