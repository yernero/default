var roleUpgrader = require("role.upgrader");
var collectSources = require("collect.sources");
var collectContainers = require("collect.containers");
const { getExtensions } = require("./mgr.memory");

var roleFiller = {

	/** @param {Creep} creep **/
	run: function (creep) {
		var room = creep.room;
		var roomName = room.name;
		//console.log(creep.pos)
		/* var extensions = creep.room.find(FIND_STRUCTURES,{filter: (structure) => return (structure.structureType == STRUCTURE_STORAGE ||structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity() > 0});
		 *///finding all storage containers not spawn with space left
		if (creep.memory.storing) {
			if (creep.carry.energy == 0) {
				creep.memory.storing = false;
				creep.say('⚡');
			} else {
				var extensions = creep.room.find(FIND_STRUCTURES)	.filter(i => i.structureType == STRUCTURE_EXTENSION).filter(i => i.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
				//var extensions = getExtensions(room);
					//console.log(roomName + " " + extensions);
				if (extensions.length < 1) {
					var extensions = creep.room.find(FIND_STRUCTURES)
						.filter(i => i.structureType == STRUCTURE_SPAWN);
				}
				//console.log(extensions);

				if (creep.room.energyAvailable == creep.room.energyCapacityAvailable) {
					//all extensions and spawn is full
					//console.log("ALL STORAGE FULL");

					var extensions = creep.room.find(FIND_STRUCTURES).filter(structure => [STRUCTURE_TOWER, STRUCTURE_CONTAINER].indexOf(structure.structureType) !== -1)
						.filter(structure => structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
					//console.log(extensions);
					if (extensions.length < 1) {
						roleUpgrader.run(creep);
						/*var extensions = creep.room.find(FIND_STRUCTURES,
							{filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;}});*/
					} else {

						if (creep.memory.team == 1) {
							if (creep.repair(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveTo(extensions[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
							}
						} else {
							if (creep.repair(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveTo(extensions[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
							}
						}
					}
				} else {

					/* var extensions = creep.room.find(FIND_STRUCTURES,
						{ filter: (structure) => { 
							return (structure.structureType == STRUCTURE_EXTENSION 
								|| structure.structureType == STRUCTURE_SPAWN) 
								&& structure.energy < structure.energyCapacity; } }); */
					if (extensions.length < 1) {
						roleUpgrader.run(creep);
					} else {
						if (creep.transfer(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(extensions[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
						}
					}
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
				collectContainers.run(creep);
			}
		}
		//creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});

	}
};

module.exports = roleFiller;
