var roleUpgrader = require("role.upgrader");
var roleHarvester = {

  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.storing) {
      if (creep.store.energy == 0) {
        creep.memory.storing = false;
        creep.say('🔄');
      } else {
        var targets = creep.room.find(FIND_STRUCTURES).filter(structure => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(structure.structureType) !== -1).filter(structure => structure.store.energy < structure.store.getCapacity());
        //console.log("test");
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
      if (creep.store.energy == creep.store.getCapacity(RESOURCE_ENERGY)) {
        creep.memory.storing = true;
        creep.say('⚡');
      } else {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.memory.team == 1) {
          if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#FFC0CB' } });
          }
        } else if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#FFC0CB' } });
        }
      }
    }
  }
};

module.exports = roleHarvester;
