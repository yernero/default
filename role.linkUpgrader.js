var collectLinks = require("collect.links");
var roleUpgrader = {

	/** @param {Creep} creep **/
	run: function (creep) {
		//check if links exist
		var links = creep.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK })
		if (links.length < 2) {
			//if less than 2 links in a room, become a regular upgrader
			creep.memory.role = "upgrader";
		} else {
			creep.memory.link = Memory.links.upgradeLink;
		}
		//Upgrading Controller
		if (creep.memory.upgrading) {
			//changing status
			if (creep.store.energy == 0) {
				creep.memory.upgrading = false;
				creep.say('⚡');
			} else {
				//console.log(creep);
				//assign upgradeLink in memory
				if (Memory.links.upgradeLink == null) {
					var links = creep.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK })
					//console.log(links);
					//sort by closest
					links.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
					var upgradeLink = links[0];
					Memory.links.upgradeLink = upgradeLink.id;
				} else {
					switch (creep.upgradeController(creep.room.controller)) {
						case 0:
							break;
						case -1:
							console.log("not my controller")
							break;
						case -4:
							break;
						case -9:
							creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffaa00' } });
							break;
						case -12:
							creep.memory.role = "filler";
							break;
						default:
							console.log(creep.upgradeController(creep.room.controller));
							console.log("Uknown error in Link Upgrader");
							break;
					}

				}

			}

			//finding energy
		} else {
			//makes sure memory created
			creep.memory.upgrading = false;
			//changing status
			if (creep.store.getFreeCapacity() == 0) {
				creep.memory.upgrading = true;
				creep.say('🔼');//📈
			} else {
				collectLinks.run(creep);
				//console.log(links);
			}

		}
	}
};

module.exports = roleUpgrader;
