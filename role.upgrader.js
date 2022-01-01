var roleUpgrader = {

	/** @param {Creep} creep **/
	run: function (creep) {
		//Upgrading Controller
		if (creep.memory.upgrading) {
			//changing status
			if (creep.store.energy == 0) {
				creep.memory.upgrading = false;
				creep.say('⚡');
			} else {
				//Try to upgrade, move closer if needed
				if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller,
						{ visualizePathStyle: { stroke: '#ffaa00' } });
				} else {
					//console.log(creep.upgradeController(creep.room.controller));
				}
			}

			//finding energy
		} else {
			//makes sure memory created
			creep.memory.upgrading = false;
			//changing status
			if (creep.store.getFreeCapacity() == 0) {
				creep.memory.upgrading = true;
				creep.say('📈🔼');
			} else {
				//check for loose energy
				var droppedres = creep.room.find(FIND_DROPPED_RESOURCES, {
					filter: x => x.resourceType == RESOURCE_ENERGY
						&& x.amount > 100
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
};

module.exports = roleUpgrader;
