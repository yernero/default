var roleUpgrader = require("role.upgrader");
var collectSources = require("collect.sources");
var collectContainers = require("collect.containers");
var fillLinks = require("fill.links");
var fillTerms = require("fill.terminals");
var collectLinks = require("collect.links");
var fillContainers = require("fill.containers");
var linksMgr = require("mgr.links");
var roleFiller = {

	/** @param {Creep} creep **/
	run: function (creep) {
		var room = creep.room;
		var roomName = room.name;
		var upgradeLink = Game.getObjectById(Memory[roomName].links.upgradeLink);
		var storageLink = Game.getObjectById(Memory[roomName].links.storageLink);

		//console.log(creep.pos)

		/* var targets = creep.room.find(FIND_STRUCTURES,{filter: (structure) => return (structure.structureType == STRUCTURE_STORAGE ||structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity() > 0});
		 *///finding all storage containers not spawn with space left
		var linkToFill = Game.getObjectById(creep.memory.link);

		if (creep.memory.storing) {
			//setup link

			while (!linkToFill || Memory[roomName].links.storageLink == -1) {
				//find all links
				var links = linksMgr.findLinksInRoom(room);
				//console.log("Links" + links);
				//sort by closest
				links.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
				//console.log(links);
				creep.memory.link = links[0].id;
				Memory[roomName].links.storageLink = creep.memory.link;

			}
			if (creep.carry.energy == 0) {
				creep.memory.storing = false;
				creep.say('⚡');
			} else {
				//console.log(creep.pos)

				switch (creep.memory.team) {


					case 0:
						//var linkToFill = Game.getObjectById(creep.memory.link);
						//console.log(link)

						if (upgradeLink.store.getFreeCapacity(RESOURCE_ENERGY) < 50) {
							collectLinks.run(creep);
							if (creep.carry.energy == creep.carryCapacity) {
								creep.memory.storing = true;
								creep.say('🧪');
							}
						} else {
							if (linkToFill.store.getFreeCapacity(RESOURCE_ENERGY) > 500) {
								fillLinks.run(creep);
							} else if (room.terminal && room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 45000) {
								creep.memory.mineral = RESOURCE_ENERGY;
								fillTerms.run(creep);
							} else {
								creep.memory.mineral = RESOURCE_ENERGY;
								fillContainers.run(creep);
							}
						}

						break;
					case 1:
						console.log("im special")

					default:
						//var linkToFill = Game.getObjectById(creep.memory.link);
						//console.log(link)
						var container = Game.getObjectById(creep.memory.container)
						//console.log(container)
						if (linkToFill.store.getFreeCapacity(RESOURCE_ENERGY) > 250) {
							fillLinks.run(creep);
						} else if (container && container.store.getUsedCapacity(RESOURCE_ENERGY) / container.store.getCapacity(RESOURCE_ENERGY) > .1) {
							//console.log("valid container" + Game.getObjectById(creep.memory.container).store.getUsedCapacity(RESOURCE_ENERGY)/Game.getObjectById(creep.memory.container).store.getCapacity(RESOURCE_ENERGY))
							creep.memory.mineral = RESOURCE_ENERGY;
							fillTerms.run(creep);
						} else {

						}
						break;
				}

			}

		} else {
			//make sure memory created
			creep.memory.storing = false;
			//changing status
			if (creep.carry.energy == creep.carryCapacity) {
				creep.memory.storing = true;
				creep.say('🧪');
			} else {
				switch (creep.memory.team) {
					case 1:
						console.log("Im Special")



					case 0:


					default:


						//console.log(upgradeLink);
						if (upgradeLink.store.getFreeCapacity(RESOURCE_ENERGY) < 50) {
							fillContainers.run(creep)
							if (creep.carry.energy == 0) {
								creep.memory.storing = false;
								creep.say('⚡')
							}
						} else {
							//if link is not full grab from container
							if (linkToFill && linkToFill.store.getFreeCapacity(RESOURCE_ENERGY) < 5) {
								console.log("Excess Energy in upgrade Link")
								collectLinks.run(creep);
							} else {
								collectContainers.run(creep);


							}
						}


				}



			}
		}
		//creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});

	}
};

module.exports = roleFiller;
