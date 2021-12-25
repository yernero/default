var roleUpgrader = require("role.upgrader");

var roleSettler ={
		
		
		run:function(creep){
		    
		         
				if(creep.memory.rotate){
		    	    creep.say('🔄 Im here for');
		    	    creep.memory.rotate = false
				}else{
			        creep.say("for spice");
			    	creep.memory.rotate = true;
				}
	        if(!creep.room.controller.energyAvailable < 200){
                //roleUpgrader.run(creep)
                if(creep.room.controller.isActive()){
                    
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});}}
	        }else{
	            creep.moveTo(Game.flags.Flag1,{visualizePathStyle: {stroke: '#ffaa00'}});
	        }
	    	  
		}
};
module.exports = roleSettler;