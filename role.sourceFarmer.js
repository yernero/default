var roleUpgrader = require("role.upgrader");
var roleFiller = require("role.filler");
var roleBuilder = require("role.builder");
var fillContainers = require("fill.containers");
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
                fillContainers.run(creep);
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
