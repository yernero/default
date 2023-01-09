var roleUpgrader = require("role.upgrader");
var roleFiller = require("role.filler");
var roleBuilder = require("role.builder");
var fillContainers = require("fill.containers");
var fillLinks = require("fill.links");
var roleSourceFarmer = {

    /** @param {Creep} creep **/
    run: function (creep) {
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
                
                   //creep.memory.link = links[0].id;
                if(!creep.memory.link){
                   console.log("setting link for " + creep.name);
                   var links = creep.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK && i.id != Memory.links.upgradeLink })
                   links.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
                
                     creep.memory.link = links[0].id;

                }
                if(creep.memory.link == Memory.links.storageLink){
                    fillContainers.run(creep);

                }else{
                    fillLinks.run(creep);

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
                if(!creep.memory.sources){
                    creep.memory.sources ={};
                    var sources = creep.room.find(FIND_SOURCES);
                    for(let i = 0; i< sources.length;i++){
                        console.log(creep.memory.sources[i])

                        creep.memory.sources[i] = sources[i].id;
                    }
                }
                var sources = creep.room.find(FIND_SOURCES);
            
                //console.log("Sources in room" + sources)
                // team 0
                if (creep.memory.team == 0 || sources.length < 2) {
                    var source = Game.getObjectById(creep.memory.sources[0]);
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, { visualizePathStyle: { stroke: '#FFC0CB' } });
                    }
                    //team 1
                } else if (creep.memory.team == 1 && sources.length > 1) {
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

};

module.exports = roleSourceFarmer;
