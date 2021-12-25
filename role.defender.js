
var roledefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
	   	var redTarget = creep.room.find( FIND_HOSTILE_CREEPS);
	   	
	  if (redTarget.length >0) {
	      //  console.log(redTarget);
	        creep.attack(redTarget[1]);
	    }
    }
};

module.exports = roledefender;
