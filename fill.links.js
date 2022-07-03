var fillContainers = require("fill.containers");

var fillLinks = {
    /** @param {Creep} creep **/
    run: function (creep) {
<<<<<<< Updated upstream

        if (creep.memory.link == null) {
            //find all links
            var links = creep.room.find(FIND_STRUCTURES, {
                filter:
                    (i) => (i.structureType == STRUCTURE_LINK)
                        && i.store.getFreeCapacity(RESOURCE_ENERGY) > 99 && i.id != Memory.links.upgradeLink
            })
            //show links
            //console.log("Links" + links);
            //sort by closest
            links.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
            //remove energy
            //console.log(creep.withdraw(links[0],RESOURCE_ENERGY))
            if (creep.memory.team == 0) {
                creep.memory.link = links[0].id;
            } else {
                if(links.length > 1){
                    creep.memory.link = links[1].id;
                }
            }
            
        }
        // console.log(Game.getObjectById(creep.memory.link));
        switch (creep.transfer(Game.getObjectById(creep.memory.link), RESOURCE_ENERGY)) {
            case 0:
                //successful
                break;
            case -9:
                //not in range
                creep.moveTo(Game.getObjectById(creep.memory.link));
                break;
            case -8:
                //full link
                fillContainers.run(creep)
                break;
            default:
                console.log(creep.transfer(Game.getObjectById(creep.memory.link), RESOURCE_ENERGY));
                console.log("Unknown Error in Fill Links");
        }
        if (creep.transfer(Game.getObjectById(creep.memory.link), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.link));
        }
        //console.log(links);
=======
        //creep must already have a link defined in memory
        if (creep.memory.link == null) {
            console.log(creep.name + " needs a link");
        } else {
            var link = Game.getObjectById(creep.memory.link);
            // console.log(Game.getObjectById(creep.memory.link));
            switch (creep.transfer(link, RESOURCE_ENERGY)) {
                case 0:
                    //successful
                    break;
                case -9:
                    //not in range
                    creep.moveTo(link);
                    break;
                case -7:
                    console.log("Invalid Link reference " + Game.getObjectById(creep.memory.link));
                case -8:
                    //full link
                    fillContainers.run(creep)
                    break;
                default:
                    console.log(creep.transfer(link, RESOURCE_ENERGY));
                    console.log("Unknown Error in Fill Links");
            }
            //console.log(links);

        }
>>>>>>> Stashed changes

    }
};

module.exports = fillLinks;