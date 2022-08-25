var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require("role.repairer");
var roleSettler = require("role.settler");
var roleImporter = require("role.importer");
var towerGuard = require("role.towerGuard");
var roleFiller = require("role.filler");
var roleScavenger = require("role.scavenger")
var roleDefender = require("role.scavenger");
var roleSourceFarmer = require("role.sourceFarmer");
var roleLinkUpgrader = require("role.linkUpgrader");
var roleLinkFiller = require("role.linkFiller");
var roleMiner = require("role.miner");
var collectDead = require("role.miner");

var mgr = {
    createMem: function (room) {
        var myRoom = Game.rooms[room.name];
        console.log(room)
        console.log(Game.spawns[0])

        //create needed memory for room
        if (true || Memory[room] == null) {
            Memory[room] = {};
            Memory[room].creeps = {};
            Memory[room].links = {};
            Memory[room].links.upgradeLink = -1;
            Memory[room].links.storageLink = -1;
            Memory[room].repairs = {};
            Memory[room].storage = {};
            Memory[room].constructionSites = {};
            Memory[room].terminal = {};
            Memory[room].spawns = {};
            for (const i in Game.spawns) {
                console.log(Game.spawns[i].room)
                if (Game.spawns[i].room.name == room) {
                    if (Memory[room].spawns[0] == null) {
                        Memory[room].spawns[0] = Game.spawns[i];

                    } else {
                        Memory[room].spawns[Object.keys(Memory[myRoom.name].spawns).length] = Game.spawns[i];
                    }
                }
            }
            Memory[room].sources = myRoom.find(FIND_SOURCES);
            console.log("Created Memory for Room " + room)
        }
        //declare memory variables
        if (Memory[room].links == null) {
            Memory[room].links = {};
            Memory[room].links.upgradeLink = -1;
            Memory[room].links.storageLink = -1;
            console.log("Created Memory for Links in " + room)
        }
        if (Memory[room].creeps == null) {
            Memory[room].creeps = {};
            console.log("Created Memory for creeps in " + room)
        }

        if (Memory[room].repairs == null) {
            Memory[room].repairs = {}
            console.log("Created Memory for repairs in " + room)
        }
        if (Memory[room].storage == null) {
            Memory[room].storage = {}
            console.log("Created Memory for storage in " + room)
        }
        if (Memory[room].constructionSites == null) {
            Memory[room].constructionSites = {}
            console.log("Created Memory for constructionSites in " + room)

        }
        // console.log(Memory[room].constructionSites.all)
        if (Memory[room].constructionSites.all = null) {
            console.log("no Construction sites")
        }
        if (Memory[room].terminal == null) {
            Memory[room].terminal = {}
            console.log("Created Memory for terminal in " + room)

        }
        //console.log("Num of spawns " + Memory[room].spawns)
        //Memory[room].spawns = null
        if (Memory[room].spawns == null) {
            Memory[room].spawns = {};
            var spawns = myRoom.find(FIND_STRUCTURES).filter(structure => [STRUCTURE_SPAWN].indexOf(structure.structureType) !== -1);
            Memory[room].spawns = spawns;
            console.log("Created Memory for spawns in " + room)

        }
        if (Memory[room].sources == null) {
            console.log(myRoom)
            Memory[room].sources = myRoom.find(FIND_SOURCES);
            console.log("Created Memory for sources in " + room)

        }

    },
    updateCreepMem: function (room) {

        //clear memory
        //Memory[room] = {};
        Memory[room].creeps = {};
        Memory[room].creeps["Total"] = 0;

        for (var creepName in Game.creeps) {
            var creep = Game.creeps[creepName]
            //console.log(Game.creeps[creep].room);
            //console.log( creep.name +" in room " + creep.room.name)
            //console.log(room);
            //if a creep is in myRoom
            if (room === "outside" && creep.room.name != room) {
                Memory[room].creeps["Total"]++
                if (Memory[room].creeps[creep.memory.role + "_" + creep.memory.team] == null) {
                    // Memory[room].creeps[creep.memory.role] = 1;
                    Memory[room].creeps[creep.memory.role + "_" + creep.memory.team] = 1;
                } else {
                    //Memory[room].creeps[creep.memory.role]++
                    Memory[room].creeps[creep.memory.role + "_" + creep.memory.team]++

                }
            } else if (creep.room.name == room) {
                Memory[room].creeps["Total"]++
                //console.log(creep + " is in " + myRoom.name);
                if (Memory[room].creeps[creep.memory.role + "_" + creep.memory.team] == null) {
                    // Memory[room].creeps[creep.memory.role] = 1;
                    Memory[room].creeps[creep.memory.role + "_" + creep.memory.team] = 1;
                } else {
                    //Memory[room].creeps[creep.memory.role]++
                    Memory[room].creeps[creep.memory.role + "_" + creep.memory.team]++

                }
            }
        }
    }
    , sellRes: function (myRoom, res) {
        //console.log("cooldown for selling: " + myRoom.terminal.cooldown)
        //console.log(res)
        //console.log(myRoom.terminal.store.getUsedCapacity(res) )
        //console.log(res + " " +myRoom.terminal.store.getUsedCapacity(res))
        //console.log(myRoom.terminal.cooldown)
        if (myRoom.terminal && myRoom.terminal.store.getUsedCapacity(res) > 0) {
            console.log(res + " exists")
            buyUtrium = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: res });
            if (buyUtrium.length > 0) {
                buyUtrium.sort((orderA, orderB) => orderB.price - orderA.price);
                orderchoice = 0
                console.log(buyUtrium[0].remainingAmount + " " + myRoom.terminal.store.getUsedCapacity[res])
                while (buyUtrium[0].remainingAmount < myRoom.terminal.store.getUsedCapacity[res]) {
                    console.log("looking for bigger order")
                }
                sellAmount = buyUtrium[0].remainingAmount;
                if (buyUtrium[0].remainingAmount > myRoom.terminal.store[res]) {
                    sellAmount = myRoom.terminal.store[res];
                }
                console.log("Sold " + sellAmount + " Utrium at " + buyUtrium[0].price + " Total: " + (sellAmount * buyUtrium[0].price));
                console.log(Game.market.deal(buyUtrium[0].id, sellAmount, myRoom.name));

                Memory.test = buyUtrium[0]; // fast
                return true;
            } else {
                console.log("No orders for " + res)
            }

        }
    }
    , clearMemory: function () {
        for (var name in Memory.creeps) {
            //clear dead creeps from memory
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        //delete Memory.constructionSites;
    }
    ,
    runRoles: function (myRoom) {
        countCreeps = 0;
        //run each role
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (!creep.spawning) {


                //room creeps
                if (creep.room == myRoom) {
                    countCreeps++;
                    switch (creep.memory.role) {
                        case "settler":
                            roleSettler.run(creep);
                            break;
                        case "importer":
                            roleImporter.run(creep);
                            break;
                        case "miner":
                            //console.log(creep.room)
                            //if(creep.room)
                            roleMiner.run(creep);
                            break;
                        case "harvester":
                            roleHarvester.run(creep);
                            break;
                        case "builder":
                            roleBuilder.run(creep);
                            break;

                        case "repairer":
                            //creep.memory.dest = false;
                            roleRepairer.run(creep);
                            break;
                        case "filler":
                            roleFiller.run(creep);
                            break;
                        case "scavenger":
                            roleDefender.run(creep)
                            break;
                        case "towerGuard":
                            towerGuard.run(creep)
                            break;
                        case "sourceFarmer":
                            roleSourceFarmer.run(creep);
                            break;
                        case "linkFiller":
                            roleLinkFiller.run(creep);
                            break;
                        case "upgrader":
                            var links = creep.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK })
                            if (links.length < 2) {
                                //if less than 2 links in a room, become a regular upgrader
                                roleUpgrader.run(creep);
                                break;
                            } else {
                                if (creep.memory.link == null) {
                                    creep.memory.link = Memory.links.upgradeLink;
                                }
                            }
                        case "linkUpgrader":
                            //console.log(creep.room.controller.level)
                            //room max level
                            if (creep.room.controller.level == 8) {
                                console.log("Ticks until upgraders are needed: " + creep.room.controller.ticksToDowngrade)
                                //about to downgrade
                                if (creep.room.controller.ticksToDowngrade < 100) {
                                    roleLinkUpgrader.run(creep);
                                    break;
                                } else {
                                    console.log("What to do?");

                                }
                            } else {
                                roleLinkUpgrader.run(creep);
                                break;
                            }

                        case "collector":
                            collectDead.run(creep);
                            break;

                        default:
                            creep.memory.role = "sourceFarmer";
                            creep.memory.team = 0;
                            roleSourceFarmer.run(creep);
                            break;
                    }
                }
                switch (creep.memory.role) {
                    case "settler":
                        roleSettler.run(creep);
                        break;
                    case "importer":
                        roleImporter.run(creep);
                        break;
                    default:
                        break;
                }

            }





        }
        return countCreeps
    }
    ,
    findStorage: function (myRoom) {
        let room = myRoom.name;

        var targets = myRoom.find(FIND_STRUCTURES).filter(
            structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                structure.structureType) !== -1);
        targets.sort((a, b) => a.store.getCapacity() < b.store.getCapacity());
        console.log(targets)
        for (let i = 0; i < targets.length; i++) {
            Memory[room].storage[i] = targets[i];
        }

    }
    ,
    spawnCreep: function (role, team, myRoom, spawnNum) {
        //create a towerguard
        let newName = role + Game.time;
        console.log(myRoom.name);
        let spawn = Game.getObjectById(Memory[myRoom.name].spawns[spawnNum].id)
        let body = [WORK, CARRY, MOVE];
        if (role === "towerGuard") {
            body = [WORK, CARRY, MOVE, TOUGH, TOUGH, ATTACK];
        } else if (role === "sourceFarmer") {
            body = [WORK, WORK, CARRY, MOVE];
        } else if (role === "linkFiller" && team === 2) {
            body = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE];
            team = 0
        } else if (role === "linkFiller" && team === 1) {
            body = [WORK, CARRY, CARRY, MOVE];
        } else if (role === "linkFiller" && team === 0) {
            body = [WORK, CARRY, CARRY, MOVE];
        } else if (role === "filler" && team === 0) {
            body = [WORK, CARRY, MOVE];
        } else if (role === "filler" && team === 1) {
            body = [CARRY, CARRY, CARRY, MOVE, MOVE]
        } else if (role === "harvester" && team === 1) {
            body = [WORK, WORK, WORK, CARRY, MOVE];
        } else if (role === "harvester" && team === 0) {
            body = [WORK, WORK, WORK, CARRY, MOVE];
        } else if (role === "upgrader" && team === 0) {
            body = [WORK, CARRY, CARRY, MOVE];
        } else if (role === "miner" && team === 0) {
            body = [WORK, WORK, WORK, CARRY, CARRY, MOVE];
        } else if (role === "builder" && team === 1) {
            body = [WORK, CARRY, WORK, MOVE];
        } else if (role === "builder" && team === 0) {
            body = [WORK, CARRY, CARRY, MOVE];
        } else if (role === "repairer" && team === 1) {
            body = [WORK, WORK, CARRY, CARRY, MOVE];
        } else if (role === "repairer" && team === 0) {
            body = [WORK, CARRY, CARRY, MOVE];
        } else if (role === "settler") {
            body = [MOVE, MOVE, MOVE, CLAIM, CARRY, WORK];
        } else if (role === "importer") {
            body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        }
        switch (spawn.spawnCreep(body, newName, { memory: { role: role, team: team } })) {
            case 0:
                console.log('Spawning new ' + role + " " + newName);
                break;
            case -4:
                console.log("Spawning...")
                break;
            case -6:
                //not enough energy
                break;
            default:
                console.log("spawning error " + spawn.spawnCreep(body, newName, { memory: { role: role, team: team } }))
        };

    }
    ,
    getNumCreeps: function (room, role) {
        if (!room) {
            if (Memory.outside.creeps[role]) {
                //console.log("outside "+ role+" creeps " +Memory.outside.creeps[role])
                return Memory.outside.creeps[role];

            }
        } else if (Memory[room.name].creeps[role]) {
            //console.log(room.name)

            return Memory[room.name].creeps[role];
        }
        return 0;
    }


};


module.exports = mgr;

