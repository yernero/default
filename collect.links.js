var collectLinks = {
    /** @param {Creep} creep **/
    run: function (creep) {

      
 
            //find structures with energy
            var targets = creep.room.find(FIND_STRUCTURES,
                {
                    filter: (i) => (i.structureType == STRUCTURE_CONTAINER ||
                        i.structureType == STRUCTURE_STORAGE)
                        && i.store[RESOURCE_ENERGY] > 50
                });
            //console.log("containers with more than 50 energy" +targets);

            //sort by largest to smallest
            targets = targets.sort((a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY));
            //console.log("Sorted targs" + targets);
            //console.log(targets[0])

            //console.log(creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' }}))

            //if more than 1 structure with energy, go to first one
            if (targets.length > 1) {
                if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                //if just 1 structure with energy, go to first one
            } else if (targets.length == 1) {
                if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                //if no structure with energy, go to a source
            } else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }

    }
};

module.exports = collectLinks;