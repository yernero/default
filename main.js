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
module.exports.loop = function () {
    
   
    for (var name in Memory.creeps) {
        //clear dead creeps from memory
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
      

    }
    var myroom;
    for(let key in Game.rooms){
        let room = Game.rooms[key]
        if(room.controller && room.controller.my){
            myroom = room;
            break;
        }
    }
    //console.log("room" +myroom);
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
            default:
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

    //Teams
    var Hteam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "harvester");
    var Bteam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "builder");

    //store pixels
    if (Game.time % 5 == 0) {
        console.log('\n\n\n');
        console.log(Game.cpu.bucket + "/5000 new pixel");
        console.log(myroom.energyAvailable + " at " + Game.time + " with " + countCreeps + "/20 creeps");
        console.log("Fillers: " + fillers.length + '\tHarvesters: ' + harvesters.length + "\tTower Guards: " + towerGuards.length + '\tUpgraders: ' + upgraders.length + '\tBuilders: ' + builders.length + '\tRepairers: ' + repairers.length + "\tSettlers: " + settlers.length + "\tImports: " + importers.length);
        console.log("Team 1 Harvesters: " + Hteam1.length + " Team 1 Builders : " + Bteam1.length);
        //Game.spawns['a'].spawnCreep([WORK,CARRY,CARRY,MOVE], "towerGuard",{memory: {role: 'towerGuard'}});
    }

    //console.log(Game.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity}}));

    //check ability to create new screep
    if (myroom.energyAvailable > 200) {
        //see if room has towers
        var towers = myroom.find(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity });
        //console.log("Towers: " + towers.length);

        //if room has towers, and no tower guard
        if (towers.length > 0 && towerGuards < 1) {
            //create a towerguard
            var newName = 'Tower Guard ' + Game.time;
            console.log('Spawning new Guard: ' + newName);
            Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE], newName,
                { memory: { role: 'towerGuard' } });
            //Fillers
        } else if (fillers.length < 1) {

            var newName = 'Filler' + Game.time;
            console.log('Spawning new Filler: ' + newName);
            Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE], newName, { memory: { role: 'filler' } });
            //Harvesters
        } else if (harvesters.length < 4) {

            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + Hteam1.length);

            //create teams 0 and 1
            if (Hteam1.length < 0) {
                Game.spawns['HELL'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE], newName, { memory: { role: 'harvester', team: 1 } });
            } else {
                Game.spawns['HELL'].spawnCreep([WORK, WORK, CARRY, MOVE], newName, { memory: { role: 'harvester', team: 0 } });
            }
            //Upgraders
        } else if (upgraders.length < 8) {

            var newName = "uppity" + Game.time;
            console.log("Spawning new uppity: " + newName);
            Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE], newName, { memory: { role: 'upgrader' } });
            //Builders
        } else if (builders.length < 4) {

            var newName = "Bob" + Game.time;
            console.log("Spawning new bob the builder: " + newName);
            //teams 1 and 2
            if (Bteam1.length > 1) {
                Game.spawns['HELL'].spawnCreep([WORK, CARRY, WORK, MOVE], newName, { memory: { role: 'builder', building: false, team: 2 } });
                //team: 2
            } else {
                Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE], newName, { memory: { role: 'builder', team: 1 } });
                //team: 1
            }
            //Handys / Repairers
        } else if (repairers.length < 3) {

            var newName = 'handy' + Game.time;
            console.log('Spawning new handy: ' + newName);
            Game.spawns['HELL'].spawnCreep([WORK, CARRY, CARRY, MOVE,], newName, { memory: { role: 'repairer' } });
            //Settlers
        } else if (settlers.length < 0) {

            var newName = "columbus" + Game.time;
            console.log("spawning new settler: " + newName);
            Game.spawns['HELL'].spawnCreep([MOVE, MOVE, MOVE, CLAIM, CARRY, WORK], newName, { memory: { role: 'settler', room: myroom } });
            //Importers
        } else if (importers.length < 0) {

            var newName = "import" + Game.time;
            console.log("Spawning new importer: " + newName);
            Game.spawns['HELL'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName, { memory: { role: 'importer' } });

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

    Game.cpu.generatePixel()
}
//you can use room.pos.find to get an array of structures in the room, filter it by those that have hits less than hitsMax, use the lodash sortBy feature to sort them by hits ... then send your repairers or towers after the first element in that array
