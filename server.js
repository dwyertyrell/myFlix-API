const http = require('http'),
    url = require('url'),
    fs = require('fs');
    
http.createServer((request, response) => {
    let addr = request.url,
        q = new URL(addr, 'http://' + request.headers.host),
        filePath = '';

fs.appendFile('log.txt', 'URL:' + addr + 'Timestamp:' + new Date() + '\n\n)',
(err) => {
    if (err) {
        throw err;
    } else {
        console.log('added to log');
    }
    });

if(q.pathname.includes('documentation')) {

    filePath = (__dirname + '/documentation.html'); 
    } 
 fs.readFile(filePath, (err, data) => {
    if(err) {
        throw err;
    }  
 

    response.writeHead(200, {'context-type':'text/html'});
    response.write(data);
    response.end();
});
}).listen(8080);
console.log('my test server is runing on port 8080');

