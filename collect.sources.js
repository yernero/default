var collectSources = {
    /** @param {Creep} creep **/
    run: function (creep) {
        //find sources
        var sources = creep.room.find(FIND_SOURCES);
        //sort by closest
        sources.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
        //attempt to harvest from first source
        if (creep.harvest(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
};

module.exports = collectSources;