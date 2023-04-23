var collect = require("collect");
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleRepairer = require("role.repairer");
var roleSettler = require("role.settler");
var roleImporter = require("role.importer");
var towerGuard = require("role.towerGuard");
var roleFiller = require("role.filler");
var roleScavenger = require("role.scavenger")
var roleDefender = require("role.scavenger");
var roleSourceFarmer = require("role.sourceFarmer");
var roleLinkUpgrader = require("role.linkUpgrader");
var roleStorageLinkMgr = require("role.storageLinkMgr");
var roleMiner = require("role.miner");
var roles = require("roles");
var linksMgr = require("mgr.links");

var mgr = {
    runRoles: function (myRoom) {
        //run each role
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (!creep.spawning) {
                //room creeps
                if (creep.room.controller && creep.room.controller.my) {
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
                            roles.builder(creep);
                            //roleBuilder.run(creep);
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
                        case "linkFiller": //deprecated
                            creep.memory.role = "storageLinkMgr";
                            roleStorageLinkMgr.run(creep);
                        case "storageLinkMgr":
                            roleStorageLinkMgr.run(creep);
                            break;
                        case "upgrader":
                            var links = linksMgr.findLinksInRoom(creep.room);
                            if (links.length < 2) {
                                //if less than 2 links in a room, become a regular upgrader
                                roleUpgrader.run(creep);
                                break;
                            } else {
                                creep.memory.role = "linkUpgrader";

                                if (creep.memory.link == null) {
                                    creep.memory.link = Memory[creep.room.name].links.upgradeLink;
                                }
                            }
                        case "linkUpgrader":
                            //console.log(creep.room.controller.level)
                            //room max level
                            if (creep.room.controller.level == 8) {
                                // console.log("Ticks until upgraders are needed: " + creep.room.controller.ticksToDowngrade)
                                //about to downgrade
                                if (creep.room.controller.ticksToDowngrade < 1000) {
                                    roleLinkUpgrader.run(creep);
                                    break;
                                } else {
                                    if (Memory[creep.room.name].links.upgradeLink == -1) {
                                        roleLinkUpgrader.run(creep)
                                    } else {
                                        // console.log("What to do?");
                                        //roleLinkUpgrader.run(creep);
                                        roleRepairer.run(creep);
                                        break;
                                    }

                                }
                            } else {
                                roleLinkUpgrader.run(creep);
                                break;
                            }

                        case "collector":
                            collect.dead.run(creep);
                            break;
                        case "settler":
                            roleSettler.run(creep);
                            break;
                        case "importer":
                            roleImporter.run(creep);
                            break;
                        default:
                            creep.memory.role = "sourceFarmer";
                            creep.memory.team = 0;
                            roleSourceFarmer.run(creep);
                            break;
                    }
                } else {
                    switch (creep.memory.role) {
                        case "settler":
                            roleSettler.run(creep);
                            break;
                        case "importer":
                            roleImporter.run(creep);
                            break;
                        default:
                            //creep.memory.role = "settler"
                            break;
                    }
                }


            }





        }
    }



};


module.exports = mgr;

