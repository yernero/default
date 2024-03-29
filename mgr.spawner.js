var memMgr = require("mgr.memory");
var utilSrc = require("util.sources");
const { getConstructionSites } = require("./mgr.memory");
var spawnMgr = {
    /*
    move =50
    work =100
    carry = 50
    attack = 80
    ranged attack = 150
    heal = 250
    claim = 600
    tough = 10
        */
    energyCollection: function (room) {
        if (room.controller.my) {
            var roomName = room.name;
            var energy = room.energyAvailable;
            if (energy > 200) {

                //Source Farmers
                //Check that every source has the max number of SF
                var sources = room.find(FIND_SOURCES);
                for (var i in sources) {
                    var source = sources[i];

                    //count open tiles for each source
                    let maxSF = utilSrc.countEmptyTiles(room, source);
                    //console.log(maxSF);
                    
                    //find number of sourceFarmers on team 
                    var role = "sourceFarmer_" + i;
                    var sourceFarmers = memMgr.getNumCreeps(room, role);
                    //console.log(sourceFarmers);
                    if (sourceFarmers < maxSF) {
                        body = [WORK, CARRY, MOVE];//200
                        this.spawnCreep("sourceFarmer", i, room, 0, body);
                    }
                }


                //Storage Link Managers
                //Find number of storage link maangers on team 0
                var storageLinkMgrs0 = memMgr.getNumCreeps(room, "storageLinkMgr_0")
                //console.log(storageLinkMgrs0);

                //Find number of links in room
                var numOfLinks = Memory[roomName].links.total;
                //console.log(numOfLinks)

                //check if links exist, if a Storage Link Manager exists, and if a storage Link exists memory
                if (numOfLinks > 1
                    && storageLinkMgrs0 < 1
                    && Memory[roomName].links.storageLink != -1) {//link fillers
                    body = [WORK, CARRY, MOVE];//200
                    this.spawnCreep("storageLinkMgr", 0, room, 0, body);

                }

            } else if (energy > 250) {//Storage Link Mangers

            }


            /* 
            //harvesters deprecated and replaced with source Farmers
            if (harvesters0 + harvesters1 < 0) {//Harvesters
                 var harvesters0 = memMgr.getNumCreeps(room, "harvester_0")
                 var harvesters1 = memMgr.getNumCreeps(room, "harvester_1")
                 //console.log(harvesters1 + " " + harvesters0)
                 body = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE];//400
                 if (harvesters1 && harvesters1 < 0) {//1
                     this.spawnCreep("harvester", 1, room, 0);
                 } else {//0
                     if (Memory[roomName].storage.containers[0]) {
                         this.spawnCreep("harvester", 0, room, 0);
                     } else {
                         this.spawnCreep("harvester", 0, room, 0);
                     }
                 }
             }*/

        } else {
            //should not happen
            console.log(roomName + " accidently sent to spawner")
        }

    }
    ,
    defense: function (room) {
        var roomName = room.name;
        var energy = room.energyAvailable;


        if (energy >= 300) {
            //make sure Tower Memory is up to date
            memMgr.updateTowerMem(room);

            //see if room has towers
            var towers = memMgr.getTowers(room);
            //console.log("Towers: " + towers.length);

            if (towers.length > 0) {
                //Find the number of towerGuards
                var towerGuards = memMgr.getNumCreeps(room, "towerGuard_0");
                //console.log(towerGuards)


                //if room has towers, and no tower guard for each tower
                if (towerGuards < towers.length) {
                    body = [WORK, CARRY, MOVE, TOUGH, TOUGH, ATTACK];//300
                    this.spawnCreep("towerGuard", 0, room, 0, body);

                }
            }

        }

    }
    ,
    industry: function (room) {
        var roomName = room.name;
        var energy = room.energyAvailable;

        if (energy >= 200) {
            memMgr.updateConstructionMem(room);

            var constructionSites = memMgr.getConstructionSites(room);
            //console.log(roomName + " " + constructionSites.length)

            if (constructionSites.length > 0) {

                //console.log(roomName + " " + constructionSites)
                var builders0 = memMgr.getNumCreeps(room, "builder_0")
                if (builders0 < 2) {
                    console.log(roomName + " builders" + builders0)

                    body = [WORK, CARRY, MOVE];//300

                    this.spawnCreep("builder", 0, room, 0, body);
                }
            }
        }
        if (energy >= 200) {
            //Fillers
            var fillers0 = memMgr.getNumCreeps(room, "filler_0");
            var fillers1 = memMgr.getNumCreeps(room, "filler_1");
            //console.log(fillers0 + " " + fillers1)
            //check if fillers are needed
            var storage = null;
            if (Memory[roomName].storage.storages[0]) {
                storage = Game.getObjectById(Memory[roomName].storage.storages[0].id).store.getUsedCapacity(RESOURCE_ENERGY);
            }
            if (storage) {
                if (storage > 500 && fillers0 < 2) {//fillers
                    body = [WORK, CARRY, MOVE];//200

                    this.spawnCreep("filler", 0, room, 0, body);

                }

                if (storage > 50000 && fillers0 < 4 && energy < 7000) {
                    body = [CARRY, CARRY, CARRY, MOVE, MOVE]//250

                    this.spawnCreep("filler", 0, room, 0, body);

                }
            }

            //Upgraders
            var upgraders0 = memMgr.getNumCreeps(room, "upgrader_0")
            var linkUpgraders0 = memMgr.getNumCreeps(room, "linkUpgrader_0")
            //console.log(upgraders0 + " " + linkUpgraders0);

            //console.log(room.controller.ticksToDowngrade)
            //console.log(room.controller.level)
            if (room.controller.level < 8 || room.controller.ticksToDowngrade < 1000) {
                if (room.energyAvailable > 350 && upgraders0 + linkUpgraders0 < 7) {
                    body = [WORK, WORK, CARRY, CARRY, MOVE];//250
                    this.spawnCreep("upgrader", 0, room, 0, body)//0
                }

                if ((upgraders0 + linkUpgraders0 < 3)) {
                    body = [WORK, CARRY, CARRY, MOVE];//250

                    this.spawnCreep("upgrader", 0, room, 0, body)//0

                }
            }

            var numOfLinks = Memory[roomName].links.total;

            if ((numOfLinks > 0 || linkUpgraders0 && linkUpgraders0 < 6)) {//Upgraders

                //19
            }

        }


        var miners0 = memMgr.getNumCreeps(room, "miner_0")
        //console.log(miners0)

        if (energy >= 450) {

        }

        var builders0 = memMgr.getNumCreeps(room, "builder_0")
        var builders1 = memMgr.getNumCreeps(room, "builder_1")
        //console.log(builders0 + " " + builders1);

        var repairers0 = memMgr.getNumCreeps(room, "repairer_0");
        var repairers1 = memMgr.getNumCreeps(room, "repairer_1");
        //console.log("repairers " + repairers0 + " " + repairers1);




        if (miners0 < 1 && Memory[roomName].terminal.extractor) {//Miners
            body = [WORK, WORK, WORK, CARRY, CARRY, MOVE];//450

            this.spawnCreep("miner", 0, room, 0, body);//0

            //20
        } else if (builders1 < 1) {
            body = [WORK, WORK, CARRY, MOVE];//300

            this.spawnCreep("builder", 1, room, 0, body);

            //21
        } else if (builders0 < 0) {
            body = [WORK, CARRY, CARRY, MOVE];//250

            this.spawnCreep("builder", 0, room, 0, body);

            //22
        } else if (repairers1 < 1) {//repairers 1
            body = [WORK, WORK, CARRY, CARRY, MOVE];//350

            this.spawnCreep("repairer", 1, room, 0, body)

            //25
        } else if (repairers0 < 1) {
            body = [WORK, CARRY, CARRY, MOVE];//250

            this.spawnCreep("repairer", 0, room, 0, body);
        }
    }
    ,
    expansion: function (room) {
        var roomName = room.name;

        var settlers0 = memMgr.getNumCreeps(null, "settler_0")
        //console.log(settlers0)

        var importers0 = memMgr.getNumCreeps(null, "importer_0")
        //console.log(importers0)

        //console.log(Object.keys(Game.flags).length)
        var flags = Object.keys(Game.flags).length;

        if (flags > 0 && settlers0 < 1 && room.energyAvailable > 2000) {//Settlers
            body = [MOVE, MOVE, MOVE, CLAIM, CARRY, WORK];//900

            this.spawnCreep("settler", 0, room, 0, body)
        } else if (importers0 < 0) {//Importers
            body = [MOVE, MOVE, MOVE, CARRY, WORK];//900

            this.spawnCreep("importer", 0, room, 0, body)
        }

    }
    , spawnCreep: function (role, team, room, spawnNum, body) {

        let newName = role + Game.time;
        var roomName = room.name
        //console.log(roomName);
        var spawn = Game.getObjectById(Memory[roomName].spawns[spawnNum].id)
        //let body = [WORK, CARRY, MOVE];
        var status = spawn.spawnCreep(body, newName, { memory: { role: role, team: team } })
        switch (status) {
            case 0:
                console.log('Spawned new ' + role + team + " " + newName + " in " + roomName);
                break;
            case -4:
                console.log("Spawning...")
                break;
            case -6:
                //not enough energy
                break;
            default:
                console.log("spawning error " + status + " for " + role)
        };

    }


};

module.exports = spawnMgr;