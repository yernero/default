var fillContainers = require("fill.containers");

var fillLinks = {
    /** @param {Creep} creep **/
    run: function (creep) {
        var room = creep.room;
		var roomName = room.name;
		var upgradeLink = Game.getObjectById(Memory[roomName].links.upgradeLink);
        var storageLink = Game.getObjectById(Memory[roomName].links.storageLink);

        //creep must already have a link defined in memory
        if (creep.memory.link == null) {
            console.log(creep.name + " needs a link");
            //creep.memory.role = "builder"
        } else {
            var link = Game.getObjectById(creep.memory.link);
            // console.log(Game.getObjectById(creep.memory.link));
            var status = creep.transfer(link,RESOURCE_ENERGY)
            switch (status) {
                case 0:
                    //successful
                    break;
                case -6:
                    //creep does not have the materials to do this
                break;
                case -9:
                    //not in range
                    creep.moveTo(link);
                    break;
                case -7:
                    console.log("Invalid Link reference " +creep.memory.link);
                case -8:
                    //full link
                    fillContainers.run(creep)
                    break;
                default:
                    //console.log(status);
                    console.log("Unknown Error in Fill Links: "  +status);
            }
            //console.log(links);

        }

    }
};

module.exports = fillLinks;