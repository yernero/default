var collectDead = {
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

            //check if creep can pickup energy
            if (creep.pickup(droppedres[0]) == ERR_NOT_IN_RANGE) {
                //check if accessible, try last dropped energy in list instead
                if (creep.moveTo(droppedres[0],
                    { visualizePathStyle: { stroke: '#ffffff' } }) == ERR_NO_PATH
                    && droppedres.length > 1) {

                    creep.moveTo(droppedres[droppedres.length - 1],
                        { visualizePathStyle: { stroke: '#ffffff' } })
                }
            }

            //No droppres energy
        }

    }

};
module.exports = collectDead
