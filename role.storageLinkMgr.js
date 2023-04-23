var roleUpgrader = require("role.upgrader");
var linksMgr = require("mgr.links");
var collect = require("collect");
var fill = require("fill");

var storageLinkMgr = {

    run: function (creep) {
        var room = creep.room;
        var roomName = room.name;
        var upgradeLink = Game.getObjectById(Memory[roomName].links.upgradeLink);
        var storageLink = Game.getObjectById(Memory[roomName].links.storageLink);
        var linkToFill = Game.getObjectById(creep.memory.link);

        if (!linkToFill || Memory[roomName].links.storageLink == -1) {
            //runs when the first linkFiller has energy and is looking to fill a link
            links = linksMgr.findLinksInRoom(room);
            //sort by closest
            links.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
            //console.log(links);
            creep.memory.link = links[0].id;
            Memory[roomName].links.storageLink = creep.memory.link;
        }
        if (creep.memory.managing) {
            if (creep.carry.energy == 0) {
                creep.memory.managing = false;
            } else {
                //check if upgradeLink and storageLink has more than half energy
                if (upgradeLink && storageLink
                    && upgradeLink.store.getUsedCapacity(RESOURCE_ENERGY) > (upgradeLink.store.getCapacity(RESOURCE_ENERGY) / 2) + 100
                    && storageLink.store.getUsedCapacity(RESOURCE_ENERGY) > (storageLink.store.getCapacity(RESOURCE_ENERGY) / 2) + 100) {
                    fill.fillContainers(creep)

                } else {
                    fill.fillLinks(creep);

                }
            }

        } else {
            //start
            creep.memory.managing = false;
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.managing = true;

            } else {
                //check if upgradeLink and storageLink has more than half energy
                if (upgradeLink && storageLink
                    && upgradeLink.store.getUsedCapacity(RESOURCE_ENERGY) > ((upgradeLink.store.getCapacity(RESOURCE_ENERGY) / 2) + 100)
                    && storageLink.store.getUsedCapacity(RESOURCE_ENERGY) > ((storageLink.store.getCapacity(RESOURCE_ENERGY) / 2) + 100)) {
                    creep.memory.link = storageLink.id;
                    // console.log("Take from link")
                    collect.links(creep);

                } else {
                    //base condition
                    collect.containers(creep)
                    //since upgrade Link isnt full, take energy from storage out

                }
            }
        }
    }

};

module.exports = storageLinkMgr;