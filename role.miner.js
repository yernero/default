var collectContainers = require("collect.containers");
var roleMiner = {
    /**@param {creep} creep **/
    run:function (creep){
        //mining minerals in rooms
        if(creep.memory.mining){
            //has free space
            if(creep.store.getFreeCapacity() > 0){
                //console.log(creep.room.find(FIND_MINERALS))
                //find minerals
                var minerals = creep.room.find(FIND_MINERALS);
                creep.memory.mineral = minerals[0].mineralType;
                //console.log(creep.memory.mineral);
                switch (creep.harvest(minerals[0])) {
                    case 0: 
                        //successful, do nothing
                        break;
                    case -6:
                        creep.memory.fillTerm = true;
                    case -9: //not in range
                        creep.moveTo(minerals[0]);
                        //move energy and minerals to Terminal

                        //get energy
                        collectContainers.run(creep);
                        //get minerals
                        break;
                    case -11:
                        //creep is tired, ignore
                        break;
                    default:
                        console.log(creep.harvest(minerals[0]))
                        console.log("unknown Error in miner harvest, investigate")
                        break;
                }

            }else{//no free space
                //store minerals
                creep.memory.mining = false;
                creep.say("Full");
            }
        }else{ //Storing minerals in terminal
            creep.memory.mining = false;
            //should not hold energy
            creep.drop(RESOURCE_ENERGY);
            //has materials
            if(creep.store.getUsedCapacity() >0){
                //Find Terminals
                var terminals = creep.room.find(FIND_STRUCTURES,{filter: (i) => (i.structureType == STRUCTURE_TERMINAL)});
                //console.log(terminals)
                /*
                loop through all constants
                    for (const resourceType in creep.store) {

                        if (creep.transfer(target, resourceType) == OK) break
                    }   
                */
                //transfer mineral to link
                switch(creep.transfer(terminals[0], creep.memory.mineral )){
                    case 0: //successful
                        break;
                    case -9: //not in range
                        creep.moveTo(terminals[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
                        break;
                    case -10:
                        console.log("Fix args");
                        break;
                    default:
                        console.log("unknown Error in miner transfer, investigate")
                        break;
                }
            }else{//out of materials
                 //mine again
                 creep.memory.mining = true;
                 creep.say("Mine");   
            }

        }
    }
};

module.exports = roleMiner;