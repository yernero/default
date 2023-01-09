//cannot reference mgr here
var linksmgr = require("mgr.links")
//const { clearMemory } = require("./mgr");

var memMgr = {
    createRoomsMem: function () {
        //For creeps without a home room
        Memory.outside = {};
        Memory.outside.creeps = {}
        //All my rooms will be in Game.rooms
        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
            if (!Memory[roomName]) {
                Memory[roomName] = {};
                Memory[roomName].creeps = {};
                //Memory[roomName].links = {};
                //Memory[roomName].links.upgradeLink = -1;
                //Memory[roomName].links.storageLink = -1;
                Memory[roomName].repairs = {};
                Memory[roomName].storage = {};
                Memory[roomName].constructionSites = {};
                Memory[roomName].terminal = {};
                Memory[roomName].spawns = {};
                for (let spawnName in Game.spawns) {
                    //console.log(spawnName)
                    //check if spawn is in current room
                    if (Game.spawns[spawnName].room == room) {
                        if (!Memory[roomName].spawns[0]) {
                            Memory[roomName].spawns[0] = Game.spawns[spawnName];

                        } else {
                            //Memory[roomName].spawns[Object.keys(Memory[myroomName.name].spawns).length] = Game.spawns[i];
                        }
                    }
                }
                Memory[roomName].sources = room.find(FIND_SOURCES);
                console.log("Created Memory for Room " + room)
            }
            // if()

            //declare memory variables
            if (Memory[roomName].links == null) {
                Memory[roomName].links = {};
                Memory[roomName].links.upgradeLink = -1;
                Memory[roomName].links.storageLink = -1;
                console.log("Created Memory for Links in " + roomName)
            }
            if (Memory[roomName].creeps == null) {
                Memory[roomName].creeps = {};
                console.log("Created Memory for creeps in " + roomName)
            }

            if (Memory[roomName].repairs == null) {
                Memory[roomName].repairs = {}
                //memory[roomName].repairs
                this.updateRepairMem();
                console.log("Created Memory for repairs in " + roomName)
            }
            if (Memory[roomName].storage == null) {
                Memory[roomName].storage = {}
                console.log("Created Memory for storage in " + roomName)
            }
            if (Memory[roomName].constructionSites == null) {
                Memory[roomName].constructionSites = {}
                console.log("Created Memory for constructionSites in " + roomName)

            }
            // console.log(Memory[roomName].constructionSites.all)
            if (Memory[roomName].constructionSites.all == null) {
                //console.log("no Construction sites")
            }
            if (Memory[roomName].terminal == null) {
                Memory[roomName].terminal = {}
                console.log("Created Memory for terminal in " + roomName)

            }
            //console.log("Num of spawns " + Memory[roomName].spawns)
            //Memory[roomName].spawns = null
            if (Memory[roomName].spawns == null) {
                Memory[roomName].spawns = {};
                var spawns = room.find(FIND_STRUCTURES).filter(structure => [STRUCTURE_SPAWN].indexOf(structure.structureType) !== -1);
                Memory[roomName].spawns = spawns;
                console.log("Created Memory for spawns in " + roomName)

            }
            if (Memory[roomName].sources == null) {
                console.log(roomName + " Sources empty")
                var sources = room.find(FIND_SOURCES)
                Memory[roomName].sources = sources;
                Memory[roomName].sources.total = sources.length;
                console.log("Created Memory for sources in " + room)

            }
        }
    }
    ,
    createCreepMem: function () {
        //outside
        Memory.outside.creeps = {};
        Memory.outside.creeps.total = 0;

        //rooms
        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
            Memory[roomName].creeps = {};
            Memory[roomName].creeps.total = 0;
        }
    }
    ,
    updateCreepMem: function () {
        this.createCreepMem();
        for (let creepName in Game.creeps) {
            var creep = Game.creeps[creepName];
            let role = creep.memory.role;
            let team = creep.memory.team;
            let type = role + "_" + team;
            //console.log(creep.room.controller)
            if (!creep.room.controller || !creep.room.controller.my) {
                //console.log("outside");
                if (!Memory.outside.creeps[type]) {
                    Memory.outside.creeps[type] = 1;
                } else {
                    Memory.outside.creeps[type]++;
                }
            } else {
                var room = creep.room.name;
                //console.log(creep.room)

                Memory[room].creeps.total++
                if (!Memory[room].creeps[type]) {
                    Memory[room].creeps[type] = 1;
                } else {
                    Memory[room].creeps[type]++;
                }
            }
        }


        //outside

        //rooms
    }
    ,
    updateRepairMem: function (room) {
        var roomName = room.name;

        //find things to be repaired
        var targets = room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
                || (object.structureType == "constructedWall" && object.hits < 50000)
                && object.hits < 50000
        });
        //console.log(roomName + " repairs: " + targets)
        if (targets.length < 1) {
            //console.log("Nothing to repair in " + roomName);
        } else {
            //console.log("repairs" + targets);
            //sorted least hits/hitsmax to most
            targets.sort((a, b) => a.hitsMax - b.hitsMax);

            //find just containers that need to be repaired
            //var containers = 
            Memory[room.name].repairs.toBeRepaired = targets.filter(structure => structure.structureType != STRUCTURE_CONTAINER);
            Memory[room.name].repairs.toBeRepairedContainers = targets.filter(structure => structure.structureType == STRUCTURE_CONTAINER);
        }

    }
    ,
    updateConstructionMem: function (room) {
        var roomName = room.name;
        var targets = room.find(FIND_CONSTRUCTION_SITES);
        Memory[roomName].constructionSites.all = targets;


        /*for (var site in Memory[roomName].constructionSites.all) {
    //console.log(site + " " + Memory[roomName].constructionSites.all[site])
	
    if(Memory[roomName].constructionSites.all[site]){
        var thisSite = Memory[roomName].constructionSites.all[site]
    }
    //console.log(!Game.getObjectById(thisSite.id));
    //console.log(thisSite.progress == null)
    if (!thisSite  ||!Game.getObjectById(thisSite.id)|| thisSite.progress == null ) {
        delete Memory[roomName].constructionSites.all;
        console.log("deleting a construction site from memory")
    }
}*/
    }
    ,
    getConstructionSites: function (room) {
        var roomName = room.name;
        var constructionSites = [];
        for (var i in Memory[roomName].constructionSites.all) {
            constructionSites.push(Game.getObjectById(Memory[roomName].constructionSites.all[i].id));
        }
        //console.log(roomName + " " + towers)
        return constructionSites;
    }
    ,
    updateContainersMem: function (room) {
        var storage = room.find(FIND_STRUCTURES, {
            filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE)
        });
        // console.log("Containers " + room.name + " " + storage)
        var justContainers = [];
        var justStorages = [];
        for (var i = 0; i < storage.length; i++) {
            if (storage[i].structureType === STRUCTURE_CONTAINER) {
                justContainers.push(storage[i]);
            } else if (storage[i].structureType === STRUCTURE_STORAGE) {
                justStorages.push(storage[i]);
            }
            //console.log(justContainers);
            //console.log(justStorage);
        }
        Memory[room.name].storage.containers = justContainers;
        Memory[room.name].storage.storages = justStorages;
        Memory[room.name].storage.total = storage.length;


    }
    ,
    updateTowerMem: function (room) {
        var roomName = room.name;

        var towers = room.find(FIND_STRUCTURES,
            {
                filter: (structure) => structure.structureType == STRUCTURE_TOWER
                    && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY)
            });
        Memory[roomName].towers = towers;
    }
    ,
    updateLinkMem(room) {
        var roomName = room.name
        var links = room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK })
        Memory[roomName].links.total = links.length
        Memory[roomName].links.all = links;
    }
    ,
    clearMemory: function () {
        //Consider using this method instead of resetting memory every mem update
        for (var name in Memory.creeps) {
            //clear dead creeps from memory
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        //delete Memory.constructionSites;
    }
    ,
    updateSpawnMem(room) {
        var roomName = room.name;
        Memory[roomName].spawns = {};
        var spawns = []
        for (let spawnName in Game.spawns) {
            //console.log(spawnName)
            //check if spawn is in current room
            if (Game.spawns[spawnName].room == room) {
                spawns.push(Game.spawns[spawnName]);
            }
        }
        Memory[roomName].spawns = spawns;
    }
    ,
    getNumCreeps: function (room, role) {
        if (!room) {
            if (Memory.outside.creeps[role]) {
                //console.log("outside "+ role+" creeps " +Memory.outside.creeps[role])
                return Memory.outside.creeps[role];

            }
        } else if (Memory[room.name].creeps[role]) {
            //console.log(room.name)

            return Memory[room.name].creeps[role];
        }
        return 0;
    }
    ,
    getTowers: function (room) {
        var roomName = room.name;
        var towers = [];
        for (var i in Memory[roomName].towers) {
            towers.push(Game.getObjectById(Memory[roomName].towers[i].id));
        }
        //console.log(roomName + " " + towers)
        return towers;
    }
    ,
    setRoomRes: function (room) {
        roomName = room.name
        if (!Memory[roomName].terminal.roomRes) {
            var minerals = room.find(FIND_MINERALS);
            //console.log(minerals);
            Memory[roomName].terminal.roomRes = minerals;
        }
    }
    ,
    updateExtensions: function (room) {
        let roomName = room.name;
        var extensions = room.find(FIND_STRUCTURES).filter(i => i.structureType == STRUCTURE_EXTENSION).filter(i => i.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
        Memory[roomName].extensions = extensions;
    }
    ,
    getExtensions: function(room){
        let roomName = room.name;
        var extensions = [];
        for(var i in Memory[roomName].extensions){
            extensions.push(Game.getObjectById(Memory[roomName].extensions[i].id));
        }
        return extensions
    }
};

module.exports = memMgr;
