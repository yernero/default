var mgr = {
    createMem: function (Room) {
        //console.log("test")
        //declare memory variables
        if (Memory.links == null) {
            Memory.links = {};
            Memory.links.upgradeLink = "61ea04390bd2bf1717dc4e56";

        }
        if (Memory.repairs == null) {
            Memory.repairs = {};
        }
        if (Memory.storage == null) {
            Memory.storage = {};
        }
        if (Memory.constructionSites == null) {
            Memory.constructionSites = {};
        }
        if (Memory.terminal == null) {
            Memory.terminal = myRoom.terminal;
        }
        if (Memory.rooms == null || Memory.rooms.myRooms == null) {
            Memory.rooms = {};
            Memory.rooms.myRooms = {};
        }

        if (Memory.sources == null) {
            Memory.sources = {};
        }

        if (Memory.sources == null) {
            Memory.sources = {};
            var sources = myRoom.find(FIND_SOURCES);
            for (let i = 0; i < sources.length; i++) {
                Memory.sources.i = sources[i].id;
            }

        }
    }
    , clearMemory: function () {
        //Consider using this method instead of resetting memory every mem update
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
        //run each role
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (!creep.spawning) {


                //room creeps
                if (creep.room == myRoom) {
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

