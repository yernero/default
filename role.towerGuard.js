var towerGuard ={

	run:function(creep){
		var towers = creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.store.energy < structure.store.energyCapacity});
		//console.log(towers);
		creep.memory.filling = false;

		if((creep.carry.energy == 0 && !creep.memory.filling)) {
			var targets = creep.room.find(FIND_STRUCTURES,{filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE) && structure.store.energy >0;}});
			if(targets.length > 0) {

            	if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            		creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            	}
			}
			if(creep.carry.energy == creep.carryCapacity){
				creep.memory.filling = true;
			}
		}else{
			creep.memory.filling = true;
			if(towers<1){
				if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
	            }
			}
			if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    			creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}});
    		}
			if(creep.carry.energy == 0){
				creep.memory.filling = false;
			}
		}
    		//christmas
	}
}
module.exports = towerGuard;
