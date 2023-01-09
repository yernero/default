var roleUpgrader = require("role.upgrader");
var roleHarvester = {

  /** @param {Creep} creep **/
  run: function (creep) {
    var room = creep.room;
    var roomName = room.name;
    
    if (creep.memory.storing) {
      if (creep.store.energy == 0) {
        creep.memory.storing = false;
        creep.say('🔄');
      } else {
        var targets = creep.room.find(FIND_STRUCTURES).filter(structure => [STRUCTURE_STORAGE].indexOf(structure.structureType) !== -1).filter(structure => structure.store.energy < structure.store.getCapacity());
        //console.log("test" +targets);
        if (targets.length < 1) {
          targets = creep.room.find(FIND_STRUCTURES).filter(structure => [STRUCTURE_SPAWN, STRUCTURE_EXTENSION].indexOf(structure.structureType) !== -1).filter(structure => structure.store.energy < structure.store.getCapacity(RESOURCE_ENERGY));
          //console.log(targets);

          if (creep.room.energyAvailable == creep.room.energyCapacityAvailable) {
            roleUpgrader.run(creep);
          } else {
            targets.sort((a, b) => b.store.getCapacity() - a.store.getCapacity());
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#FFFFFF' } });
            }
          }
        } else {
          //console.log(targets);

          if (targets.length > 1 && creep.memory.team == 1) {
            //console.log(targets);
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#FFFFFF' } });
            }
          } else {
            targets.sort((a, b) => b.store.getCapacity() - a.store.getCapacity());

            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#FFFFFF' } });
            }
          }
        }
      }
    } else {
      //make sure memory created
      creep.memory.storing = false;
      //changing status
      if (creep.store.energy == creep.store.getCapacity(RESOURCE_ENERGY)) {
        creep.memory.storing = true;
        creep.say('⚡');
      } else {
        var sources;// = creep.room.find(FIND_SOURCES);
        //.log("Sources in " + creep.room + " " + sources)

        //team 1
        if (creep.memory.team == 1) {
          if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#FFC0CB' } });
          }
          //team 0
        } else {
          //console.log(creep.harvest(sources[0]))
          //creep.harvest(sources[1]) === ERR_NOT_IN_RANGE
          if (sources) {
            creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#FFC0CB' } });
          } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
              filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                i.store[RESOURCE_ENERGY] > 50
            });
            //console.log("Available energy" + targets);
            if (targets.length > 1) {
              if (creep.withdraw(targets[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[1], { visualizePathStyle: { stroke: '#ffffff' } });
              }

            } else if (targets.length == 1) {
              if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
              }
            } else {
              var sources = creep.room.find(FIND_SOURCES);
              if (creep.harvest(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffffff' } });
              }
            }
          }
        }
      }
    }
  }
};

module.exports = roleHarvester;
