var mgr = require("mgr");
var displayer = {
    displayAll: function () {
        console.log('\n\n\n----------------------------------------------\n');
        console.log(Game.cpu.bucket + "/10000 new pixel");
        if (Game.cpu.bucket > 10000) {
            console.log(Game.cpu.generatePixel());
        }
       // mgr.updateCreepMem("outside");

        console.log("Outside Creeps: " +Memory.outside.creeps.Total )
        //for each room owned
        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
  
            //Game.time
            var header = roomName + "- Energy: " + room.energyAvailable + " Creeps: " + Memory[roomName].creeps["Total"] + "\n"
            //console.log(room.energyAvailable + " in " + roomName + " at " + Game.time + " with " + Memory[roomName].creeps["Total"] + "/20 creeps");
            const creepsU = new Array();

            for (var role in Memory[roomName].creeps) {
                creepsU[role] = Memory[roomName].creeps[role];
            }
            const creeps = Object.keys(creepsU).sort().reduce(
                (obj, key) => {
                    obj[key] = creepsU[key];
                    return obj;
                },
                {}
            );
            var roomInfo = "";
            for (var role in creeps) {
                roomInfo += role + ": " + creeps[role] + " | "
            }
            console.log(header + roomInfo)
            mgr.sellRes(room, RESOURCE_UTRIUM);
            var largestStore = null;
            if (Memory[roomName].storage[0]) {
                largestStore = Game.getObjectById(Memory[myRoom.name].storage[0].id);
            }
            //if terminal  > 50000 energy and can sell, and the storage is more than half full
            if (room.terminal && room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 50000 && room.terminal.cooldown < 1 && largestStore && largestStore.store.getUsedCapacity(RESOURCE_ENERGY) > largestStore.store.getCapacity() / 2) {
                console.log("trying to sell...")
                mgr.sellRes(room, RESOURCE_ENERGY);
            }

        }
        console.log("----------------------------------------------")
        mgr.clearMemory();
    },
    displayStats: function (myRoom) {
        //mgr.findStorage(myRoom);


        console.log("----------------------------------------------")
        mgr.sellRes(myRoom, RESOURCE_UTRIUM);
        //console.log(myRoom.terminal.store.getUsedCapacity(RESOURCE_ENERGY))
        //console.log(Game.getObjectById(Memory[room].storage[0].id));
        var largestStore = null;
        if (Memory[myRoom.name].storage[0]) {
            largestStore = Game.getObjectById(Memory[myRoom.name].storage[0].id);
        }
        //mgr.sellRes(myRoom, RESOURCE_ENERGY);
        //if terminal  > 50000 energy and can sell, and the storage is more than half full
        if (myRoom.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 50000 && myRoom.terminal.cooldown < 1 && largestStore && largestStore.store.getUsedCapacity(RESOURCE_ENERGY) > largestStore.store.getCapacity() / 2) {
            console.log("trying to sell...")
            mgr.sellRes(myRoom, RESOURCE_ENERGY);
        }
        mgr.clearMemory();
    }

}



module.exports = displayer;