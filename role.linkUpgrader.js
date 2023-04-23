var collect = require("collect");
var linksMgr = require("mgr.links");
var roleUpgrader = {

	/** @param {Creep} creep **/
	run: function (creep) {
		var room = creep.room;
		var roomName = room.name;
		//check if links exist
		//var links = creep.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK })
		var links = linksMgr.findLinksInRoom(room);
		//console.log( roomName + " " + links)
		if (links.length < 2) {
			//if less than 2 links in a room, become a regular upgrader
			creep.memory.role = "upgrader";
		} else {
			//console.log(Memory[roomName].links.upgradeLink)
		}
		//Upgrading Controller
		if (creep.memory.upgrading) {
			//changing status
			if (creep.store.energy == 0) {
				creep.memory.upgrading = false;
				creep.say('⚡');
			} else {
				//console.log(creep);
				//console.log(links.length)
				//assign upgradeLink in memory
				if (links.length > 2 && (Memory[roomName].links.upgradeLink == null || Memory[roomName].links.upgradeLink == -1)) {
					//var links = creep.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK })
					//console.log(roomName + " " + links);
					//sort by closest
					this.setUpgradeLink(links, creep, roomName)
				} else {
					switch (creep.upgradeController(creep.room.controller)) {
						case 0:
							if (links.length > 1 && (Memory[roomName].links.upgradeLink == null || Memory[roomName].links.upgradeLink == -1)) {
								this.setUpgradeLink(links, creep, roomName)
							}

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
				if (Memory[roomName].links.upgradeLink != -1) {
					creep.memory.link = Memory[roomName].links.upgradeLink;
					collect.links(creep);

				} else {
					collect.containers(creep)
				}
				//console.log(links);
			}

		}
	}
	,
	setUpgradeLink: function (links, creep, roomName) {
		links.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
		console.log(roomName + " " + links);
		var upgradeLink = links[0];
		Memory[roomName].links.upgradeLink = upgradeLink.id;
	}


};

module.exports = roleUpgrader;
