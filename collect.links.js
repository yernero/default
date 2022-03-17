var collectLinks = {
    /** @param {Creep} creep **/
    run: function (creep) {
    //console.log(creep.memory.role);
      
 	//find all links
     var links = creep.room.find(FIND_STRUCTURES,{filter: (i) => i.structureType == STRUCTURE_LINK})
     //console.log(links);
     
     //sort by closest
     links.sort((a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b) );
     var upgradeLink = links[0];
     //Memory.upgradeLink = upgradeLink.id;
     //links[0].transferEnergy(upgradeLink);

     //remove energy
     //console.log(creep.withdraw(links[0],RESOURCE_ENERGY))
     switch(creep.withdraw(links[0],RESOURCE_ENERGY)){
        case 0:
            //success
            break;
        case -9:
            creep.moveTo(links[0])
            break;
        case -6:
            var upgradeLink = Game.getObjectById(Memory.upgradeLink);
            //remove upgradeLink
            links.splice(0,1);
            //sort by most energy stored
            links.sort((a,b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY))
            //transfer from link with energy to link without
            links[0].transferEnergy(upgradeLink);
            //console.log(links);
            break;
        default:
            console.log(creep.withdraw(links[0],RESOURCE_ENERGY));

     }

    }
};

module.exports = collectLinks;