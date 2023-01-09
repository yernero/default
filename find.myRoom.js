var findMyRoom = {

    /** @param {Creep} creep **/
    run: function () {
        //checks if roomName is in memory
        if (_.has(Memory.rooms, 'myRooms')) {
            //If roomName is stored, convert into a room for myRoom
            //console.log("here"  +myRoom)
            myRoom = Game.rooms[Memory.rooms.myRooms[0]];
            //console.log("After " +myRoom)
        } else {
            //searches every room 
            for (let key in Game.rooms) {
                let room = Game.rooms[key]
                //checks if room has a controller and is controlled by me
                if (room.controller && room.controller.my) {
                    console.log(room.name)
                    //stores room name
                    if (_.has(Memory, "rooms")) {
                        if (_.has(Memory.rooms, "myRooms")) {
                            var myRooms = Memory.rooms.myRooms;
                            //myRooms[0] = key;
                            myRoom = Game.rooms[key];
                            //console.log(Memory.rooms.myRooms[0]);
                        } else {
                            Memory.rooms.myRooms = {};
                        }  
                    } else {
                        Memory.rooms = {};

                    }

                }
            }
            //finds room and puts in myRoom without using memory
            /*
            for (let key in Game.rooms) {
               let room = Game.rooms[key]
               if (room.controller && room.controller.my) {
                   myRoom = room;
                   break;
               }
           }*/
        }
        //console.log(myRoom)
        return myRoom
    }
};

module.exports = findMyRoom;