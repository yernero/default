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
var defMgr = require("mgr.defense");
var marketMgr = require("mgr.market");
var linksMgr = require("mgr.links");
var displayer = require("displayer");
var spawnMgr = require("mgr.spawner");
var myRoom;
module.exports.loop = function () {
    console.log(".")
    //design note: memory includes more than just room objects therefore uses its own loops

    //creates memory for all rooms owned
    memMgr.createRoomsMem();
    //creates memory for all creeps
    //memMgr.createCreepMem();
    memMgr.updateCreepMem();
    memMgr.clearMemory();

    var speed = 10;
    //mgr.createMem("outside");
    if (true || Game.time % speed == 0) {
        displayer.displayAll();
        //displayer.displayStats(myRoom);
    }

    //Design Note: keep room bases actions in this loop?

    //TODO convert mgr.runRoles into a method that runs roles for every room

    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];

        if (room.controller && room.controller.my) {
            //making sure memory exists always
            if (!Memory[roomName].spawns[0]) {
                memMgr.updateSpawnMem(room);
            }
            if (!Memory[roomName].storage.total) {
                memMgr.updateContainersMem(room);
            }
            if (!Memory[roomName].links.all || Memory[roomName].links.total == 0) {
                memMgr.updateLinkMem(room);
            }
            //regularly updating memory
            if (Game.time % (speed / 2) == 0) {
                //console.log("updating memory")
                //memMgr.updateConstructionMem(room);
                memMgr.updateRepairMem(room);//needs to run often
            }
            //Memory that rarely changes but might
            if (Game.time % 10000 == 0) {
                memMgr.updateExtensions(room);
                memMgr.updateSpawnMem(room);
                memMgr.updateContainersMem(room);
                memMgr.updateLinkMem(room);

                //in case memory changes unexpectedly
            }
            linksMgr.keepLinksFull(room);
            var spawns = room.find(FIND_STRUCTURES).filter(structure => [STRUCTURE_SPAWN].indexOf(structure.structureType) !== -1);

            if (spawns.length > 0 && !spawns[0].my) {
                spawns[0].destroy();
            } else if (spawns.length < 1) {
                //create a spawn
                console.log("implement spawn creation")
            }
            if (room.energyAvailable >= 150) {
                spawnMgr.energyCollection(room);
                spawnMgr.defense(room);
                spawnMgr.industry(room);
                spawnMgr.expansion(room);
            }

        } else {
            //not my room
        }
        defMgr.guard(room);

        mgr.runRoles(room);
        displayer.spawning(room);


    }
    Game.cpu.generatePixel();
    //end of main loop
}


//you can use room.pos.find to get an array of structures in the room, filter it by those that have hits less than hitsMax, use the lodash sortBy feature to sort them by hits ... then send your repairers or towers after the first element in that array

function spawnCreep() {

}

