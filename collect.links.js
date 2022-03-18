var collectLinks = {
    /** @param {Creep} creep **/
    run: function (creep) {
    //console.log(creep.memory.role);
      
 	//find all links
     var links = creep.room.find(FIND_STRUCTURES,{filter: (i) => i.structureType == STRUCTURE_LINK})
     //console.log(links);
     
     //sort by closest
     links.sort((a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b) );
     var upgradeLink =Game.getObjectById(Memory.links.upgradeLink);
     //Memory.links.upgradeLink = upgradeLink.id;
     //links[0].transferEnergy(upgradeLink);

     //remove energy
     //console.log(creep.withdraw(links[0],RESOURCE_ENERGY))
     switch(creep.withdraw(upgradeLink,RESOURCE_ENERGY)){
        case 0:
            //success
            break;
        case -9:
            creep.moveTo(upgradeLink)
            break;
        case -6:
            //not enough res in link
            
            //remove upgradeLink
            links.splice(0,1);
            //sort by most energy stored
            links.sort((a,b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY))
            //transfer from link with energy to link without
            links[0].transferEnergy(upgradeLink);
            //console.log(links);
            break;
        default:
            console.log(creep.withdraw(upgradeLink,RESOURCE_ENERGY));

     }

    }
};

module.exports = collectLinks;