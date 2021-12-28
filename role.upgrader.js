var roleUpgrader = {

	/** @param {Creep} creep **/
	run: function (creep) {
		if(creep.memory.upgrading){

		}else{
			creep.memory.upgrading = false;
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
			var droppedres = creep.room.find(FIND_DROPPED_RESOURCES);
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
							   i.store[RESOURCE_ENERGY] > 50});
			if(droppedres.length > 0){
				console.log("Dropped res: " + droppedres[0].amount);
				if(creep.pickup(droppedres[0])== -9){
					if(creep.moveTo(droppedres[0],{visualizePathStyle:{stroke: '#ffffff'}}) == -2 && droppedres.length > 1){
						creep.moveTo(droppedres[droppedres.length-1],{visualizePathStyle:{stroke: '#ffffff'}})
						
					}else{
						if (targets.length > 1) {
							if (creep.withdraw(targets[2], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveTo(targets[2], { visualizePathStyle: { stroke: '#ffaa00' } });
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
					}
				}
			}else{
			
			console.log("containers with more than 50 energy" +targets);


		

		}
		}
	}
};

module.exports = roleUpgrader;
