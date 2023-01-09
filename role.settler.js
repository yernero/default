var roleUpgrader = require("role.upgrader");

var roleSettler = {


	run: function (creep) {
		var room = creep.room;
		var roomName = room.name;
		var flag = Game.flags.Flag1;

		if (!creep.memory.inRoom) {
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
		if (creep.memory.inRoom) {
			if (creep.room.name != flag.pos.roomName) {
				creep.memory.inRoom = false;
			}
			//console.log("settler" + creep.room.controller.my)
			if (creep.room.controller.my) {
				//console.log("test"  +Memory[creep.room.name].constructionSites.all)
				if (creep.room.controller.level > 1 && Memory[creep.room.name].constructionSites.all[0]) {
					creep.memory.role = "builder"
				} else {
					creep.memory.role = "upgrader"

				}
			} else {
				if (creep.room.controller.isActive()) {
					var status = creep.claimController(room.controller)
					switch (status) {
						case -12:
							creep.memory.role = "upgrader";
							break;
						case 0:
							//good
							break;
						case -9:
							creep.moveTo(room.controller);
							break;
						default:
							console.log(status)

							break;
					}

				}
			}


		} else {
			if (flag) {
				//console.log(flag.pos.roomName)
				creep.moveTo(new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName), { visualizePathStyle: { stroke: '#00FFFF' } });
				//console.log(creep.moveTo(new RoomPosition(25,20,'w9s53')))
				if (creep.room.name === flag.pos.roomName) {
					//console.log("here");
					creep.memory.inRoom = true;
				}
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