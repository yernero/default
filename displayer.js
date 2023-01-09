var mgr = require("mgr");
var marketMgr = require("mgr.market");
var displayer = {
    displayAll: function () {
        console.log('----------------------------------------------');
        console.log(Game.cpu.bucket + "/10000 new pixel");
        if (Game.cpu.bucket > 10000) {
            console.log(Game.cpu.generatePixel());
        }
        // mgr.updateCreepMem("outside");

        console.log("Outside Creeps: " + Memory.outside.creeps.total)
        var outsideInfo = ""
        for (var role in Memory.outside.creeps) {
            if (role != "total") {
                outsideInfo += role + ": " + Memory.outside.creeps[role] + "|"
            }
        }
        //for each room owned
        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];

            if (room.controller && room.controller.my) {
                roomLevel = "Level: " + room.controller.level;
                if (room.controller.level === 8) {
                    roomLevel = "Level: MAX";
                }


                //Game.time
                var header = roomName + "- Energy: " + room.energyAvailable + " Creeps: " + Memory[roomName].creeps.total + " " + roomLevel + "\n"
                //console.log(room.energyAvailable + " in " + roomName + " at " + Game.time + " with " + Memory[roomName].creeps["Total"] + "/20 creeps");

                var roomInfo = "";
                for (var role in Memory[roomName].creeps) {
                    if (role != "total") {
                        roomInfo += role + ": " + Memory[roomName].creeps[role] + " | ";

                    }
                }

                console.log(header + roomInfo)
                //market

                marketMgr.manageRoomRes(room);
                


            }



        }
        console.log("----------------------------------------------")
    },
    spawning: function (room) {
        //display when a new screep is spawning
        var roomName = room.name;
        for (var i in Memory[roomName].spawns) {
            var spawn = Game.spawns[Memory[roomName].spawns[i].name]
            // console.log("spawn " + spawn)
            if (spawn.spawning) {
                var creep = Game.creeps[spawn.spawning.name]
                //console.log("spawning creep " + creep)
                spawn.room.visual.text(
                    '🛠️' + creep.memory.role,
                    spawn.pos.x + 1,
                    spawn.pos.y,
                    { align: 'left', opacity: .8 }
                )
            }
        }
    }

}



module.exports = displayer;