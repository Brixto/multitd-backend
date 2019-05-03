var express = require('express');
var app = express();
const { spawn } = require('child_process');
const psList = require('ps-list');
const getPort = require('get-port');

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/spawn', async (req, res) => {
    console.log('spawn');
    var port = await getPort({ port: getPort.makeRange(3001, 3200) })
    const child = spawn('/src/multitd-build/multitd.x86_64', ['-batchmode', '-nographics', '-port', port]);
    child.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`child stderr:\n${data}`);
    });
    res.send(port.toString());
});

app.get('/ps', async (req, res) => {
    var pslist = await psList();
    pslist = pslist.filter(ps => ps.name === 'multitd.x86_64')
    res.send(pslist)
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
