var collectContainers = require("collect.containers");
var roleUpgrader = {

	/** @param {Creep} creep **/
	run: function (creep) {
		//check if links exist
		var links = creep.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK })
		if (links.length > 1 && creep.memory.role === "upgrader") {
			//if less than 2 links in a room, become a regular upgrader
			creep.memory.role = "linkUpgrader";
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
						{ visualizePathStyle: { stroke: '#ffa' } });
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
				collectContainers.run(creep);
			}

		}
	}
};

module.exports = roleUpgrader;
