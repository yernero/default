var collectSources = require("collect.sources")
var collectContainers = {
    /** @param {Creep} creep **/
    run: function (creep) {

        //check for loose energy
        var droppedres = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: x => x.resourceType == RESOURCE_ENERGY
                && x.amount > 1000
        });
        //console.log("Dropped Energy: " + droppedres); //prints list
        //console.log("Dropped Energy: " + droppedres[0].pos); //prints location of first

        //check if any Dropped res worth collecting
        if (droppedres.length > 0) {
            //console.log("Dropped res[0] amount: " + droppedres[0].amount);
            droppedres.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));

            //check if creep can pickup energy
            if (creep.pickup(droppedres[0]) == ERR_NOT_IN_RANGE) {
                //check if accessible, try last dropped energy in list instead
                if (creep.moveTo(droppedres[0],
                    { visualizePathStyle: { stroke: '#ffffff' } }) == ERR_NO_PATH
                    && droppedres.length > 1) {

                    creep.moveTo(droppedres[1],
                        { visualizePathStyle: { stroke: '#ffffff' } })
                }
            }

            //No droppres energy
        } else {
            //find structures with energy
            var targets = creep.room.find(FIND_STRUCTURES,
                {
                    filter: (i) => (i.structureType == STRUCTURE_CONTAINER ||
                        i.structureType == STRUCTURE_STORAGE)
                        && i.store[RESOURCE_ENERGY] > 50
                });
            //console.log("containers with more than 50 energy" +targets);

            //sort by closest
            targets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
            //sort by largest to smallest
            //targets = targets.sort((a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY));
            //console.log("Sorted targs" + targets);
            //console.log(targets[0])

            //console.log(creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' }}))

            //if more than 1 structure with energy, go to first one
            if (targets.length > 1) {
                creep.memory.container = targets[0].id;

                if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                //if just 1 structure with energy, go to first one
            } else if (targets.length == 1) {
                creep.memory.container = targets[0].id;
                //console.log(targets[0].id)
                if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                //if no structure with energy, go to a source
            } else {
               collectSources.run(creep);
            }
        }



    }
};

module.exports = collectContainers;