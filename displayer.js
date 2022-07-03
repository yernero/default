var mgr = require("mgr");
var displayer = {
    displayStats: function (myRoom) {
        mgr.updateCreepMem(myRoom);
        var room = myRoom.name;

        console.log('\n\n\n----------------------------------------------');
        //check cpu stored
        console.log(Game.cpu.bucket + "/5000 new pixel");
        //check energy and creeps
        console.log(myRoom.energyAvailable + " at " + Game.time + " with " + Memory[room].creeps["Total"] + "/20 creeps");
        for(var role in Memory[room].creeps){
            console.log(role  + ": "  + Memory[room].creeps[role]);
        }
        console.log("----------------------------------------------")
    }

}



module.exports = displayer;