var displayer = {
    displayStats: function (Room) {
        var fillers = _.filter(Game.creeps, (creep) => creep.memory.role == "filler");
        var linkFillers = _.filter(Game.creeps, (creep) => creep.memory.role == "linkFiller");
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => (creep.memory.role == 'upgrader' || creep.memory.role == 'linkUpgrader'));
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        var settlers = _.filter(Game.creeps, (creep) => creep.memory.role == "settler");
        var importers = _.filter(Game.creeps, (creep) => creep.memory.role == "importer");
        var towerGuards = _.filter(Game.creeps, (creep) => creep.memory.role == "towerGuard");
        var sourceFarmers = _.filter(Game.creeps, (creep) => creep.memory.role == "sourceFarmer");
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == "miner");
        //Teams
        var Hteam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "harvester");
        var Bteam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "builder");
        var sfTeam0 = _.filter(Game.creeps, (creep) => creep.memory.team == 0 && creep.memory.role == "sourceFarmer")
        var sfTeam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "sourceFarmer")
        var RTeam0 = _.filter(Game.creeps, (creep) => creep.memory.team == 0 && creep.memory.role == "repairer")
        var RTeam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "repairer")
        var LFTeam0 = _.filter(Game.creeps, (creep) => creep.memory.team == 0 && creep.memory.role == "linkFiller");
        var LFTeam1 = _.filter(Game.creeps, (creep) => creep.memory.team == 1 && creep.memory.role == "linkFiller");
       


        if (Game.time % 5 == 0) {
            console.log('\n\n\n----------------------------------------------');
            //check cpu stored
            console.log(Game.cpu.bucket + "/5000 new pixel");
            //check energy and creeps
            console.log(myRoom.energyAvailable + " at " + Game.time + " with " + countCreeps + "/20 creeps");
            //check roles
            console.log("Source Farmers: " + sourceFarmers.length +
                " T0: " + sfTeam0.length + " T1: " + sfTeam1.length +
                "\tFillers: " + fillers.length +
                "\tLink Fillers: " + linkFillers.length +
                '\tHarvesters: ' + harvesters.length +
                " T0: " + Hteam1.length + " T1: " + Hteam1.length +
                "\tTower Guards: " + towerGuards.length +
                '\tUpgraders: ' + upgraders.length + "\n" +
                '\Builders: ' + builders.length +
                " T0: " + Bteam1.length + " T1: " + Bteam1.length +
                '\tRepairers: ' + repairers.length +
                " T0: " + RTeam0.length + " T1: " + RTeam1.length +
                "\tSettlers: " + settlers.length +
                "\tImports: " + importers.length);
            //check teams
            console.log("Team 1 Harvesters: " + Hteam1.length + " Miners : " + miners.length);
            //Game.spawns['a'].spawnCreep([WORK,CARRY,CARRY,MOVE], "towerGuard",{memory: {role: 'towerGuard'}});
            console.log("----------------------------------------------")
        }
    }
}
var mgr = require("mgr");
var displayer = {
    displayAll: function () {
        console.log('\n\n\n----------------------------------------------\n');
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
            var roomLevel = "Level: " + room.controller.level;
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