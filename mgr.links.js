
var linksMgr = {
    findLinksInRoom: function (room) {
        var roomName = room.name
        //var links = room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK })
        //Memory[roomName].links.all = links;
        var links = []
        for (var i in Memory[roomName].links.all) {
            var link = Game.getObjectById(Memory[roomName].links.all[i].id)
            //console.log(link)
            links.push(link)
        }
        return links
    }
    ,
    keepLinksFull(room) {
        var roomName = room.name;
        var upgradeLink = Game.getObjectById(Memory[roomName].links.upgradeLink);
        var storageLink = Game.getObjectById(Memory[roomName].links.storageLink);
        var links = this.findLinksInRoom(room);
        //sort less first
        //links.sort((a, b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));

        //sort most first
        links.sort((a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY));

        //making sure upgradeLink has energy
        if (upgradeLink && upgradeLink.store.getUsedCapacity(RESOURCE_ENERGY) < upgradeLink.store.getCapacity(RESOURCE_ENERGY)) {
            //console.log("upgrade needs energy")
            //sort links by size large to small
            //console.log("link[0] " + links[0].store[RESOURCE_ENERGY]);
            //check if link[0] can send energy
            if (links[0].id != upgradeLink.id && links[0].cooldown == 0 && links[0].store[RESOURCE_ENERGY] > 200) {
                var status = links[0].transferEnergy(upgradeLink)
                switch (status) {
                    case 0:
                        //do nothing
                        break;
                    case -6:
                        console.log(links[0] + " is empty")
                        break;
                    case -7:
                        console.log("Upgrade Link invalid: " + upgradeLink + " in " + roomName + " for " + links[0].id);
                        break;
                    default:
                        //idk what happened
                        console.log("Tried to fill upgradeLink " + status);
                }
            }
        }
        //empty the other source link
        //if storageLink can handle energy
        if (storageLink && storageLink.store.getUsedCapacity(RESOURCE_ENERGY) < storageLink.store.getCapacity(RESOURCE_ENERGY)) {
            //console.log("storage needs energy")

            if (links[0].cooldown == 0 && upgradeLink && links[0].id != upgradeLink.id && links[0].id != storageLink.id) {
                switch (links[0].transferEnergy(storageLink)) {
                    case 0:
                        //do nothing
                        break;
                    case -6:
                        console.log(links[0] + " is empty")
                        break;
                    case -7:
                        console.log("Storage Link invalid: " + storageLink + " in " + roomName + " for " + links[0].id);
                        break;
                    default:
                        //idk what happened
                        console.log(links[0].transferEnergy(storageLink));
                }
            }
        }

    }



};

module.exports = linksMgr;