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



module.exports = displayer;