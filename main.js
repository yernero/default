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
var findMyRoom = require("find.myRoom");
var mgr = require("mgr");
var memMgr = require("mgr.memory");
var displayer = require("displayer");
var myRoom;
module.exports.loop = function () {


    //creates memory for all rooms owned
    memMgr.createRoomsMem();
    //creates memory for all creeps
    //memMgr.createCreepMem();
    memMgr.updateCreepMem();

    //mgr.createMem("outside");
    if (Game.time % 1 == 0) {
        displayer.displayAll();
        //displayer.displayStats(myRoom);
    }
    //myRoom = findMyRoom.run();
    //console.log("room" +myRoom);

    var myRoom = Game.rooms["W8S53"];
    //console.log("room" +myRoom);


    //TODO convert mgr.runRoles into a method that runs roles for every room

    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        mgr.runRoles(room);

    }


    //var countCreeps = runRoles();
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
        if (links[0].cooldown == 0 && links[0].store[RESOURCE_ENERGY] > 200) {
            switch (links[0].transferEnergy(upgradeLink)) {
                case 0:
                    //do nothing
                    break;
                case -6:
                    console.log(links[0] + " is empty")
                    break;
                default:
                    //idk what happened
                    console.log("Tried to fill upgradeLink " + links[0].transferEnergy(upgradeLink));
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
        if (linkFillers0 < 2) {
            //  mgr.spawnCreep("linkFiller", 0, myRoom, 0);
        }

    }

    //Roles
    var towerGuards = mgr.getNumCreeps(myRoom, "towerGuard_0");

    //console.log("test" + mgr.getNumCreeps(myRoom.name, "towerGuard_0"))
    //console.log(towerGuards)
    //console.log(myRoom)
    var fillers0 = mgr.getNumCreeps(myRoom, "filler_0");
    var fillers1 = mgr.getNumCreeps(myRoom, "filler_1");
    //console.log(fillers0 + " " + fillers1)

    var sourceFarmers0 = mgr.getNumCreeps(myRoom, "sourceFarmer_0")
    var sourceFarmers1 = mgr.getNumCreeps(myRoom, "sourceFarmer_1")
    //console.log(sourceFarmers0 + " "+ sourceFarmers1)

    var linkFillers0 = mgr.getNumCreeps(myRoom, "linkFiller_0")
    //console.log(linkFillers0);

    var harvesters0 = mgr.getNumCreeps(myRoom, "harvester_0")
    var harvesters1 = mgr.getNumCreeps(myRoom, "harvester_1")
    //console.log(harvesters1 + " " + harvesters0)

    var upgraders0 = mgr.getNumCreeps(myRoom, "upgrader_0")
    var linkUpgraders0 = mgr.getNumCreeps(myRoom, "linkUpgrader_0")
    //console.log(upgraders0 + " " + linkUpgraders0);

    var miners0 = mgr.getNumCreeps(myRoom, "miner_0")
    //console.log(miners0)

    var builders0 = mgr.getNumCreeps(myRoom, "builder_0")
    var builders1 = mgr.getNumCreeps(myRoom, "builder_1")
    //console.log(builders0 + " " + builders1);

    var repairers0 = mgr.getNumCreeps(myRoom, "repairer_0");
    var repairers1 = mgr.getNumCreeps(myRoom, "repairer_1");
    //console.log("repairers " + repairers0 + " " + repairers1);

    var settlers0 = mgr.getNumCreeps(null, "settler_0")
    //console.log(settlers0)

    var importers0 = mgr.getNumCreeps(null, "importer_0")
    //console.log(importers0)

    //console.log(Object.keys(Game.flags).length)
    var flags = Object.keys(Game.flags).length;
    //creating new creeps
    if (myRoom.energyAvailable > 100) {
        //see if room has towers
        var towers = myRoom.find(FIND_STRUCTURES,
            {
                filter: (structure) => structure.structureType == STRUCTURE_TOWER
                    && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY)
            });
        //console.log("Towers: " + towers.length);

        //if room has towers, and no tower guard
        //console.log(Memory[myRoom.name].creeps["filler_0"])
        //console.log((towerGuards || towerGuards.length < 1))
        // console.log(((sourceFarmers0 && !sourceFarmers1) && sourceFarmers0 < 7))
        if (((fillers1 && !fillers0) && fillers1 < 3 && myRoom.energyAvailable < 1000)
            || ((fillers0 && !fillers1) && fillers0 < 3)
            || ((fillers0 && fillers1) && fillers1 + fillers0 < 3)
            || (!fillers0 && !fillers1)
        ) {//fillers

            console.log("spawning fillers");
            if (containers.length < 1) {//0
                mgr.spawnCreep("filler", 0, myRoom, 0);
            } else {//1
                mgr.spawnCreep("filler", 1, myRoom, 0);
            }

            //3
        } else if ((!towers && !towerGuards)
            || (towerGuards < 1 && towers.length > 0)
            || (towers.length > 0 && (!towerGuards || towerGuards.length < 1))
        ) {//tower Guards

            console.log("spawning a tower guard")
            mgr.spawnCreep("towerGuard", 0, myRoom, 0);

            //4
        } else if ((!sourceFarmers0 && !sourceFarmers1) //none
            || ((sourceFarmers0 && !sourceFarmers1) && sourceFarmers0 < 7)
            || ((sourceFarmers0 && sourceFarmers1) && (sourceFarmers0 + sourceFarmers1) < 7)
        ) {//source farmers
            console.log("Spawning source Farmers")
            if (!sourceFarmers0 || sourceFarmers0 < 4) {//0
                mgr.spawnCreep("sourceFarmer", 0, myRoom, 0);
            } else if (!sourceFarmers1 || sourceFarmers1 < 3) {//1
                mgr.spawnCreep("sourceFarmer", 1, myRoom, 0);
            }

            //11
        } else if (linkFillers0 < 1) {//link fillers
            mgr.spawnCreep("linkFiller", 0, myRoom, 0);

            //12
        } else if (harvesters0 + harvesters1 < 1) {//Harvesters
            if (harvesters1 && harvesters1 < 0) {//1
                mgr.spawnCreep("harvester", 1, myRoom, 0);
            } else {//0
                if (containers.length > 1) {
                    mgr.spawnCreep("harvester", 0, myRoom, 0);
                } else {
                    mgr.spawnCreep("harvester", 0, myRoom, 0);
                }
            }

            //13
        } else if (!upgraders0
            || (upgraders0 && upgraders0 < 6)
            || (linkUpgraders0 && linkUpgraders0 < 6)) {//Upgraders

            mgr.spawnCreep("upgrader", 0, myRoom, 0)//0

            //19
        } else if (miners0 < 1) {//Miners
            mgr.spawnCreep("miner", 0, myRoom, 0);//0

            //20
        } else if (builders1 < 1) {
            mgr.spawnCreep("builder", 1, myRoom, 0);

            //21
        } else if (builders0 < 1) {
            mgr.spawnCreep("builder", 0, myRoom, 0);

            //22
        } else if (repairers1 < 3) {//repairers 1
            mgr.spawnCreep("repairer", 1, myRoom, 0)

            //25
        } else if (repairers0 < 2) {
            mgr.spawnCreep("repairer", 0, myRoom, 0);
        } else if (flags > 0 && settlers0 < 1) {//Settlers
            console.log("Trying to spawn Settler")
            mgr.spawnCreep("settler", 0, myRoom, 0)
        } else if (importers0 < 0) {//Importers
            mgr.spawnCreep("importer", 0, myRoom, 0)
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

    Game.cpu.generatePixel();
    //end of main loop
}




//you can use room.pos.find to get an array of structures in the room, filter it by those that have hits less than hitsMax, use the lodash sortBy feature to sort them by hits ... then send your repairers or towers after the first element in that array

function spawnCreep() {

}

