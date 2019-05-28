var express = require('express');
var app = express();
var http = require('http').Server(app);
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
    res.sendFile(__dirname + '/serverlist.html');
});

function getServer(port) {
    return servers.find(s => s.port.toString() === port);
}

http.listen(3001, function () {
    console.log('Example app listening on port 3001!');
});
