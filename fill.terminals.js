var fillTerminals = {
    /** @param {Creep} creep **/
    run: function (creep) {

<<<<<<< Updated upstream
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

=======
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
             case -9: //not in range
                 creep.moveTo(terminals[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
                 break;
             case -10:
                 console.log("Fix args");
                 break;
             default:
                 console.log(creep.transfer(terminals[0], creep.memory.mineral ));
                 console.log("unknown Error in miner transfer, investigate")
                 break;
         }
>>>>>>> Stashed changes

    }
};

module.exports = fillTerminals;