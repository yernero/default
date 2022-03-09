var roleUpgrader = require("role.upgrader");
var collectSources = require("collect.sources");
var collectContainers = require("collect.containers");
var roleFiller = {

	/** @param {Creep} creep **/
	run: function (creep) {
		/* var targets = creep.room.find(FIND_STRUCTURES,{filter: (structure) => return (structure.structureType == STRUCTURE_STORAGE ||structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity() > 0});
		 *///finding all storage containers not spawn with space left
		if (creep.memory.storing) {
			if (creep.carry.energy == 0) {
				creep.memory.storing = false;
				creep.say('⚡');
			} else {
					//find all links
					var links = creep.room.find(FIND_STRUCTURES,{filter:
						 (i) => (i.structureType == STRUCTURE_LINK)
						  && i.store.getFreeCapacity(RESOURCE_ENERGY) > 100})
					//show links
					//console.log("Links" + links);
					//sort by closest
					links.sort((a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b) );
					//remove energy
					//console.log(creep.withdraw(links[0],RESOURCE_ENERGY))
					if(creep.transfer(links[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
						creep.moveTo(links[0])
					}
					//console.log(links);
			}

		} else {
			//make sure memory created
			creep.memory.storing = false;
			//changing status
			if (creep.carry.energy == creep.carryCapacity) {
				creep.memory.storing = true;
				creep.say('🧪');
			} else {
				var links = creep.room.find(FIND_STRUCTURES,{filter:
					(i) => (i.structureType == STRUCTURE_LINK)
					 && i.store.getFreeCapacity(RESOURCE_ENERGY) > 100});
				collectContainers.run(creep);
			}
		}
		//creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});

	}
};

module.exports = roleFiller;
