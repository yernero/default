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
var findMyRoom = require("find.myRoom");
var mgr = require("mgr");
var myRoom;
module.exports.loop = function () {

    mgr.createMem();
    for (var t in Game.creeps) {
        //console.log(t);
        //console.log(Memory.creeps[t])
    }
    //addArrayToMem();
    
    myRoom = findMyRoom.run();
    //console.log("room" +myRoom);
    Memory.test = {};
    Memory.test.room = myRoom.controller;
    //console.log(myRoom);
    //var myRoom = Game.rooms["W8S53"];
    //Game.getObjectById('5f29b8885eb8e32fb300fa06');
   
    clearMemory();
    //start code
    if(myRoom.energyAvailable <= 300){

    }else if(myRoom.energyAvailable > 300){

    }
    sellRes(myRoom, RESOURCE_UTRIUM);
    if (myRoom.terminal.store.getFreeCapacity() < 5000) {
        sellRes(myRoom, RESOURCE_ENERGY);
    }



    var countCreeps = runRoles();
    //console.log(Object.keys(Game.creeps).length)

    //Look for enemies
    var redTarget = myRoom.find(FIND_HOSTILE_CREEPS);
    if (redTarget.length > 0) {
        //use towers to attack enemies
        var towers = myRoom.find(FIND_STRUCTURES, {
            filter: o => o.structureType === STRUCTURE_TOWER
        }); +
            towers.forEach(function (tower) {
                Game.getObjectById(tower.id).attack(redTarget[0]);
            });
    }

    //find things to be repaired
    var targets = myRoom.find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax });
    //sorted least hits/hitsmax to most
    targets.sort((a, b) => a.hits / a.hitsMax - b.hits / b.hitsMax);
    //find just containers that need to be repaired
    var containers = targets.filter(structure => structure.structureType == STRUCTURE_CONTAINER);
    //console.log(targets);
    Memory.repairs.toBeRepaired = targets;
    Memory.repairs.toBeRepairedContainers = containers;

    //TODO
    //consider calculating this once and changing only when a new creep is made
    //Roles
    var fillers = _.filter(Game.creeps, (creep) => creep.memory.role == "filler");
    var linkFillers = _.filter(Game.creeps, (creep) => creep.memory.role == "linkFiller");
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => (creep.memory.role == 'upgrader' || creep.memory.role == 'linkUpgrader'));
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var settlers = _.filter(Game.creeps, (creep) => creep.memory.role == "settler");
    var importers = _.filter(Game.creeps, (creep) => creep.memory.role == "importer");
    var towerGuards = _.filter(Game.creeps, (creep) => creep.memory.role == "towerGuard");
    var sourceFarmers = _.filter(Game.creeps, (creep) => creep.memory.role == "sourceFarmer");
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == "miner");
    //Teams
    var Hteam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "harvester");
    var Bteam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "builder");
    var sfTeam0 = _.filter(Game.creeps, (creep) => creep.memory.team == 0 && creep.memory.role == "sourceFarmer")
    var sfTeam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "sourceFarmer")
    var RTeam0 = _.filter(Game.creeps, (creep) => creep.memory.team == 0 && creep.memory.role == "repairer")
    var RTeam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "repairer")
    var LFTeam0 = _.filter(Game.creeps, (creep) => creep.memory.team == 0 && creep.memory.role == "linkFiller");
    var LFTeam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "linkFiller");

    //console.log(Game.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity}}));
    var containers = myRoom.find(FIND_STRUCTURES, {
        filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE)
    });
    //console.log("Containers " + containers)
    // Memory.upgradeLink =  "61ea04390bd2bf1717dc4e56";
    //Moving energy around links
    var links = myRoom.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK && i.id != Memory.links.upgradeLink })
    //console.log(links);    
    Memory.links.storageLink = "61d4ce772820989709494112";

    var upgradeLink = Game.getObjectById(Memory.links.upgradeLink);
    //console.log(upgradeLink);
    //sort less first
    links.sort((b, a) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY));

    //making sure upgradeLink has energy
    if (upgradeLink.store.getFreeCapacity(RESOURCE_ENERGY) > 400) {
        //console.log("upgrade needs energy")
        //sort links by size large to small
        links.sort((a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY));
        //console.log(links);
        //check if link[0] can send energy
        if (links[0].cooldown == 0) {
            switch (links[0].transferEnergy(upgradeLink)) {
                case 0:
                    //do nothing
                    break;
                default:
                    //idk what happened
                    console.log(links[0].transferEnergy(upgradeLink));
            }
        }
    }
    //empty the other source link
    var storageLink = Game.getObjectById(Memory.links.storageLink);
    //if storageLink can handle energy
    if (storageLink.store.getFreeCapacity() > 100) {
        var links = myRoom.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK && i.id != Memory.links.upgradeLink && i.id != Memory.links.storageLink })
        links.sort((a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY));
        if (links[0].cooldown == 0) {
            switch (links[0].transferEnergy(storageLink)) {
                case 0:
                    //do nothing
                    break;
                default:
                    //idk what happened
                    console.log(links[0].transferEnergy(storageLink));
            }
        }
    }

    //check ability to create new screep
    //going well code
    if (myRoom.energyAvailable > 500) {
        if (linkFillers.length < 3) {

            var newName = 'Link Filler' + Game.time;
            var status = Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], newName, { memory: { role: "linkFiller", team: 0 } });
            //console.log(status)
            switch (status) {
                case 0:

                    break;
                default:
                    console.log("Error spawning super linkFiller")
            }
        }

    }

    //console.log(myRoom.energyAvailable);
    //starting code
    if (myRoom.energyAvailable > 200) {
        //see if room has towers
        var towers = myRoom.find(FIND_STRUCTURES,
            {
                filter: (structure) => structure.structureType == STRUCTURE_TOWER
                    && structure.energy < structure.energyCapacity
            });
        //console.log("Towers: " + towers.length);

        //if room has towers, and no tower guard

        if (towers.length > 0 && towerGuards < 1) {
            //create a towerguard
            var newName = 'Tower Guard ' + Game.time;
            if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, MOVE, TOUGH, TOUGH, ATTACK],
                newName,
                { memory: { role: 'towerGuard' } }) == 0) {
                console.log('Spawning new Guard: ' + newName);
            }
            //Fillers
        } else if (fillers.length < 3) {

            var newName = 'Filler' + Game.time;
            if (containers.length < 1) {
                if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, MOVE],
                    newName,
                    { memory: { role: 'filler', storing: false } }) == 0) {
                    console.log('Spawning new Filler: ' + newName);
                }
            } else {
                if (Game.spawns['HELL'].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE],
                    newName,
                    { memory: { role: 'filler', storing: false } }) == 0) {
                    console.log('Spawning new Filler: ' + newName);
                }
            }

        } else if (linkFillers.length < 2) {

            var newName = 'Link Filler' + Game.time;
            if (LFTeam0.length < 2) {
                if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE],
                    newName,
                    { memory: { role: 'linkFiller', storing: false, team: 0 } }) == 0) {
                }
            } else if (LFTeam1 < 1) {
                if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE],
                    newName,
                    { memory: { role: 'linkFiller', storing: false, team: 1 } }) == 0) {
                }
            }
            console.log('Spawning new Link Filler: ' + newName);

        } else if (sourceFarmers.length < 7) {
            var newName = 'sourceFarmer' + Game.time;
            if (sfTeam0.length < 4) {
                if (Game.spawns['HELL'].spawnCreep([WORK, WORK, CARRY, MOVE],
                    newName,
                    { memory: { role: 'sourceFarmer', emptying: false, team: 0 } }) == 0) {
                    console.log('Spawning new Source Farmer: ' + newName);

                }

            } else if (sfTeam1.length < 3) {
                if (Game.spawns['HELL'].spawnCreep([WORK, WORK, CARRY, MOVE],
                    newName,
                    { memory: { role: 'sourceFarmer', emptying: false, team: 1 } }) == 0) {
                    console.log('Spawning new Source Farmer: ' + newName);
                }
            }
            //Harvesters
        } else if (harvesters.length < 1) {
            var newName = 'Harvester' + Game.time;
            //create teams 0 and 1
            if (Hteam1.length < 0) {
                if (Game.spawns['HELL'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE],
                    newName,
                    { memory: { role: 'harvester', storing: false, team: 1 } }) == 0) {
                    console.log('Spawning new harvester: ' + newName);
                }
            } else {
                if (containers.length > 1) {
                    if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
                        newName,
                        { memory: { role: 'harvester', storing: false, team: 0 } }) == 0) {
                        console.log('Spawning new harvester: ' + newName);
                    }
                } else {
                    if (Game.spawns['HELL'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE],
                        newName,
                        { memory: { role: 'harvester', storing: false, team: 0 } }) == 0) {
                        console.log('Spawning new harvester: ' + newName);
                    }
                }

            }
            //Upgraders
        } else if (upgraders.length < 6) {

            var newName = "uppity" + Game.time;
            if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE],
                newName,
                { memory: { role: 'linkUpgrader', upgrading: false, team: 0 } }) == 0) {
                console.log("Spawning new uppity: " + newName);
            }
            //Builders
        } else if (miners.length < 1) {
            var newName = "miner" + Game.time;
            if (Game.spawns['HELL'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE],
                newName,
                { memory: { role: 'miner', upgrading: false, team: 0 } }) == 0) {
                console.log("Spawning new miner: " + newName);
            }
        } else if (builders.length < 4) {

            var newName = "Bob" + Game.time;
            //team 0
            if (Bteam1.length > 3) {
                if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, WORK, MOVE],
                    newName,
                    { memory: { role: 'builder', building: false, team: 0 } }) == 0) {
                    console.log("Spawning new bob the builder: " + newName);
                }
                //team 1
            } else {
                if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE],
                    newName,
                    { memory: { role: 'builder', team: 1 } }) == 0) {
                    console.log("Spawning new bob the builder: " + newName);
                }
                //team: 1
            }
            //Handys / Repairers
        } else if (repairers.length < 5) {

            var newName = 'handy' + Game.time;
            if (RTeam1.length < 3) {
                if (myRoom.energyAvailable > 400) {
                    if (Game.spawns['HELL'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE,],
                        newName,
                        { memory: { role: 'repairer', team: 1 } }) == 0) {
                        console.log('Spawning new handy: ' + newName);
                    }
                } else {
                    if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE,],
                        newName,
                        { memory: { role: 'repairer', team: 1 } }) == 0) {
                        console.log('Spawning new handy: ' + newName);
                    }
                }

            } else {
                if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE,],
                    newName,
                    { memory: { role: 'repairer', team: 0 } }) == 0) {
                    console.log('Spawning new handy: ' + newName);
                }
            }
            //Settlers
        } else if (settlers.length < 0) {

            var newName = "columbus" + Game.time;

            if (Game.spawns['HELL'].spawnCreep([MOVE, MOVE, MOVE, CLAIM, CARRY, WORK],
                newName,
                { memory: { role: 'settler', room: myRoom } }) == 0) {
                console.log("spawning new settler: " + newName);
            }
            //Importers
        } else if (importers.length < 0) {

            var newName = "import" + Game.time;

            if (Game.spawns['HELL'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                newName,
                { memory: { role: 'importer' } }) == 0) {
                console.log("Spawning new importer: " + newName);

            }

        }
    }

    //display when a new screep is spawning
    if (Game.spawns['HELL'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['HELL'].spawning.name];
        Game.spawns['HELL'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['HELL'].pos.x + 1,
            Game.spawns['HELL'].pos.y,
            { align: 'left', opacity: 0.8 }
        );
    }
    //Display data
    if (Game.time % 5 == 0) {
        console.log('\n\n\n----------------------------------------------');
        //check cpu stored
        console.log(Game.cpu.bucket + "/5000 new pixel");
        //check energy and creeps
        console.log(myRoom.energyAvailable + " at " + Game.time + " with " + countCreeps + "/20 creeps");
        //check roles
        console.log("Source Farmers: " + sourceFarmers.length +
            " T0: " + sfTeam0.length + " T1: " + sfTeam1.length +
            "\tFillers: " + fillers.length +
            "\tLink Fillers: " + linkFillers.length +
            '\tHarvesters: ' + harvesters.length +
            " T0: " + Hteam1.length + " T1: " + Hteam1.length +
            "\tTower Guards: " + towerGuards.length +
            '\tUpgraders: ' + upgraders.length + "\n" +
            '\Builders: ' + builders.length +
            " T0: " + Bteam1.length + " T1: " + Bteam1.length +
            '\tRepairers: ' + repairers.length +
            " T0: " + RTeam0.length + " T1: " + RTeam1.length +
            "\tSettlers: " + settlers.length +
            "\tImports: " + importers.length);
        //check teams
        console.log("Team 1 Harvesters: " + Hteam1.length + " Miners : " + miners.length);
        //Game.spawns['a'].spawnCreep([WORK,CARRY,CARRY,MOVE], "towerGuard",{memory: {role: 'towerGuard'}});
        console.log("----------------------------------------------")
    }
    Game.cpu.generatePixel();
}
//you can use room.pos.find to get an array of structures in the room, filter it by those that have hits less than hitsMax, use the lodash sortBy feature to sort them by hits ... then send your repairers or towers after the first element in that array

