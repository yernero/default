var fillContainers = require("fill.containers");

var fillLinks = {
    /** @param {Creep} creep **/
    run: function (creep) {
        //creep must already have a link defined in memory
        if (creep.memory.link == null) {
            console.log(creep.name + " needs a link");
        } else {
            var link = Game.getObjectById(creep.memory.link);
            // console.log(Game.getObjectById(creep.memory.link));
            switch (creep.transfer(link, RESOURCE_ENERGY)) {
                case 0:
                    //successful
                    break;
                case -9:
                    //not in range
                    creep.moveTo(link);
                    break;
                case -7:
                    console.log("Invalid Link reference " + Game.getObjectById(creep.memory.link));
                case -8:
                    //full link
                    fillContainers.run(creep)
                    break;
                default:
                    console.log(creep.transfer(link, RESOURCE_ENERGY));
                    console.log("Unknown Error in Fill Links");
            }
            //console.log(links);

        }

    }
};

module.exports = fillLinks;