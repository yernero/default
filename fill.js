var marketMgr = require("mgr.market");
var roleUpgrader = require("role.upgrader");
var roleRepairer = require("role.repairer");
var fill = {
    withdrawAndDropTerm: function (creep) {
        let resourceType = creep.memory.mineral;
        let amount = creep.store.getFreeCapacity();
        var terminal = creep.room.terminal;
        //console.log("Terminal " + terminal)
        while (terminal.store.getFreeCapacity() < 5000 && terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 5000) {
            if (terminal.store.getUsedCapacity(resourceType) >= amount) {
                switch (creep.withdraw(terminal, resourceType, amount)) {
                    case 0:
                    case -8:
                        console.log(amount + ' ' + resourceType + ' withdrawn from terminal.');
                        var dropResult = creep.drop(resourceType, creep.store.getUsedCapacity());
                        switch (dropResult) {
                            case 0:
                                console.log(amount + ' ' + resourceType + ' dropped at terminal.');
                                break;
                            case -1:
                                break;
                            case -4:
                                break;
                            case -6:
                                console.log("extra drop call");
                                break;
                            case -10:
                                break;
                            default:

                                break;
                        }

                        break;
                    case -1:
                        console.log('Error withdrawing ' + resourceType + ': ' + result);
                        break;
                    case -2:
                        console.log('Error withdrawing ' + resourceType + ': ' + result);
                        break;
                    case -3:
                        console.log('Error withdrawing ' + resourceType + ': ' + result);

                        break;
                    case -4:
                        console.log('Error withdrawing ' + resourceType + ': ' + result);

                        break;
                    case -5:
                        console.log('Error withdrawing ' + resourceType + ': ' + result);

                        break;
                    case -6:
                        console.log('Error withdrawing ' + resourceType + ': ' + result);

                        break;
                    case -7:
                        console.log('Error withdrawing ' + resourceType + ': ' + result);

                        break;

                    case -9:
                        creep.moveTo(terminal, { visualizePathStyle: { stroke: '#FFC0CB' } });
                        break;
                    case -10:
                        console.log('Error withdrawing ' + resourceType + ': ' + result);

                        break;
                    default:
                        console.log("failed to withdraw from terminal in " + creep.room.name);

                }

            } else {
                console.log('Not enough ' + resourceType + ' in terminal.');
                break;
            }
        }
    },
    fillTerminals: function (creep) {
        //Set Terminal
        var terminal = creep.room.terminal;
        // transfer all resources
        for(const resourceType in creep.store) {
                switch (creep.transfer(terminal, resourceType)) {
                    case 0: //successful
                        //console.log("successful")
                        break;
                    case -6:
                        //no mineral
                        console.log("logic error for " + creep.memory.role + " in transfering to terminal")
                        break;
                    case -7:
                        //console.log("No Terminal");
                        this.fillAnything(creep);
                        //creep.memory.role = "filler"
                        break;
                    case -8:
    
                        console.log("Terminal " + terminal.id + " is full of energy");
                        marketMgr.manageRoomRes(creep.room);
                        break;
                    case -9: //not in range
                        creep.moveTo(terminal, { visualizePathStyle: { stroke: '#FFC0CB' } });
                        break;
                    case -10:
                        creep.memory.mineral = RESOURCE_ENERGY;
                        console.log("Fix resource in fill.fillterminals()");
                        console.log(creep.memory.role + "-10")
                        break;
                    default:
                        console.log(creep.transfer(terminal, creep.memory.mineral));
                        console.log("unknown Error in terminal transfer, investigate")
                        break;
                }         
        }



    },
    fillAnything: function (creep) {
        var room = creep.room;
        var roomName = room.name;

        /*var targets = creep.room.find(FIND_STRUCTURES).filter(
            structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                structure.structureType) !== -1).filter(
                    structure => structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);*/
        var targets = [];
        for (var i in Memory[roomName].storage.containers) {
            targets.push(Game.getObjectById(Memory[roomName].storage.containers[i].id));
        }
        for (var i in Memory[roomName].storage.storages) {
            targets.push(Game.getObjectById(Memory[roomName].storage.storages[i].id));

        }
        //console.log(roomName + " targets " + targets);

        if (targets.length == 0) {
            console.log("Out of storage")
            console.log(creep.room + " " + targets)
            // console.log(" team 1 out")
            targets = creep.room.find(FIND_STRUCTURES).filter(
                structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                    structure.structureType) !== -1).filter(
                        structure => structure.store.energy < structure.store.getCapacity());

        } else {

            //console.log(creep.room + " " + targets)

            //current container is chosen manually from structures less than 2 spots away, need to find closest container. 
            //console.log(targets[0]);
            if (!creep.memory.mineral) {
                creep.memory.mineral = RESOURCE_ENERGY;
            }
            var status = creep.transfer(targets[0], creep.memory.mineral);
            switch (status) {
                case -9:
                    creep.moveTo(targets[targets.length - 1]);
                    break;
                case 0:
                    break;
                case -6:
                    //doesnt have res
                    break;
                case -7:
                    //when the room level is too low for the storage
                    console.log("Room level too low for storage")
                    break;
                case -8://full
                    console.log("Room Full");
                    break;
                default:
                    console.log(status + " Error filling container for " + creep.name)
            }

            if (creep.memory.team === 0) {

            } else if (creep.memory.team === 1) {

            }
        }



    },
    fillContainers: function (creep) {
        var room = creep.room;
        var roomName = room.name;

        /*var targets = creep.room.find(FIND_STRUCTURES).filter(
            structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                structure.structureType) !== -1).filter(
                    structure => structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);*/
        var targets = [];
        for (var i in Memory[roomName].storage.containers) {
            targets.push(Game.getObjectById(Memory[roomName].storage.containers[i].id));
        }
        for (var i in Memory[roomName].storage.storages) {
            targets.push(Game.getObjectById(Memory[roomName].storage.storages[i].id));

        }
        //console.log(roomName + " targets " + targets);

        if (targets.length == 0) {
            //console.log("Out of storage")
            //console.log(creep.room + " " + targets)
            if (!Memory[roomName].towers) {
                console.log("choose what to do instead of be a filler")
                //roles.filler(creep);
            } else {
                console.log("decide what to do instead of be a guard")
                //roleGuard.run(creep);
            }
        } else {
            //find containers and storage with storage open
            /*var targets = creep.room.find(FIND_STRUCTURES).filter(
                structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                    structure.structureType) !== -1).filter(
                        structure => structure.store.energy < structure.store.getCapacity()).filter(
                            structure => creep.pos.getRangeTo(structure) < 10
                        );*/
            //console.log(creep.room + " " + targets)
            if (targets.length == 0) {
                // console.log(" team 1 out")
                targets = creep.room.find(FIND_STRUCTURES).filter(
                    structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                        structure.structureType) !== -1).filter(
                            structure => structure.store.energy < structure.store.getCapacity());
            }
            //current container is chosen manually from structures less than 2 spots away, need to find closest container. 
            //console.log(targets[0]);
            var status = creep.transfer(targets[0], RESOURCE_ENERGY);
            switch (status) {
                case -9:
                    creep.moveTo(targets[targets.length - 1]);
                    break;
                case 0:
                    break;
                case -6:
                    //doesnt have res
                    break;
                case -7:
                    //when the room level is too low for the storage
                    roleUpgrader.run(creep);
                    break;
                case -8://full
                    roleRepairer.run(creep);
                    break;
                default:
                    console.log(status + " Error filling container for " + creep.name)
                    this.fillAnything(creep);

            }

            if (creep.memory.team === 0) {

            } else if (creep.memory.team === 1) {

            }
        }



    },
    fillLinks: function (creep) {
        var room = creep.room;
        var roomName = room.name;
        var upgradeLink = Game.getObjectById(Memory[roomName].links.upgradeLink);
        var storageLink = Game.getObjectById(Memory[roomName].links.storageLink);

        //creep must already have a link defined in memory
        if (creep.memory.link == null) {
            console.log(creep.name + " needs a link");
            //creep.memory.role = "builder"
        } else {
            var link = Game.getObjectById(creep.memory.link);
            // console.log(Game.getObjectById(creep.memory.link));
            var status = creep.transfer(link, RESOURCE_ENERGY)
            switch (status) {
                case 0:
                    //successful
                    break;
                case -6:
                    //creep does not have the materials to do this
                    break;
                case -9:
                    //not in range
                    creep.moveTo(link);
                    break;
                case -7:
                    console.log("Invalid Link reference " + creep.memory.link);
                case -8:
                    //full link
                    this.fillContainers(creep)
                    break;
                default:
                    //console.log(status);
                    console.log("Unknown Error in Fill Links: " + status);
            }
            //console.log(links);

        }

    }
};



module.exports = fill;