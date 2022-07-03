var mgr = {
    createMem: function (Room) {
        //console.log("test")
        //declare memory variables
        if (Memory.links == null) {
            Memory.links = {};
            Memory.links.upgradeLink = "61ea04390bd2bf1717dc4e56";

        }
        if (Memory.repairs == null) {
            Memory.repairs = {};
        }
        if (Memory.storage == null) {
            Memory.storage = {};
        }
        if (Memory.constructionSites == null) {
            Memory.constructionSites = {};
        }
        if (Memory.terminal == null) {
            Memory.terminal = myRoom.terminal;
        }
        if (Memory.rooms == null || Memory.rooms.myRooms == null) {
            Memory.rooms = {};
            Memory.rooms.myRooms = {};
        }

        if (Memory.sources == null) {
            Memory.sources = {};
        }

        if (Memory.sources == null) {
            Memory.sources = {};
            var sources = myRoom.find(FIND_SOURCES);
            for (let i = 0; i < sources.length; i++) {
                Memory.sources.i = sources[i].id;
            }

        }
    }
};

module.exports = mgr;