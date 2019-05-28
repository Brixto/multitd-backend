var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const shortid = require('shortid');

var PF = require('pathfinding');
const Vector2 = require('./vector2');

var spawnPoint = new Vector2(0, 0);
var destination = new Vector2(8, 3);

var grid = new PF.Grid(16, 16);
var finder = new PF.AStarFinder();
var path = finder.findPath(spawnPoint.x, spawnPoint.y, destination.x, destination.y, grid);

const moveFPS = 20;

// for (i = 0; i < path.length; ++i) {
//     console.log(path[i][0]);
// }

// console.log(path)
// console.log(path[1]);

var minions = [];

spawnMinion();
setInterval(spawnMinion, 5000);
setInterval(moveLoop, 1000 / moveFPS);

function pathToVector(path) {
    return new Vector2(path[0], path[1]);
}

function spawnMinion() {
    var minion = {
        id: shortid.generate(),
        ...spawnPoint,
        i: 0,
    };
    minions.push(minion);
}

function moveLoop() {
    for (var minion of minions) {
        if (minion.i < path.length) {
            var nextPoint = pathToVector(path[minion.i])
            Vector2.moveTowards(minion, nextPoint, 0.1);

            if (minion.x == nextPoint.x && minion.y == nextPoint.y) {
                minion.i += 1;
            }
        } else {
            var index = minions.indexOf(minion);
            if (index > -1) {
                minions.splice(index, 1);
            }
        }
    }
    if (minions.length > 0) {
        console.log(minions);
        io.sockets.emit('update', minions);
    }
}

io.on('connection', socket => {
    socket.on('started', (port) => {
        console.log('started on port ' + port);
        var server = getServer(port);
        server.status = 'waiting for connections';
        io.sockets.emit('serverupdate', servers);
    });

    socket.on('getservers', () => {
        socket.emit('serverupdate', servers);
    });

    socket.on('playerconnected', (numplayers) => {
        console.log('player connected' + numplayers);
    })
});

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
