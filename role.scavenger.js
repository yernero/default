var roleScavenger = {

  /** @param {Creep} creep **/
  run: function (creep) {
    //console.log(creep.store.getFreeCapacity);
    var room = creep.room;
    var roomName = room.name;
    if (creep.memory.storing && creep.store.getFreeCapacity() == creep.store.getCapacity()) {
      creep.memory.storing = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.storing && creep.store.getFreeCapacity() == 0) {
      creep.memory.storing = true;
      creep.say('⚡ storing');
    }
    if (!creep.memory.storing) {
      var ruins = creep.room.find(FIND_RUINS);
      //sconsole.log(ruins);
      //ruins = creep.room.getObjectById("5f29b8885eb8e32fb300fa06");
      //console.log(creep.withdraw(ruins[0],RESOURCE_ENERGY));
      var elements = ["GO"];
      for (i = 0; i < elements.length; i++) {
        if (creep.withdraw(ruins[0], elements[i]) == -7) {
          //console.log("help");
        } else {
          //  console.log(creep.withdraw(ruins[0], elements[i]))
          if (creep.withdraw(ruins[0], elements[i]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(ruins[0], { visualizePathStyle: { stroke: '#ffffff' } });
          }
        }
      }
    } else {
      var storage = creep.room.find(FIND_STRUCTURES)
        .filter(structure => [STRUCTURE_CONTAINER].indexOf(structure.structureType) !== -1).filter(structure => structure.store.energy < structure.store.getCapacity());

      //  if(storage[1].store.)
      var elements = ["GO"];
      //console.log(elements[i]);
      for (i = 0; i < elements.length; i++) {
        //   console.log("element: " + elements[i]);
        if (creep.transfer(storage[2], elements[i]) == -7) {

        } else {
          if (creep.transfer(storage[1], elements[i]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage[1], { visualizePathStyle: { stroke: '#ffffff' } });
          }
        }
      }
    }

    /*  if(creep.memory.storing) {
        if(creep.room.energyAvailable == creep.room.energyCapacityAvailable){
          var targets = creep.room.find(FIND_STRUCTURES,{filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE) && structure.store.energy < structure.storeCapacity;}});
        if(targets.length < 1){
          var targets = creep.room.find(FIND_STRUCTURES,
                        {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;}});
        }
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                  }
                }
        }else{
        var targets = creep.room.find(FIND_STRUCTURES,
                {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;}});
        if(targets.length > 0) {
              if(targets.length > 1){
                if(creep.transfer(targets[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(targets[1], {visualizePathStyle: {stroke: '#ffffff'}});
                }
              }else{
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
              }
        }
        }
        }
        else
        {
           var sources = creep.room.find(FIND_SOURCES);
             if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                 creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
             }
        }*/
    //creep.moveTo(Game.flags["home"],{visualizePathStyle: {stroke: '#ffaa00'}});

  }
};

module.exports = roleScavenger;
