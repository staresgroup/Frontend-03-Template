let http = require('http');
let fs = require('fs');
let archiver = require('archiver');


let request = http.request({
    hostname: '127.0.0.1',
    port: 8082,
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream',
    }
}, response => {
    console.log(response);
})

// let file = fs.createReadStream("./sample.html");

const archive = archiver('zip', {
    zlib: { leverl: 9 }
});

archive.directory('sample/', false);

archive.pipe(fs.createWriteStream('tmp.zip'));

archive.finalize();

archive.pipe(request);

