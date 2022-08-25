var mgr = require("mgr");
const { clearMemory } = require("./mgr");

var memMgr = {
    createRoomsMem: function () {
        //For creeps without a home room
        //Memory.outside = {};
        Memory.outside.creeps = {}
        //All my rooms will be in Game.rooms
        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
            if (!Memory[roomName]) {
                Memory[roomName] = {};
                Memory[roomName].creeps = {};
                Memory[roomName].links = {};
                Memory[roomName].links.upgradeLink = -1;
                Memory[roomName].links.storageLink = -1;
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
            if (Memory[roomName].constructionSites.all = null) {
                console.log("no Construction sites")
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
                console.log(room)
                Memory[roomName].sources = room.find(FIND_SOURCES);
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

        for (let creepName in Game.creeps) {
            var creep = Game.creeps[creepName];
            let role = creep.memory.role;
            let team = creep.memory.team;
            let type = role + "_" + team;
            //console.log(creep.room.controller)
            if (!creep.room.controller || !creep.room.controller.my) {
                //console.log("outside");
                if(!Memory.outside.creeps[type]){
                    Memory.outside.creeps[type] = 1;
                }else{
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
};

module.exports = memMgr;
