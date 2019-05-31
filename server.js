var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const shortid = require('shortid');

var PF = require('pathfinding');
const Vector2 = require('./vector2');

// var spawnPoint = new Vector2(0, 0);
// var destination = new Vector2(8, 3);

var grid = new PF.Grid(18, 28);
var finder = new PF.AStarFinder({ allowDiagonal: true });
//var path = finder.findPath(spawnPoint.x, spawnPoint.y, destination.x, destination.y, grid);

const moveFPS = 60;
const updateTime = 10;

// for (i = 0; i < path.length; ++i) {
//     console.log(path[i][0]);
// }

// console.log(path)
// console.log(path[1]);

var minions = [];

spawnMinion();
setInterval(spawnMinion, 100);
setInterval(moveLoop, 1000 / moveFPS);

setInterval(updateLoop, 1000 / updateTime);

function pathToVector(path) {
    return new Vector2(path[0], path[1]);
}

function generateRandomPath(pos) {
    var dx = Math.floor(Math.random() * 18);
    var dy = Math.floor(Math.random() * 28);
    var destination = new Vector2(dx, dy);
    var gridBackup = grid.clone();
    var path = finder.findPath(pos.x, pos.y, destination.x, destination.y, gridBackup);
    return path;
}

function spawnMinion() {
    var rx = Math.floor(Math.random() * 18);
    var ry = Math.floor(Math.random() * 28);
    var randomSpawn = new Vector2(rx, ry);
    var path = generateRandomPath(randomSpawn);

    var minion = {
        id: shortid.generate(),
        ...randomSpawn,
        i: 0,
        path,
    };
    minions.push(minion);
}

function updateLoop() {
    if (minions.length > 0) {
        var clonedArray = JSON.parse(JSON.stringify(minions))
        clonedArray.forEach(m => delete m.path);
        console.log(minions.length);
        io.sockets.emit('update', clonedArray);
    }
}

function moveLoop() {
    for (var minion of minions) {
        if (minion.i < minion.path.length) {
            var nextPoint = pathToVector(minion.path[minion.i])
            Vector2.moveTowards(minion, nextPoint, 0.02);

            if (minion.x == nextPoint.x && minion.y == nextPoint.y) {
                minion.i += 1;
            }
        } else {
            // reached end
            var index = minions.indexOf(minion);
            if (index > -1) {
                minions[index].path = generateRandomPath(new Vector2(minions[index].x, minions[index].y));
                minions[index].i = 0;
                io.sockets.emit('end', minion.id);
                //minions.splice(index, 1);
            }
        }
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
