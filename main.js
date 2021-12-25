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
    var myroom = Game.rooms["W23S57"];
	//var ruin = Game.getObjectById('5f29b8885eb8e32fb300fa06');
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        switch(creep.memory.role) {
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

	var redTarget = myroom.find( FIND_HOSTILE_CREEPS);
	if (redTarget.length >0) {
	    var towers = myroom.find( FIND_STRUCTURES, { filter: o => o.structureType === STRUCTURE_TOWER}); +
	    	towers.forEach( function( tower) {
	        Game.getObjectById( tower.id).attack(redTarget[0]);
	    });
	}
	var countCreeps =0;
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
				countCreeps++;

    }

	var fillers = _.filter(Game.creeps, (creep) => creep.memory.role == "filler");
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            var Hteam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "harvester");
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var settlers = _.filter(Game.creeps, (creep) => creep.memory.role == "settler");
		var Bteam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "builder");
    var importers = _.filter(Game.creeps,(creep) => creep.memory.role == "importer");
    var towerGuards = _.filter(Game.creeps,(creep) => creep.memory.role == "towerGuard");
    if(Game.time % 5 == 0){
        	console.log('\n\n\n');
            console.log(Game.cpu.bucket+ "/5000 new pixel");
            console.log(myroom.energyAvailable+ " at " + Game.time + " with " + countCreeps + "/20 creeps");
            console.log("Fillers: " + fillers.length + '\tHarvesters: ' + harvesters.length +"\tTower Guards: " + towerGuards.length + '\tUpgraders: ' + upgraders.length + '\tBuilders: ' + builders.length + '\tRepairers: ' + repairers.length + "\tSettlers: " + settlers.length +"\tImports: " + importers.length);
        	console.log("Team 1 Harvesters: " + Hteam1.length + " Team 1 Builders : " + Bteam1.length);
            //Game.spawns['a'].spawnCreep([WORK,CARRY,CARRY,MOVE], "towerGuard",{memory: {role: 'towerGuard'}});
    }
   //console.log(Game.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity}}));
    if(myroom.energyAvailable > 300){
    	var towers = Game.spawns["Hell"].room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity});
    	if(towers.length > 0 && towerGuards <1){
    		var newName = 'Tower Guard ' + Game.time;
    		//console.log('Spawning new Guard: ' + newName);
    		Game.spawns['Hell'].spawnCreep([WORK,CARRY,CARRY,MOVE], newName,
    				{memory: {role: 'towerGuard'}});

    	}else	if(fillers.length < 7){

				var newName = 'Filler' + Game.time;
		    //console.log('Spawning new Filler: ' + newName);
				Game.spawns['Hell'].spawnCreep([WORK,CARRY,CARRY,MOVE], newName,{memory: {role: 'filler'}});

			}else if(harvesters.length <4){

		    	var newName = 'Harvester' + Game.time;
		    	//console.log('Spawning new harvester: ' + newName);
				  if(Hteam1.length < 1){
					       Game.spawns['Hell'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE], newName,{memory: {role: 'harvester', team: 1}});
				  }else{
					       Game.spawns['Hell'].spawnCreep([WORK,WORK,CARRY,MOVE], newName,{memory: {role: 'harvester',team: 0}});
				  }

      }else if(upgraders.length <8){

		    	var newName = "uppity" + Game.time;
		    	//console.log("Spawning new uppity: " +newName);
		    	Game.spawns['Hell'].spawnCreep([WORK,CARRY,CARRY,MOVE], newName,{memory: {role: 'upgrader'}});

			} else if(builders.length <4){

			    var newName = "Bob" + Game.time;
			    //console.log("Spawning new bob the builder: " +newName);

			    if(Bteam1.length > 1 ){
			         Game.spawns['Hell'].spawnCreep([WORK,CARRY,WORK,MOVE], newName,{memory: {role: 'builder',building: false, team:2} });
			    	   //team: 2
				  }else{
					     Game.spawns['Hell'].spawnCreep([WORK,CARRY,CARRY,MOVE], newName,{memory: {role: 'builder',team: 1}});
					     //team: 1
				}

      }else if(repairers.length < 6){

		    		var newName = 'handy' + Game.time;
		    		//console.log('Spawning new handy: ' + newName);
		    		Game.spawns['Hell'].spawnCreep([WORK,CARRY,CARRY,MOVE,], newName,{memory: {role: 'repairer'}});

		    }else if(settlers.length <0){

		        var newName = "columbus" + Game.time;
		    	  //console.log("spawning new settler: " +newName);
		    	  Game.spawns['Hell'].spawnCreep([MOVE,MOVE,MOVE,CLAIM,CARRY,WORK], newName,{memory: {role: 'settler',room :myroom}});

		    }else if(importers.length <0){

		        var newName = "import" + Game.time;
		    	  //console.log("Spawning new importer: " +newName);
		    	  Game.spawns['Hell'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE],newName,{memory: {role: 'importer'}});

        }
			}

			/*if(Game.spawns['Hell'].spawning) {
				var spawningCreep =   Game.creeps[Game.spawns['Hell'].spawning.name];
        Game.spawns['Hell'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Hell'].pos.x + 1,
            Game.spawns['Hell'].pos.y,
            {align: 'left', opacity: 0.8}
          );
			}*/

      Game.cpu.generatePixel()
}
//you can use room.pos.find to get an array of structures in the room, filter it by those that have hits less than hitsMax, use the lodash sortBy feature to sort them by hits ... then send your repairers or towers after the first element in that array
