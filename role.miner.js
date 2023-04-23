var collect = require("collect");
var fill = require("fill");
var roleMiner = {
    /**@param {creep} creep **/
    run: function (creep) {
        //console.log(creep.pos)
        var room = creep.room;
        var roomName = room.name;
        var terminal = creep.room.terminal;
        var mineral = creep.memory.mineral;
        //console.log("miner location"  +creep.pos)
        var resAmt = terminal.store.getUsedCapacity(mineral)
        var eAmt = terminal.store.getUsedCapacity(RESOURCE_ENERGY);

        //find mine
        if (!creep.memory.mine) {
            var minerals = creep.room.find(FIND_MINERALS);
            creep.memory.mineral = minerals[0].mineralType;
            creep.memory.mine = minerals[0].id;
        }

        var mine = Game.getObjectById(creep.memory.mine);
        //console.log(mineral + ": " + resAmt + ", Energy: " + eAmt + ", terminal: " + terminal.store.getCapacity())

        if (resAmt < terminal.store.getCapacity() / 3) {
            console.log("lacking minerals")
            if (creep.memory.mining) {
                if (creep.store.getFreeCapacity() > 0) {
                    console.log("uhhh")
                    mine(creep);
                } else {
                    //store minerals
                    creep.memory.mining = false;
                    creep.say("Full");
                }

            } else {

                //auto setting mining status at start

                creep.memory.mining = false;
                for (let resourceType in creep.store) {
                    //console.log("res: " +resourceType)
                    fill.fillTerminals(creep);
                }

                /*                 //check if the creep is adding energy
                                if (creep.memory.fillEnergy) {
                                    fill.fillTerminals(creep);
                
                                    creep.memory.fillEnergy = false;
                                    //if terminal has energy we can fill
                                    if (terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 5000) {
                                        if (creep.store.getUsedCapacity(creep.memory.mineral) > 0) {
                                            fill.fillTerminals(creep);
                                            creep.say("Mine");
                                        }
                                    } else {
                                        creep.drop(creep.memory.mineral)
                                        creep.drop(RESOURCE_ENERGY)
                                        console.log("terminal too full")
                                        fill.withdrawAndDropTerm(creep)
                                        creep.memory.fillEnergy = true;
                
                                    }
                                } else {
                
                                    if (creep.room.terminal.store.getFreeCapacity() > 5000) {
                                        creep.memory.mining = false;
                                        //should not hold energy
                                        //creep.drop(RESOURCE_ENERGY);
                                        //has materials
                                        if (creep.store.getUsedCapacity() > 0 && creep.room.terminal.store.getFreeCapacity() > 2000) {
                                            fill.fillTerminals(creep);
                                        } else {//out of materials
                                            //mine again
                                            creep.memory.mining = true;
                                            creep.say("Mine");
                                        }
                                    } else {
                                        console.log("terminal too full")
                
                                        fill.withdrawAndDropTerm(creep)
                                    }
                                }
                */
            }


            //lacking energy
        } else if (eAmt < terminal.store.getCapacity() / 3) {

            if (creep.memory.mining) {
                if (creep.store.getFreeCapacity() > 0) {
                    collect.containers(creep);
                } else {
                    //store minerals
                    creep.memory.mining = false;
                    creep.say("Full");
                }

            } else {
                if (creep.store.getUsedCapacity() != 0) {
                    for (let resourceType in creep.store) {
                        //console.log("res: " +resourceType)
                        fill.fillTerminals(creep);
                    }

                } else {
                    creep.memory.mining = true;
                    creep.say("empty")

                }
                //auto setting mining status at start

            }
        } else {
            console.log("Terminal in " + roomName + " is 1/3 " + mineral + " & 1/3 Energy");

        }
    }
    ,
    mine: function (creep) {
        switch (creep.harvest(mine)) {
            case 0:
                //successful
                //finding and setting mineStorage
                if (creep.memory.mine.mineStorage == null) {
                    var storage = creep.room.find(FIND_STRUCTURES,
                        {
                            filter: (i) => (i.structureType == STRUCTURE_CONTAINER
                                || i.structureType == STRUCTURE_STORAGE)
                        });
                    storage.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
                    //console.log(storage[0]);

                    creep.memory.mine.mineStorage = storage[0].id;
                }
                //creep.memory.fillTerm = false;
                //Memory[creep.room.name].mineralEmpty = false;
                break;
            case -5://Extractor not found.
                Memory[roomName].terminal.extractor = false;
                console.log("Build an extractor in " + creep.room.name);
                break;
            case -6://The target does not contain any harvestable energy or mineral
                creep.memory.mine.empty = true;
            case -9: //The target is too far away.
                //move to mine
                creep.moveTo(mine);
                break;
            case -11://The extractor or the deposit is still cooling down.
                //creep is tired, ignore
                break;
            default:
                console.log(creep.harvest(minerals[0]) + " by " + creep.memory.name + " in " + creep.room.name)
                console.log("unknown Error in miner harvest, investigate")
                break;
        }
    }
};

module.exports = roleMiner;