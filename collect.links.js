var collectLinks = {
    /** @param {Creep} creep **/
    run: function (creep) {
        //console.log(creep.memory.role);

        if (creep.memory.link == null) {
            console.log(creep.name + " needs a link");
        } else {
            //Memory.links.upgradeLink = upgradeLink.id;
            //links[0].transferEnergy(upgradeLink);
            var link = Game.getObjectById(creep.memory.link);
            //remove energy
            //console.log(creep.withdraw(links[0],RESOURCE_ENERGY))
            var status = creep.withdraw(link, RESOURCE_ENERGY);
            switch (status) {
                case 0:
                    //success
                    break;
                case -4:
                    //creep still spawning
                    break;
                case -9:
                    //out of range
                    creep.moveTo(link);
                    break;
                case -8:
                    //the creep is full already
                    break;
                case -6:
                    //not enough res in link
                    if (creep.memory.role == "linkUpgrader") {
                        //upgrader waits
                    } else {
                        //find all links not upgrade link
                        var links = creep.room.find(FIND_STRUCTURES, {
                            filter: (i) => i.structureType == STRUCTURE_LINK
                                && i.store.getUsedCapacity(RESOURCE_ENERGY) > 50
                                && i.id != Memory[creep.room.name].links.upgradeLink
                        })
                        //console.log("Links with energy " + links);
                        //sort by closest
                        //links.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
                        //sort by most energy stored
                        if (links.length > 0) {
                            links.sort((a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY))
                            //transfer from link with energy to link without

                            links[0].transferEnergy(link);
                            //console.log(links);
                        }
                    }

                    break;
                default:
                    // console.log(creep.withdraw(creep.memory.link, RESOURCE_ENERGY));
                    console.log(status + " issue creep " + creep.name + " drawing from link " + link.id);

            }
        }
    }
};

module.exports = collectLinks;