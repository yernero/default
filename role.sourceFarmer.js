var roleUpgrader = require("role.upgrader");
var roleSourceFarmer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        //emptying energy 
        if (creep.memory.emptying) {
            //roleSpawnFarmer.run(creep);
            if (creep.store.energy == 0) {
                creep.memory.emptying = false;
                creep.say('⛏️');

            } else {
                //find containers and storage with storage open
                var targets = creep.room.find(FIND_STRUCTURES).filter(
                    structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                        structure.structureType) !== -1).filter(
                            structure => structure.store.energy < structure.store.getCapacity()).filter(
                                structure => creep.pos.getRangeTo(structure) < 2
                            );
                //current container is chosen manually, need to find closest container. 
                console.log(targets);
                if (creep.transfer(targets[targets.length-1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[targets.length-1], { visualizePathStyle: { stroke: '#FFFFFF' } });
                }
            }
            //collecting energy
        } else {

            // targets = targets.sort((b, a) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));
            //console.log(targets);
            if (creep.store.energy == creep.store.getCapacity(RESOURCE_ENERGY)) {
                creep.memory.emptying = true;
                creep.say('🔄');
            } else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.memory.team == 1) {
                    if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#FFC0CB' } });
                    }
                } else if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
                }
            }
        }
    }

};

module.exports = roleSourceFarmer;
