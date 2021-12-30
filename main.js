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


module.exports.loop = function () {


    for (var name in Memory.creeps) {
        //clear dead creeps from memory
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }


    }
    var myroom;
    //checks if roomName is in memory
    if (_.has(Memory, 'roomName')) {
        //If roomName is stored, convert into a room for myroom
        myroom = Game.rooms[Memory.roomName];
    } else {
        //searches every room 
        for (let key in Game.rooms) {
            let room = Game.rooms[key]
            //checks if room has a controller and is controlled by me
            if (room.controller && room.controller.my) {
                //stores room name
                Memory.roomName = key;
                break;
            }
        }
    }
    //console.log("room" +myroom);
    //finds room and puts in myroom without using memory
    /*
    for (let key in Game.rooms) {
       let room = Game.rooms[key]
       if (room.controller && room.controller.my) {
           myroom = room;
           break;
       }
   }*/


    //var myroom = Game.rooms["W8S53"];
    //var ruin = Game.getObjectById('5f29b8885eb8e32fb300fa06');

    var countCreeps = 0;
    //run each role
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        countCreeps++;
        switch (creep.memory.role) {
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
            default:
                creep.memory.role = "sourceFarmer";
                creep.memory.team = 0;
                roleSourceFarmer.run(creep);
                break;
        }

    }

    //Look for enemies
    var redTarget = 0;//myroom.find( FIND_HOSTILE_CREEPS);
    if (redTarget.length > 0) {
        //use towers to attack enemies
        var towers = myroom.find(FIND_STRUCTURES, { filter: o => o.structureType === STRUCTURE_TOWER }); +
            towers.forEach(function (tower) {
                Game.getObjectById(tower.id).attack(redTarget[0]);
            });
    }

    //Roles
    var fillers = _.filter(Game.creeps, (creep) => creep.memory.role == "filler");
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var settlers = _.filter(Game.creeps, (creep) => creep.memory.role == "settler");
    var importers = _.filter(Game.creeps, (creep) => creep.memory.role == "importer");
    var towerGuards = _.filter(Game.creeps, (creep) => creep.memory.role == "towerGuard");
    var sourceFarmers = _.filter(Game.creeps, (creep) => creep.memory.role == "sourceFarmer");
    //Teams
    var Hteam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "harvester");
    var Bteam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "builder");
    var sfTeam0 = _.filter(Game.creeps, (creep) => creep.memory.team == 0 && creep.memory.role == "sourceFarmer")
    var sfTeam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "sourceFarmer")


    //console.log(Game.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity}}));

    //check ability to create new screep
    if (myroom.energyAvailable > 200) {
        //see if room has towers
        var towers = myroom.find(FIND_STRUCTURES,
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
            if (Game.spawns['HELL'].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE],
                newName,
                { memory: { role: 'filler', storing: false } }) == 0) {
                console.log('Spawning new Filler: ' + newName);
            }
        } else if (sourceFarmers.length < 6) {
            var newName = 'sourceFarmer' + Game.time;
            if (sfTeam0.length < 3) {
                if (Game.spawns['HELL'].spawnCreep([WORK, WORK, CARRY, MOVE],
                    newName,
                    { memory: { role: 'sourceFarmer', emptying: false, team: 0 } }) == 0) {
                    console.log('Spawning new Source Farmer: ' + newName);

                }

            } else if (sfTeam1.length < 4) {
                if (Game.spawns['HELL'].spawnCreep([WORK, WORK, CARRY, MOVE],
                    newName,
                    { memory: { role: 'sourceFarmer', emptying: false, team: 1 } }) == 0) {
                    console.log('Spawning new Source Farmer: ' + newName);
                }
            }
            //Harvesters
        } else if (harvesters.length < 2) {
            var newName = 'Harvester' + Game.time;
            //create teams 0 and 1
            if (Hteam1.length < 0) {
                if (Game.spawns['HELL'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE],
                    newName,
                    { memory: { role: 'harvester', storing: false, team: 1 } }) == 0) {
                    console.log('Spawning new harvester: ' + newName);
                }
            } else {
                if (Game.spawns['HELL'].spawnCreep([WORK, WORK, CARRY, MOVE],
                    newName,
                    { memory: { role: 'harvester', storing: false, team: 0 } }) == 0) {
                    console.log('Spawning new harvester: ' + newName);
                }
            }
            //Upgraders
        } else if (upgraders.length < 7) {

            var newName = "uppity" + Game.time;
            if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE],
                newName,
                { memory: { role: 'upgrader', upgrading: false } }) == 0) {
                console.log("Spawning new uppity: " + newName);
            }
            //Builders
        } else if (builders.length < 3) {

            var newName = "Bob" + Game.time;
            //teams 1 and 2
            if (Bteam1.length > 1) {
                if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, WORK, MOVE],
                    newName,
                    { memory: { role: 'builder', building: false, team: 2 } }) == 0) {
                    console.log("Spawning new bob the builder: " + newName);
                }
                //team: 2
            } else {
                if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE],
                    newName,
                    { memory: { role: 'builder', team: 1 } }) == 0) {
                    console.log("Spawning new bob the builder: " + newName);
                }
                //team: 1
            }
            //Handys / Repairers
        } else if (repairers.length < 3) {

            var newName = 'handy' + Game.time;
            if (Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE,],
                newName,
                { memory: { role: 'repairer' } }) == 0) {
                console.log('Spawning new handy: ' + newName);
            }
            //Settlers
        } else if (settlers.length < 0) {

            var newName = "columbus" + Game.time;

            if (Game.spawns['HELL'].spawnCreep([MOVE, MOVE, MOVE, CLAIM, CARRY, WORK],
                newName,
                { memory: { role: 'settler', room: myroom } }) == 0) {
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
        console.log(myroom.energyAvailable + " at " + Game.time + " with " + countCreeps + "/20 creeps");
        //check roles
        console.log("Source Farmers: " + sourceFarmers.length +
            " T0: " + sfTeam0.length + " T1: " + sfTeam1.length +
            "\tFillers: " + fillers.length +
            '\tHarvesters: ' + harvesters.length +
            "\tTower Guards: " + towerGuards.length +
            '\tUpgraders: ' + upgraders.length +
            '\tBuilders: ' + builders.length +
            '\tRepairers: ' + repairers.length +
            "\tSettlers: " + settlers.length +
            "\tImports: " + importers.length);
        //check teams
        console.log("Team 1 Harvesters: " + Hteam1.length + " Team 1 Builders : " + Bteam1.length);
        //Game.spawns['a'].spawnCreep([WORK,CARRY,CARRY,MOVE], "towerGuard",{memory: {role: 'towerGuard'}});
        console.log("----------------------------------------------")
    }
    Game.cpu.generatePixel()
}
//you can use room.pos.find to get an array of structures in the room, filter it by those that have hits less than hitsMax, use the lodash sortBy feature to sort them by hits ... then send your repairers or towers after the first element in that array
