var express = require('express');
var app = express();
const { exec } = require('child_process');

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/spawn', (req, res) => {
    console.log('spawn');
    exec('/src/multitd-build/multitd.x86_64 ', (err, stdout, stderr) => {
        console.log(stderr);
        console.log('spawned');
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }

        console.log(`${stdout}`);
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
