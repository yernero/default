var mgr = {
    createMem: function (myRoom) {
        let room = myRoom.name;
        //create needed memory for room
        if (Memory[room] == null) {
            Memory[room] = {};
            Memory[room].creeps = {};
            Memory[room].links = {};
            Memory[room].links.upgradeLink = -1;
            Memory[room].links.storageLink = -1;
            Memory[room].repairs = {};
            Memory[room].storage = {};
            Memory[room].constructionSites = {};
            Memory[room].terminal = {};
            Memory[room].spawns = {};
            for (const i in Game.spawns) {
                console.log(Game.spawns[i].room)
                if (Game.spawns[i].room.name == myRoom.name) {
                    if (Memory[room].spawns[0] == null) {
                        Memory[room].spawns[0] = Game.spawns[i];

                    } else {
                        Memory[room].spawns[Object.keys(Memory[myRoom.name].spawns).length] = Game.spawns[i];
                    }
                }
            }
            Memory[room].sources = myRoom.find(FIND_SOURCES);
            console.log("Created Memory for Room " + room)
        }
        //declare memory variables
        if (Memory[room].links == null) {
            Memory[room].links = {};
            Memory[room].links.upgradeLink = -1;
            Memory[room].links.storageLink = -1;
            console.log("Created Memory for Links in " + room)
        }
        if (Memory[room].creeps == null) {
            Memory[room].creeps = {};
            console.log("Created Memory for creeps in " + room)
        }

        if (Memory[room].repairs == null) {
            Memory[room].repairs = {}
            console.log("Created Memory for repairs in " + room)
        }
        if (Memory[room].storage == null) {
            Memory[room].storage = {}
            console.log("Created Memory for storage in " + room)
        }
        if (Memory[room].constructionSites == null) {
            Memory[room].constructionSites = {}
            console.log("Created Memory for constructionSites in " + room)

        }
        if (Memory[room].terminal == null) {
            Memory[room].terminal = {}
            console.log("Created Memory for terminal in " + room)

        }
        if (Memory[room].spawns == null) {
            Memory[room].spawns = {};
            for (const i in Game.spawns) {
                console.log(Game.spawns[i].room)
                if (Game.spawns[i].room.name == myRoom.name) {

                    if (Memory[room].spawns[0] == null) {
                        Memory[room].spawns[0] = Game.spawns[i];

                    } else {
                        Memory[room].spawns[Object.keys(Memory[myRoom.name].spawns).length] = Game.spawns[i];
                    }
                }
            }
            console.log("Created Memory for spawns in " + room)

        }
        if (Memory[room].sources == null) {
            Memory[room].sources = myRoom.find(FIND_SOURCES);
            console.log("Created Memory for sources in " + room)

        }

    },
    updateCreepMem: function (myRoom) {
        let room = myRoom.name;
        Memory[room].creeps = {};
        Memory[room].creeps["Total"] = 0;
        for (var creepName in Game.creeps) {
            var creep = Game.creeps[creepName]
            //console.log(Game.creeps[creep].room);
            //if a creep is in myRoom
            if (creep.room == myRoom) {
                Memory[room].creeps["Total"]++
                //console.log(creep + " is in " + myRoom.name);
                if (Memory[room].creeps[creep.memory.role] == null) {
                    Memory[room].creeps[creep.memory.role] = 1;
                }else{
                    Memory[room].creeps[creep.memory.role]++
                }
            }
        }
    }
};

module.exports = mgr;

