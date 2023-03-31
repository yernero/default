const memMgr = require("./mgr.memory");

var moneyMgr = {
    sellRes: function (room, res) {
        if (!room.terminal) {
            //console.log(room + " does not have " + res)
        } else {
            console.log(room + " trying to sell " + res)
            //console.log("cooldown for selling: " + room.terminal.cooldown)
            //console.log(res)
            //console.log(room.terminal.store.getUsedCapacity(res) )
            //console.log(res + " " +room.terminal.store.getUsedCapacity(res))
            //console.log(room.terminal.cooldown)
            if (room.terminal.store.getUsedCapacity(res) > 1000) {
                console.log(res + " exists")
                buyOrders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: res });
                console.log("Orders" + buyOrders)
                if (buyOrders.length > 0) {
                    buyOrders.sort((orderA, orderB) => orderB.price - orderA.price);
                    orderchoice = 0
                    console.log(buyOrders[0].remainingAmount + " " + room.terminal.store.getUsedCapacity[res])
                    while (buyOrders[0].remainingAmount < room.terminal.store.getUsedCapacity[res]) {
                        console.log("looking for bigger order")
                    }
                    sellAmount = buyOrders[0].remainingAmount;
                    if (buyOrders[0].remainingAmount > room.terminal.store[res]) {
                        sellAmount = room.terminal.store[res];
                    }
                    console.log(Game.market.deal(buyOrders[0].id, sellAmount, room.name));
                    console.log("Sold " + sellAmount + " Utrium at " + buyOrders[0].price + " Total: " + (sellAmount * buyOrders[0].price));

                    //Memory.test = buyOrders[0]; // fast
                    return true;
                } else {
                    console.log("No orders for " + res)
                }

            }
        }
    },
    sellRes: function (room, res, sellAmount) {
        if (!room.terminal) {
            //console.log(room + " does not have " + res)
        } else {
            console.log(room + " trying to sell " + res)
            //console.log("cooldown for selling: " + room.terminal.cooldown)
            //console.log(res)
            //console.log(room.terminal.store.getUsedCapacity(res) )
            //console.log(res + " " +room.terminal.store.getUsedCapacity(res))
            //console.log(room.terminal.cooldown)
            if (room.terminal.store.getUsedCapacity(res) >= sellAmount) {
                // console.log(res + " exists")
                buyOrders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: res });
                if (buyOrders.length > 0) {
                    buyOrders.sort((orderA, orderB) => orderB.price - orderA.price);
                    orderchoice = 0
                    console.log(buyOrders[0].remainingAmount + " " + room.terminal.store.getUsedCapacity[res])
                    while (buyOrders[0].remainingAmount < room.terminal.store.getUsedCapacity[res]) {
                        console.log("looking for bigger order")
                    }
                    sellAmount = buyOrders[0].remainingAmount;
                    if (buyOrders[0].remainingAmount > room.terminal.store[res]) {
                        sellAmount = room.terminal.store[res];
                    }
                    console.log(Game.market.deal(buyOrders[0].id, sellAmount, room.name));
                    console.log("Sold " + sellAmount + " Utrium at " + buyOrders[0].price + " Total: " + (sellAmount * buyOrders[0].price));

                    //Memory.test = buyOrders[0]; // fast
                    return true;
                } else {
                    console.log("No orders for " + res)
                }

            }
        }
    }
    ,
    manageRoomRes: function (room) {
        if (room.terminal) {
            roomName = room.name
            //setup Room Resource
            memMgr.setRoomRes(room);
            var terminal = room.terminal;
            if (terminal.store.getUsedCapacity(RESOURCE_ENERGY) / terminal.store.getCapacity() > 0.2 || terminal.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {

                console.log('Terminal storage is full or energy is more than 1/5 of the total capacity');
                this.sellRes(room, RESOURCE_ENERGY, terminal.store.getUsedCapacity(RESOURCE_ENERGY) / 2)
                this.sellEnergy(room, terminal.store.getUsedCapacity(RESOURCE_ENERGY) / 2)
            } if (terminal.store.getUsedCapacity(Memory[roomName].terminal.roomRes) / terminal.store.getCapacity() > 0.2 || terminal.store.getFreeCapacity(Memory[roomName].terminal.roomRes) === 0) {
                 console.log("Too much res")
            } else {
                console.log('Terminal storage is not full and energy is less than 1/5 of the total capacity');
            }
            var res = Memory[roomName].terminal.roomRes[0].mineralType;
            //console.log(res);

            //check if should sell
            //creep.store.getCapacity()
            var resAmount = room.terminal.store.getUsedCapacity(res);
            //console.log(roomName + " " + res + ": " + resAmount);
            if (resAmount > 10000) {
                this.sellRes(room, res);

            }

            //check if should sell energy
            //find storage unit
            var largestStore = null;
            if (Memory[roomName].storage.storages[0]) {
                largestStore = Game.getObjectById(Memory[room.name].storage.storages[0].id);
            }
            //if terminal  > 50000 energy and can sell, and the storage is more than half full
            if (room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 150000 &&
                room.terminal.cooldown < 1 &&
                largestStore &&
                largestStore.store.getUsedCapacity(RESOURCE_ENERGY) > largestStore.store.getCapacity() / 2) {
                console.log("trying to sell...")
                this.sellRes(room, RESOURCE_ENERGY);
            }

        } else {
            //build a terminal
        }



    },
    sellEnergy: function (room, amount) {
        this.sellRes(room, RESOURCE_ENERGY, amount)


        var myTerminal = Game.getObjectById(room.terminal.id);
        if (myTerminal.store.energy >= amount) {

            var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY &&
                order.type == ORDER_SELL &&
                Game.market.calcTransactionCost(amount, room.name, order.roomName) < myTerminal.store.energy);
            if (orders.length > 0) {
                var result = Game.market.deal(orders[0].id, amount, room.name);
                if (result == OK) {
                    console.log(amount + ' energy successfully sold to ' + orders[0].roomName);
                } else {
                    console.log('Error selling energy: ' + result);
                }
            } else {
                console.log('No suitable sell orders found for energy.');
            }
        } else {
            console.log('Terminal does not have enough energy to sell.');
        }

    }



}
module.exports = moneyMgr;