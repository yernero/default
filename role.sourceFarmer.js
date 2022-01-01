var roleUpgrader = require("role.upgrader");
var roleFiller = require("role.filler");
var roleBuilder = require("role.builder");
var roleSourceFarmer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        //emptying energy 
        if (!creep.memory.team) {
            creep.memory.team = 0;
        }

        if (creep.memory.emptying) {
            //creep is empty so switch modes
            if (creep.store.energy == 0) {
                creep.memory.emptying = false;
                creep.say('⛏️');

            } else {
                var targets = creep.room.find(FIND_STRUCTURES).filter(
                    structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                        structure.structureType) !== -1).filter(
                            structure => structure.store.getFreeCapacity([RESOURCE_ENERGY]) > 0);

                if (targets.length == 0) {
                   // console.log("Out of storage")
                    roleBuilder.run(creep);
                }
                if (creep.memory.team === 0) {
                    //find containers and storage with storage open
                    var targets = creep.room.find(FIND_STRUCTURES).filter(
                        structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                            structure.structureType) !== -1).filter(
                                structure => structure.store.energy < structure.store.getCapacity()).filter(
                                    structure => creep.pos.getRangeTo(structure) < 10
                                );
                    //current container is chosen manually from structures less than 2 spots away, need to find closest container. 
                    //(targets);
                    if (targets.length == 0) {
                        // console.log(" team 1 out")
                        targets = creep.room.find(FIND_STRUCTURES).filter(
                            structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                                structure.structureType) !== -1).filter(
                                    structure => structure.store.energy < structure.store.getCapacity());
                    }
                    if (creep.transfer(targets[targets.length - 1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[targets.length - 1], { visualizePathStyle: { stroke: '#FFFFFF' } });
                    }


                } else if (creep.memory.team === 1) {
                    //find containers and storage with storage open
                    var targets = creep.room.find(FIND_STRUCTURES).filter(
                        structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                            structure.structureType) !== -1).filter(
                                structure => structure.store.energy < structure.store.getCapacity()).filter(
                                    structure => creep.pos.getRangeTo(structure) < 10
                                );
                    //current container is chosen manually from structures less than 2 spots away, need to find closest container. 
                    //console.log(targets);
                    if (targets.length == 0) {
                        // console.log(" team 1 out")
                        targets = creep.room.find(FIND_STRUCTURES).filter(
                            structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                                structure.structureType) !== -1).filter(
                                    structure => structure.store.energy < structure.store.getCapacity());
                    }
                    if (creep.transfer(targets[targets.length - 1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[targets.length - 1], { visualizePathStyle: { stroke: '#FFFFFF' } });
                    }

                }
            }
            //collecting energy
        } else {

            // targets = targets.sort((b, a) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));
            //console.log(targets);

            //creep is full so start emptying
            if (creep.store.energy == creep.store.getCapacity(RESOURCE_ENERGY)) {
                creep.memory.emptying = true;
                creep.say('🔄');
            } else {
                //find a source
                var sources = creep.room.find(FIND_SOURCES);
                //console.log("Sources in room" + sources)
                // team 0
                if (creep.memory.team == 0 || sources.length < 2) {
                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
                    }
                    //team 1
                } else if (creep.memory.team == 1 && sources.length > 1) {
                    if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                        //console.log(
                            creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#FFFFFF' } })
                       // )
                    }
                }
            }
        }
    }

};

module.exports = roleSourceFarmer;
