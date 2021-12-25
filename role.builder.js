var roleRepairer = require("role.repairer");
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
		if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
			}
    	//creep.memory.building =false;
		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

		//console.log(targets);
    	if(targets.length < 1){
			//There are no construction sites
    		//if(creep.carry.energy <creep.carryCapacity && !creep.memory.building){
            roleRepairer.run(creep);

      }else{
    			if(creep.memory.building) {
    			       if(creep.memory.team == 1){
    					//var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        			       if(targets.length >1) {
        						         if(creep.build(targets[targets.length-1]) == ERR_NOT_IN_RANGE) {
        							                creep.moveTo(targets[targets.length-1], {visualizePathStyle: {stroke: '#ffffff'}});
        						         }
    					      }else{
    						            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
    							                   creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
    						            }
    					      }
				         }else {
					              if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
					              }
				         }
		  // creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});
			}else{
    				var sources = creep.room.find(FIND_STRUCTURES)
    				.filter(structure => [STRUCTURE_STORAGE].indexOf(structure.structureType) !== -1).filter(structure => structure.store.energy >1500);

    				//.filter(structure => structure.store.energy >0);
            //console.log(sources[0].store.energy);
            if(sources.length <1){
                 var sources = creep.room.find(FIND_SOURCES);
    			    	 	if(creep.harvest(sources[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});}
               // roleRepairer.run(creep);
            }else{
   // console.log(sources);
                     if(creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                               creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#000000'}});
                     }
            }
			}
			
		}
	}
};

module.exports = roleBuilder;
