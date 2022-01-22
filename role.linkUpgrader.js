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
				//find all links
				var links = creep.room.find(FIND_STRUCTURES,{filter: (i) => i.structureType == STRUCTURE_LINK})
				//sort by closest
				links.sort((a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b) );
				//remove energy
				console.log(creep.withdraw(links[0],RESOURCE_ENERGY))
				var ret = creep.withdraw(links[0],RESOURCE_ENERGY)
				if(ret  == ERR_NOT_IN_RANGE){
					creep.moveTo(links[0])
				}else if(ret == ERR_NOT_ENOUGH_RESOURCES ){
					var upgradeLink = links[0];
					//remove upgradeLink
					links.splice(0,1);
					//sort by most energy stored
					links.sort((a,b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY))
					//transfer from link with energy to link without
					links[0].transferEnergy(upgradeLink);
					console.log(links);
				}
			

				//console.log(links);
			}

		}
	}
};

module.exports = roleUpgrader;
