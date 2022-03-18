var roleUpgrader = require("role.upgrader");
var collectSources = require("collect.sources");
var collectContainers = require("collect.containers");
var fillLinks = require("fill.links");
var collectLinks = require("collect.links");
var fillContainers = require("fill.containers");
var roleFiller = {

	/** @param {Creep} creep **/
	run: function (creep) {
		//console.log(creep.pos);

		/* var targets = creep.room.find(FIND_STRUCTURES,{filter: (structure) => return (structure.structureType == STRUCTURE_STORAGE ||structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity() > 0});
		 *///finding all storage containers not spawn with space left
		if (creep.memory.storing) {
			if (creep.carry.energy == 0) {
				creep.memory.storing = false;
				creep.say('⚡');
			} else {
				if(creep.memory.team == 0){
					Memory.links.upgradeLink =  "61ea04390bd2bf1717dc4e56";

					var upgradeLink = Game.getObjectById(Memory.links.upgradeLink);

					if(upgradeLink.store.getFreeCapacity(RESOURCE_ENERGY) > 100){
						fillLinks.run(creep);
					}else{
						fillContainers.run(creep);
					}
				}else if(creep.memory.team == 1){
					fillLinks.run(creep);
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
				if(creep.memory.team == 0){
					Memory.links.upgradeLink =  "61ea04390bd2bf1717dc4e56";

					var upgradeLink = Game.getObjectById(Memory.links.upgradeLink);

					//console.log(upgradeLink);
					if(upgradeLink.store.getFreeCapacity(RESOURCE_ENERGY) > 100){
						collectContainers.run(creep);
					}else{
						collectLinks.run(creep);
					}
				}else if(creep.memory.team == 1){
					collectContainers.run(creep);
				}

			}
		}
		//creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});

	}
};

module.exports = roleFiller;
