
var sources = {
    countEmptyTiles: function (room, source) {
        var surroundingTiles = room.lookAtArea(source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1);
        var count = 0;
        for (var y in surroundingTiles) {
            for (var x in surroundingTiles[y]) {
                var tile = surroundingTiles[y][x];
                for (var j in tile) {
                    var obj = tile[j];
                    if (obj.type == 'terrain' && obj.terrain != 'wall') {
                        count++;
                    }
                }
            }
        }
        return count;
    }
};

module.exports = sources;