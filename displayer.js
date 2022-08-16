var mgr = require("mgr");
var displayer = {
    displayStats: function (myRoom) {
        mgr.updateCreepMem(myRoom);
        //mgr.findStorage(myRoom);

        var room = myRoom.name;

        console.log('\n\n\n----------------------------------------------');
        //check cpu stored
        console.log(Game.cpu.bucket + "/5000 new pixel");
        //check energy and creeps
        console.log(myRoom.energyAvailable + " at " + Game.time + " with " + Memory[room].creeps["Total"] + "/20 creeps");
        
        const creepsU = new Array();
       
        for (var role in Memory[room].creeps) {
            creepsU[role] = Memory[room].creeps[role];
        }
        const creeps = Object.keys(creepsU).sort().reduce(
            (obj, key) => { 
              obj[key] = creepsU[key]; 
              return obj;
            }, 
            {}
          );
        //console.log(creeps)
        for(var role in creeps){
            console.log(role + ": " + creeps[role])
        }
        /*
        for (var role in Memory[room].creeps) {

            console.log(role + ": " + Memory[room].creeps[role]);
        }*/
        console.log("----------------------------------------------")
        mgr.sellRes(myRoom, RESOURCE_UTRIUM);
        //console.log(myRoom.terminal.store.getUsedCapacity(RESOURCE_ENERGY))
        //console.log(Game.getObjectById(Memory[room].storage[0].id));
        let largestStore = Game.getObjectById(Memory[myRoom.name].storage[0].id);
        //mgr.sellRes(myRoom, RESOURCE_ENERGY);
        //if terminal  > 50000 energy and can sell, and the storage is more than half full
        if (myRoom.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 50000 && myRoom.terminal.cooldown < 1 && largestStore.store.getUsedCapacity(RESOURCE_ENERGY) > largestStore.store.getCapacity() / 2) {
            console.log("trying to sell...")
            mgr.sellRes(myRoom, RESOURCE_ENERGY);
        }
        mgr.clearMemory();
    }

}



module.exports = displayer;