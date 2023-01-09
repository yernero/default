var fillTerminals = {
    /** @param {Creep} creep **/
    run: function (creep) {
        //console.log(creep.memory.role)
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
             case -6:
                 //no mineral
                 creep.transfer(terminals[0], RESOURCE_ENERGY );
                 break;
            case -8:
                
                console.log(terminals[0].id + " is full of energy");
                break;
             case -9: //not in range
                 creep.moveTo(terminals[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
                 break;
             case -10:
                 creep.memory.mineral = RESOURCE_ENERGY;
                 console.log("Fix resource in fill.terminals");
                 console.log(creep.memory.role)
                 break;
             default:
                 console.log(creep.transfer(terminals[0], creep.memory.mineral ));
                 console.log("unknown Error in miner transfer, investigate")
                 break;
         }

    }
};

module.exports = fillTerminals;