var fill = require("fill");
var memMgr = require("mgr.memory");
var collect = require("collect");

var roles = {
    builder: function (creep) {
        var room = creep.room;
        var roomName = room.name;
        var targets = {};
        
        //Build or collect
        if(creep.memory.building){
            //changing status
            if (creep.store.getUsedCapacity() == 0) {
				creep.memory.building = false;
				creep.say('⚡');
			} else {
                //make sure a destination exists in creep memory
				if (!creep.memory.dest) {
					//find all construction sites in room memory
					memMgr.updateConstructionMem(room);
					var targets = []
					for (var site in Memory[roomName].constructionSites.all) {
						targets.push(Game.getObjectById(Memory[roomName].constructionSites.all[site].id));
					}
					//console.log("targets in " + roomName + " " + targets);
					//if no construction sites, try to repair something
					if (!targets || targets.length == 0) {
						//hopefully sets a destination
						//roleRepairer.run(creep)
                        console.log("decide action in builder")
                    } else {
						//depending on team set target destination
						switch (creep.memory.team) {
							case 1:
								creep.memory.dest = targets[targets.length - 1].id;
								break;
							case 0:
							default:
								creep.memory.dest = targets[0].id;
								break;
						}
					}

				}
				//check if destination became invalid
				var dest = Game.getObjectById(creep.memory.dest);
				//console.log(dest.pos)
				if (!dest || dest.hits > 0) {
					creep.memory.dest = null;
					//console.log(creep.name + " cannot find work in " + roomName)
					//roleRepairer.run(creep)
                    console.log("decide action in builder")
				} else {
					var status = creep.build(dest);
					switch (status) {
						case 0:
							//worked
							break;
						case -9:
							creep.moveTo(dest);
							break;
						default:
							console.log(status + " error building in " + roomName);
							break;
					}

				}



			
            }
        }else{
            //make sure memory created
			creep.memory.building = false;
			//changing status
			if (creep.store.getFreeCapacity() == 0) {
				creep.memory.building = true;
                creep.say('🚧');

                //TODO: fix?
				creep.memory.dest = false;
				
			} else {
				collect.containers.run(creep);
			}
        }

    }
    ,
    defender: function (creep) {
    }
    ,
    filler: function (creep) {
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