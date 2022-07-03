var fillContainers = {
    /** @param {Creep} creep **/
    run: function (creep) {

        var targets = creep.room.find(FIND_STRUCTURES).filter(
            structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                structure.structureType) !== -1).filter(
                    structure => structure.store.getFreeCapacity([RESOURCE_ENERGY]) > 0);

        if (targets.length == 0) {
            // console.log("Out of storage")
            roleBuilder.run(creep);
<<<<<<< Updated upstream
        }
        if (creep.memory.team === 0) {
=======
        } else {
>>>>>>> Stashed changes
            //find containers and storage with storage open
            var targets = creep.room.find(FIND_STRUCTURES).filter(
                structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                    structure.structureType) !== -1).filter(
                        structure => structure.store.energy < structure.store.getCapacity()).filter(
                            structure => creep.pos.getRangeTo(structure) < 10
                        );
<<<<<<< Updated upstream
            //current container is chosen manually from structures less than 2 spots away, need to find closest container. 
            //(targets);
=======
>>>>>>> Stashed changes
            if (targets.length == 0) {
                // console.log(" team 1 out")
                targets = creep.room.find(FIND_STRUCTURES).filter(
                    structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                        structure.structureType) !== -1).filter(
                            structure => structure.store.energy < structure.store.getCapacity());
            }
<<<<<<< Updated upstream
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
=======
            //current container is chosen manually from structures less than 2 spots away, need to find closest container. 
            //console.log(targets);
>>>>>>> Stashed changes
            if (creep.transfer(targets[targets.length - 1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[targets.length - 1], { visualizePathStyle: { stroke: '#FFFFFF' } });
            }

<<<<<<< Updated upstream
        }


=======
            if (creep.memory.team === 0) {

            } else if (creep.memory.team === 1) {
            
            }
        }



>>>>>>> Stashed changes
    }
};

module.exports = fillContainers;