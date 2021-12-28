var roleUpgrader = {

	/** @param {Creep} creep **/
	run: function (creep) {
		if(creep.memory.upgrading){

		}else{
			//creep.memory.upgrading = false;
		}

		if (creep.memory.upgrading && creep.store.energy == 0) {
			creep.memory.upgrading = false;
			creep.say('🔄');
		}
		if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
			creep.memory.upgrading = true;
			creep.say('⚡ upgrade');
		}

		if (creep.memory.upgrading) {
			if (creep.store.energy == 0) {
				creep.memory.upgrading = false;

			}
			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffaa00' } });
			} else {
				//console.log(creep.upgradeController(creep.room.controller));
			}
		} else {
			var droppedres = creep.room.find(FIND_DROPPED_RESOURCES, {
				filter: { resourceType:  RESOURCE_ENERGY }});
				//console.log("Dropped res: " + droppedres);
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
							   i.store[RESOURCE_ENERGY] > 50});
				//console.log(targets);
				//console.log("Sorted targs" +targets.sort((b, a) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY)));
				targets = targets.sort((b, a) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));
			if(droppedres.length > 0 && droppedres[0].amount > 100){
				//console.log("Dropped res[0] amount: " + droppedres[0].amount);
				if(creep.pickup(droppedres[0])== -9){
					if(creep.moveTo(droppedres[0],{visualizePathStyle:{stroke: '#ffffff'}}) == -2 && droppedres.length > 1){
						creep.moveTo(droppedres[droppedres.length-1],{visualizePathStyle:{stroke: '#ffffff'}})
						
					}else{
					
					}
				}
			}else{
				//console.log(creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' }}))
				if (targets.length > 1) {
					if (creep.withdraw(targets[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[1], { visualizePathStyle: { stroke: '#ffaa00' } });
					}
	
				} else if (targets.length == 1) {
					if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' } });
					}
				} else {
					var sources = creep.room.find(FIND_SOURCES);
					if (creep.harvest(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
					}
				}
			//console.log("containers with more than 50 energy" +targets);


		

		}
		}
	}
};

module.exports = roleUpgrader;
