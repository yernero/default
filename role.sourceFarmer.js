var roleUpgrader = require("role.upgrader");
var roleFiller = require("role.filler");
var roleBuilder = require("role.builder");
var fill = require("fill");
var roleSourceFarmer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var room = creep.room;
        var roomName = room.name;
        if (!creep.memory.team) {
            creep.memory.team = 0;
        }
        //console.log(creep.memory.team);

        /* if (!creep.memory.source){
             var sources = creep.room.find(FIND_SOURCES);
             if(creep.sources.length > team+1){
                 
             }
         }*/
        //emptying energy 
        if (creep.memory.emptying) {
            //creep is empty so switch modes
            if (creep.store.energy == 0) {
                creep.memory.emptying = false;
                creep.say('⛏️');

            } else {
                if (creep.memory.team == 1) {
                    if (!creep.memory.sources[1]) {
                        if (!Memory[roomName].constructionSites.all[0]) {
                            creep.memory.role = "upgrader"
                        } else {
                            creep.memory.role = "builder"
                        }
                    }
                }
                var numOfLinks = Memory[roomName].links.total;
                // console.log(roomName + " " + numOfLinks)
                //creep.memory.link = links[0].id;
                if (numOfLinks > 0) {
                    //console.log("room " +room)

                    if (!creep.memory.link || creep.memory.link == -1) {
                        console.log("setting link for " + creep.name);
                        var links = creep.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK && i.id != Memory[roomName].links.upgradeLink })
                        links.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
                        if (links.length > 0) {
                            creep.memory.link = links[0].id;

                        } else {
                            fill.fillContainers(creep);
                        }
                    }
                    if (creep.memory.link != Memory[roomName].links.storageLink) {
                        fill.fillLinks(creep)
                    } else {
                        fill.fillContainers(creep);
                    }



                } else {
                    // console.log("room " +room)

                    fill.fillContainers(creep);
                }


                //console.log(links);
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
                if (!creep.memory.sources) {
                    creep.memory.sources = {};
                    var sources = creep.room.find(FIND_SOURCES);
                    for (let i = 0; i < sources.length; i++) {

                        console.log("sources in " + roomName + " " + creep.memory.sources[i])

                        creep.memory.sources[i] = sources[i].id;
                    }
                }
                //var sources = creep.room.find(FIND_SOURCES);

                //console.log("Sources in room" + sources)
                // team 0
                if (creep.memory.team == 0) {
                    var source = Game.getObjectById(creep.memory.sources[0]);
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, { visualizePathStyle: { stroke: '#FFC0CB' } });
                    }
                    //team 1
                } else if (creep.memory.team == 1) {
                    if (!creep.memory.sources[1]) {
                        if (!Memory[roomName].constructionSites.all[0]) {
                            creep.memory.role = "upgrader"
                        } else {
                            creep.memory.role = "builder"
                        }
                    } else {
                        var source = Game.getObjectById(creep.memory.sources[1]);
                        // console.log(creep.name + source)
                        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                            //console.log(
                            creep.moveTo(source, { visualizePathStyle: { stroke: '#FFFFFF' } })
                            // )
                        }
                    }

                }
            }
        }
    }

};

module.exports = roleSourceFarmer;
