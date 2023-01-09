var roleUpgrader = require("role.upgrader");

var roleSettler = {


	run: function (creep) {

		if(!creep.memory.inRoom){
			creep.memory.inRoom = false;
		}
		if (creep.memory.rotate) {
			creep.say('🔄 Im here');
			creep.memory.rotate = false
		} else {
			creep.say("for spice");
			creep.memory.rotate = true;
		}
		//console.log(creep.room.name)
		if(creep.memory.inRoom){
			console.log("settler" + creep.room.controller.my)
			if(creep.room.controller.my){
				
				creep.memory.role = "upgrader"
			}
			
			if (creep.room.controller.isActive()) {

				if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffaa00', lineStyle: 'dotted' } });
				}
			}
		}else{
			var flag = Game.flags.Flag1;
			//console.log(flag.pos.roomName)
			creep.moveTo(new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName), {visualizePathStyle: {stroke: '#00FFFF'}});
			//console.log(creep.moveTo(new RoomPosition(25,20,'w9s53')))
			if(creep.pos.x == flag.pos.x && creep.pos.y == flag.pos.y && creep.room.name === flag.pos.roomName){
				console.log("here");
				creep.memory.inRoom = true;
			}
		}
		/*if (!creep.room.controller.my) {
			console.log("arrived")
			//roleUpgrader.run(creep)
			if (creep.room.controller.isActive()) {

				if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffaa00', lineStyle: 'dotted' } });
				}
			}
		} else {
			creep.moveTo(Game.flags.Flag1, { visualizePathStyle: { stroke: '#ffaa00' } });
		}*/

	}
};
module.exports = roleSettler;