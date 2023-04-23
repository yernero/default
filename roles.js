var fill = require("fill");
var memMgr = require("mgr.memory");
var collect = require("collect");

var roleUpgrader = require("role.upgrader");

var roles = {
    builder: function (creep) {
        var room = creep.room;
        var roomName = room.name;
        var targets = {};
        //Build or collect
        if (creep.memory.building) {
            //changing status
            if (creep.store.getUsedCapacity() == 0) {
                creep.memory.building = false;
                creep.say('⚡');
            } else {
                //check if saved destination
                if (creep.memory.destination) {
                    //check if destination became invalid
                    var dest = Game.getObjectById(creep.memory.destination);
                    //console.log(dest.pos)
                    //console.log("site progress: "  + dest.progress);
                    if (!dest) {
                        //bad destination so erase
                        console.log("construction site " + creep.memory.destination +" does not exist")
                        creep.memory.destination = null;
                    } else {
                        var status = creep.build(dest);
                        switch (status) {
                            case 0:
                                //worked
                                break;
                            case -9:
                                //not in distance
                                creep.moveTo(dest);
                                break;
                            default:
                                console.log(status + " error building in " + roomName);
                                break;
                        }
                    }
                } else {
                    console.log("choosing construction site for " + creep.name + " in room "  + roomName + ": " + creep.memory.destination );
                    //find all construction sites in room memory
                    memMgr.updateConstructionMem(room);
                    //load targets from memory
                    var targets = []
                    //TODO: load just the relevant construction site
                    for (var site in Memory[roomName].constructionSites.all) {
                        targets.push(Game.getObjectById(Memory[roomName].constructionSites.all[site].id));
                    }
                    //console.log("targets in " + roomName + " " + targets.length);

                    //if no construction sites, try to repair something
                    if (!targets || targets.length == 0) {
                        //hopefully sets a destination
                        //roleRepairer.run(creep)
                        creep.memory.role = "repairer";
                        console.log("No construction sites in room " + roomName);

                    } else {
                        //depending on team set target destination
                        switch (creep.memory.team) {
                            case 1:
                                //get last construction site
                                creep.memory.destination = targets[targets.length - 1].id;
                                break;
                            case 0:
                            default:
                                //get first construction site
                                creep.memory.destination = targets[0].id;
                                break;
                        }
                    }
                }
            }
        } else {
            //make sure memory created
            creep.memory.building = false;
            //changing status
            if (creep.store.getFreeCapacity() == 0) {
                creep.memory.building = true;
                creep.say('🚧');

                //TODO: fix?
                creep.memory.dest = false;

            } else {
                collect.containers(creep);
            }
        }

    }
    ,
    defender: function (creep) {
        var room = creep.room;
		var roomName = room.name;
		var redTarget = creep.room.find(FIND_HOSTILE_CREEPS);

		if (redTarget.length > 0) {
			//  console.log(redTarget);
			creep.attack(redTarget[1]);
		}
    }
    ,
    filler: function (creep) {
        var room = creep.room;
		var roomName = room.name;
		//console.log(creep.pos)
		/* var extensions = creep.room.find(FIND_STRUCTURES,{filter: (structure) => return (structure.structureType == STRUCTURE_STORAGE ||structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity() > 0});
		 *///finding all storage containers not spawn with space left
		if (creep.memory.storing) {
			if (creep.carry.energy == 0) {
				creep.memory.storing = false;
				creep.say('⚡');
			} else {
				var extensions = creep.room.find(FIND_STRUCTURES)	.filter(i => i.structureType == STRUCTURE_EXTENSION).filter(i => i.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
				//var extensions = getExtensions(room);
					//console.log(roomName + " " + extensions);
				if (extensions.length < 1) {
					var extensions = creep.room.find(FIND_STRUCTURES)
						.filter(i => i.structureType == STRUCTURE_SPAWN);
				}
				//console.log(extensions);

				if (creep.room.energyAvailable == creep.room.energyCapacityAvailable) {
					//all extensions and spawn is full
					//console.log("ALL STORAGE FULL");

					var extensions = creep.room.find(FIND_STRUCTURES).filter(structure => [STRUCTURE_TOWER, STRUCTURE_CONTAINER].indexOf(structure.structureType) !== -1)
						.filter(structure => structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
					//console.log(extensions);
					if (extensions.length < 1) {
						roleUpgrader.run(creep);
						/*var extensions = creep.room.find(FIND_STRUCTURES,
							{filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;}});*/
					} else {

						if (creep.memory.team == 1) {
							if (creep.repair(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveTo(extensions[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
							}
						} else {
							if (creep.repair(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveTo(extensions[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
							}
						}
					}
				} else {

					/* var extensions = creep.room.find(FIND_STRUCTURES,
						{ filter: (structure) => { 
							return (structure.structureType == STRUCTURE_EXTENSION 
								|| structure.structureType == STRUCTURE_SPAWN) 
								&& structure.energy < structure.energyCapacity; } }); */
					if (extensions.length < 1) {
						roleUpgrader.run(creep);
					} else {
						if (creep.transfer(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(extensions[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
						}
					}
				}
			}

		} else {
			//make sure memory created
			creep.memory.storing = false;
			//changing status
			if (creep.carry.energy == creep.carryCapacity) {
				creep.memory.storing = true;
				creep.say('🧪');
			} else {
				collect.containers(creep);
			}
		}
		//creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});

    }
    ,
    harvester: function (creep) {
    }
    ,
    importer: function (creep) {
    }
    ,
    linkFiller: function (creep) {
    }
    ,
    linkUpgrader: function (creep) {
    }
    ,
    miner: function (creep) {
    }
    ,
    recoverer: function (creep) {
    }
    ,
    repairer: function (creep) {
    }
    ,
    scavenger: function (creep) {
    }
    ,
    settler: function (creep) {
    }
    ,
    sourceFarmer: function (creep) {
    }
    ,
    storageLink: function (creep) {
    }
    ,
    towerGuard: function (creep) {
    }
    ,
    upgrader: function (creep) {
    }



};



module.exports = roles;