function clearMemory() {
    for (var name in Memory.creeps) {
        //clear dead creeps from memory
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}
function sellRes(res) {
    //console.log(myRoom.terminal.cooldown)
    if (myRoom.terminal.store[res] > 0 && myRoom.terminal.cooldown < 1) {
        console.log(res + " exists")
        buyUtrium = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: res });
        buyUtrium.sort((orderA, orderB) => orderB.price - orderA.price);
        sellAmount = buyUtrium[0].remainingAmount;
        if (buyUtrium[0].remainingAmount > myRoom.terminal.store[res]) {
            sellAmount = myRoom.terminal.store[res];
        }
        console.log("Sold " + sellAmount + " Utrium at " + buyUtrium[0].price);
        console.log(Game.market.deal(buyUtrium[0].id, sellAmount, myRoom.name));

        Memory.test = buyUtrium[0]; // fast

    }
}
function runRoles() {
    countCreeps = 0;
    //run each role
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        countCreeps++;
        switch (creep.memory.role) {
            case "collector":
                collectDead.run(creep);
                break;
            case "harvester":
                roleHarvester.run(creep);
                break;
            case "builder":
                roleBuilder.run(creep);
                break;
            case "upgrader":
                roleUpgrader.run(creep);
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
            case "settler":
                roleSettler.run(creep);
                break;
            case "importer":
                roleImporter.run(creep);
                break;
            case "sourceFarmer":
                roleSourceFarmer.run(creep);
                break;
            case "linkUpgrader":
                roleLinkUpgrader.run(creep);
                break;
            case "linkFiller":
                roleLinkFiller.run(creep);
                break;
            case "miner":
                roleMiner.run(creep);
                break;
            default:
                creep.memory.role = "sourceFarmer";
                creep.memory.team = 0;
                roleSourceFarmer.run(creep);
                break;
        }

    }
    return countCreeps
}
function spawnCreep() {

}

