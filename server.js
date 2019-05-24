var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const { spawn } = require('child_process');
const getPort = require('get-port');
var PF = require('pathfinding');

var servers = [];

var spawnPoint = { x: 0, y: 0 };
var destination = { x: 1, y: 1 };
var minion = spawnPoint;

var grid = new PF.Grid(16, 16);
var finder = new PF.AStarFinder();
var path = finder.findPath(spawnPoint.x, spawnPoint.y, destination.x, destination.y, grid);

for (i = 0; i < path.length; ++i) {
    console.log(path[i][0]);
}

console.log(path)
console.log(path[1]);

setInterval(() => moveTowards(minion, pathToVector(path[1])), 1000 / 1);

function pathToVector(path) {
    return { x: path[0], y: path[1] };
}

function moveTowards(current, destination, maxDistance) {
    let speed = 0.1;
    let dx = (destination.x - current.x);
    let dy = (destination.y - current.y);

    let angle = Math.atan2(dy, dx);
    let velX = Math.cos(angle) * speed;
    let velY = Math.sin(angle) * speed;

    // check if overshooting target
    if (dx * dx + dy * dy < speed * speed) {
        velX = dx;
        velY = dy;
    }
    current.x = current.x += velX;
    current.y = current.y += velY;
    console.log(current);
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/spawn', async (req, res) => {
    var port = await getPort({ port: getPort.makeRange(3001, 3200) })
    const child = spawn('/src/multitd-build/multitd.x86_64', ['-batchmode', '-nographics', '-port', port]);
    servers.push({ status: 'starting up', port: port });
    io.sockets.emit('serverupdate', servers);
    console.log('started server on port ' + port);

    res.send(port.toString());
});

app.get('/servers', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

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

    // socket.on('gameend', (port) => {
    //     server = getServer(port).child;
    //     server.kill();
    // });
    console.log('connected');
    socket.emit('spawn', '0', '0');

    setInterval(() => {
        //path[0].
        //socket.emit('update')
    }, 1000);
});

function getServer(port) {
    return servers.find(s => s.port.toString() === port);
}

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
