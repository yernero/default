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

<<<<<<< Updated upstream
=======
		//setup link
		if (creep.memory.link == null) {
            //find all links
            var links = creep.room.find(FIND_STRUCTURES, {
                filter:
                    (i) => (i.structureType == STRUCTURE_LINK)
                        && i.id != Memory.links.upgradeLink})
            //show links
            //console.log("Links" + links);
            //sort by closest
            links.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
            console.log(links);

            //remove energy
            //console.log(creep.withdraw(links[0],RESOURCE_ENERGY))
            if (creep.memory.team == 0) {
                creep.memory.link = links[0].id;
            } else if (creep.memory.team == 1){
                if (links.length > 1) {
                	creep.memory.link = links[1].id;
                }else if(links.length >0){
                    creep.memory.link =links[0].id;
                }
            }

        }




>>>>>>> Stashed changes
		/* var targets = creep.room.find(FIND_STRUCTURES,{filter: (structure) => return (structure.structureType == STRUCTURE_STORAGE ||structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity() > 0});
		 *///finding all storage containers not spawn with space left
		
		 if (creep.memory.storing) {
			if (creep.carry.energy == 0) {
				creep.memory.storing = false;
				creep.say('⚡');
			} else {
				if(creep.memory.team == 0){
<<<<<<< Updated upstream
					Memory.links.upgradeLink =  "61ea04390bd2bf1717dc4e56";

					var upgradeLink = Game.getObjectById(Memory.links.upgradeLink);

					if(upgradeLink.store.getFreeCapacity(RESOURCE_ENERGY) > 100){
=======
					//Memory.links.upgradeLink =  "61ea04390bd2bf1717dc4e56";

					var upgradeLink = Game.getObjectById(Memory.links.upgradeLink);
					var link = Game.getObjectById(creep.memory.link);

					if(link.store.getFreeCapacity(RESOURCE_ENERGY) > 700){
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
					if(upgradeLink.store.getFreeCapacity(RESOURCE_ENERGY) > 100){
=======
					if(upgradeLink.store.getFreeCapacity(RESOURCE_ENERGY) > 700){
>>>>>>> Stashed changes
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
