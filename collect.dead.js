var fillTerminal = require("fill.links")
var collectDead = {
    run: function (creep) {
        if (creep.memory.collecting) {
            if (creep.carry.energy == 0) {
                creep.memory.collecting = false;
                creep.memory.dest = false;
                creep.say('store');
            }else{
                var droppedres = creep.room.find(FIND_DROPPED_RESOURCES, {
                    filter: x => x.resourceType != RESOURCE_ENERGY
                        
                });
                var tombstones = creep.room.find(FIND_TOMBSTONES);
                
                //get tombstone
                var test = Game.getObjectById("6236a33870df7bd29edc4fb5")    
                console.log(test)
            }

        } else {
            //making sure repairing exists
            creep.memory.collecting= false;
            //check if time to switch modes
            
            if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.collecting = true;
                creep.say('collect');
            } else {
            }
        }
    }

};
module.exports = roleRepairer