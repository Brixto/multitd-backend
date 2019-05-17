var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const { spawn } = require('child_process');
const psList = require('ps-list');
const getPort = require('get-port');

var servers = [];

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/spawn', async (req, res) => {
    var port = await getPort({ port: getPort.makeRange(3001, 3200) })
    const child = spawn('/src/multitd-build/multitd.x86_64', ['-batchmode', '-nographics', '-port', port]);
    servers.push({ server: child, status: 'pending', port: port });

    console.log('started server on port ' + port);

    res.send(port.toString());
});

app.get('/ps', async (req, res) => {
    var pslist = await psList();
    pslist = pslist.filter(ps => ps.name === 'multitd.x86_64')
    res.send(pslist)
});

app.get('/servers', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    console.log('instance connected');
    socket.on('started', (port) => {
        getServer(port).status = 'started';
        socket.emit('serverupdate', servers);
        console.log('instance started');
    });

    socket.on('getservers', () => {
        socket.emit('serverupdate', servers);
    });

    // socket.on('gameend', (port) => {
    //     server = getServer(port).child;
    //     server.kill();
    // });
})

function getServer(port) {
    servers.forEach(server => {
        if (server.port === port) return server;
    });
}

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
