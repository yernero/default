
var fillContainers = {
    /** @param {Creep} creep **/
    run: function (creep) {
        var room = creep.room;
        var roomName = room.name;

        /*var targets = creep.room.find(FIND_STRUCTURES).filter(
            structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                structure.structureType) !== -1).filter(
                    structure => structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);*/
        var targets = [];
        for (var i in Memory[roomName].storage.containers) {
            targets.push(Game.getObjectById(Memory[roomName].storage.containers[i].id));
        }
        for (var i in Memory[roomName].storage.storages) {
            targets.push(Game.getObjectById(Memory[roomName].storage.storages[i].id));

        }
        //console.log(roomName + " targets " + targets);

        if (targets.length == 0) {
            console.log("Out of storage")
            console.log(creep.room + " " + targets)
             // console.log(" team 1 out")
             targets = creep.room.find(FIND_STRUCTURES).filter(
                structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(
                    structure.structureType) !== -1).filter(
                        structure => structure.store.energy < structure.store.getCapacity());
          
        } else {
           
            //console.log(creep.room + " " + targets)
           
            //current container is chosen manually from structures less than 2 spots away, need to find closest container. 
            //console.log(targets[0]);
            if(!creep.memory.mineral){
                creep.memory.mineral = RESOURCE_ENERGY;
            }
            var status = creep.transfer(targets[0], creep.memory.mineral);
            switch (status) {
                case -9:
                    creep.moveTo(targets[targets.length - 1]);
                    break;
                case 0:
                    break;
                case -6:
                    //doesnt have res
                    break;
                case -7:
                    //when the room level is too low for the storage
                    console.log("Room level too low for storage")
                    break;
                case -8://full
                    console.log("Room Full");
                    break;
                default:
                    console.log(status + " Error filling container for " + creep.name)
            }

            if (creep.memory.team === 0) {

            } else if (creep.memory.team === 1) {

            }
        }



    }
};

module.exports = fillContainers;