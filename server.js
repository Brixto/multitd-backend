var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const { spawn } = require('child_process');
const getPort = require('get-port');

var servers = [];

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
});

function getServer(port) {
    return servers.find(s => s.port.toString() === port);
}

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
