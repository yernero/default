var collectLinks = require("collect.links");
var roleUpgrader = {

	/** @param {Creep} creep **/
	run: function (creep) {
		//check if links exist
		var links = creep.room.find(FIND_STRUCTURES,{filter: (i) => i.structureType == STRUCTURE_LINK})
		if(links.length < 2){
			//if less than 2 links in a room, become a regular upgrader
			creep.memory.role = "upgrader";
		}
		//Upgrading Controller
		if (creep.memory.upgrading) {
			//changing status
			if (creep.store.energy == 0) {
				creep.memory.upgrading = false;
				creep.say('⚡');
			} else {
				var links = creep.room.find(FIND_STRUCTURES,{filter: (i) => i.structureType == STRUCTURE_LINK})
				//console.log(links);
				//sort by closest
				links.sort((a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b) );
				var upgradeLink = links[0];
				Memory.links.upgradeLink =  upgradeLink.id;
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
				
				collectLinks.run(creep);
				//console.log(links);
			}

		}
	}
};

module.exports = roleUpgrader;
