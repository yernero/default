var defMgr = {
    guard: function (room) {
        var roomName = room.name;
        var enemies = room.find(FIND_HOSTILE_CREEPS);
        var towers = room.find(FIND_STRUCTURES, {
            filter: x => x.structureType === STRUCTURE_TOWER && x.store.getUsedCapacity(RESOURCE_ENERGY) > 10
        })
        //console.log(room.name + " "  +towers)
        //check if towers exist


        if (towers.length > 0) {
            for (let i in towers) {
                var tower = Game.getObjectById(towers[i].id)
                if (enemies.length > 0) {
                    //if towers exist then use towers
                    //console.log(tower)
                    tower.attack(enemies[0]);

                } else if (tower.store.getUsedCapacity(RESOURCE_ENERGY) > 400) {
                    //console.log("reparing")
                    /////fix
                    var nextRepair = Memory[roomName].repairs.toBeRepaired[0];
                    if (nextRepair) {
                        var repair = Game.getObjectById(Memory[room.name].repairs.toBeRepaired[0].id);
                        //console.log(repair.hits/repair.hitsMax)
                        //repair stuff
                        if (repair && repair.structureType != "constructedWall" && repair.structureType != "rampart") {
                            var status = tower.repair(repair)
                            //console.log(status);
                            switch (status) {
                                case 0:

                                    break;
                                case -6:
                                    console.log("hmm")
                                    //out of energy so spawn more towerGuards
                                    break;
                                default:
                                    console.log("Issue with tower repairing " + status);
                            }
                        }
                    } else {
                        //nothing to repair
                    }

                }
            }

        } else {
            //if towers dont exist, attempt to build one & a defender creep

        }





    }
}
module.exports = defMgr;
