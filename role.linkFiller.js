var roleUpgrader = require("role.upgrader");
var collectSources = require("collect.sources");
var collectContainers = require("collect.containers");
var fillLinks = require("fill.links");
var fillTerms = require("fill.terminals");
var collectLinks = require("collect.links");
var fillContainers = require("fill.containers");
var roleFiller = {

	/** @param {Creep} creep **/
	run: function (creep) {
		//console.log(creep.pos);

		//setup link


		while ((Game.getObjectById(creep.memory.link) == null)) {
			//find all links
			var links = creep.room.find(FIND_STRUCTURES, {
				filter:
					(i) => (i.structureType == STRUCTURE_LINK)
						&& i.id != Memory.links.upgradeLink
			})
			//show links
			//console.log("Links" + links);
			//sort by closest
			links.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
			console.log(links);

			//remove energyter 
			//console.log(creep.withdraw(links[0],RESOURCE_ENERGY))
			creep.memory.link = links[0].id;


		}
		var linkToFill = Game.getObjectById(creep.memory.link);
		//console.log(creep.pos)

		/* var targets = creep.room.find(FIND_STRUCTURES,{filter: (structure) => return (structure.structureType == STRUCTURE_STORAGE ||structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity() > 0});
		 *///finding all storage containers not spawn with space left

		if (creep.memory.storing) {
			if (creep.carry.energy == 0) {
				creep.memory.storing = false;
				creep.say('⚡');
			} else {
				//console.log(creep.pos)

				switch (creep.memory.team) {


					case 0:
						var upgradeLink = Game.getObjectById(Memory.links.upgradeLink);
						//var linkToFill = Game.getObjectById(creep.memory.link);
						//console.log(link)

						if (linkToFill.store.getFreeCapacity(RESOURCE_ENERGY) > 500) {
							fillLinks.run(creep);
						} else if(myRoom.terminal && myRoom.terminal.store.getUsedCapacity(RESOURCE_ENERGY) <45000){
							creep.memory.mineral = RESOURCE_ENERGY;
							fillTerms.run(creep);
						}else{
							creep.memory.mineral = RESOURCE_ENERGY;
							fillContainers.run(creep);
						}
						break;
					case 1:
						console.log("im special")

					default:
						var upgradeLink = Game.getObjectById(Memory.links.upgradeLink);
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

						var upgradeLink = Game.getObjectById(Memory.links.upgradeLink);

						//console.log(upgradeLink);
						//if link is not full grab from container
						if (linkToFill.store.getFreeCapacity(RESOURCE_ENERGY) > 50) {
							collectContainers.run(creep);
						} else {
							console.log("Excess Energy in upgrade Link")
							collectLinks.run(creep);
						}
				}



			}
		}
		//creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});

	}
};

module.exports = roleFiller;
