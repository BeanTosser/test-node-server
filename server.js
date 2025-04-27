var http = require('http');
var fs = require('fs');
var url = require('url');
var sqlOperations = require('./SqlOperations.js');

http.createServer(async function (req, res) {
    let body = [];
    let queryData = url.parse(req.url, true).query;
    console.log("URL: " + req.url);
    console.log("Sliced url: " + req.url.slice(0,10));
    if(req.url.slice(0,10) === "/prisoners"){
        console.log("We SHOULD be attempting to query the database now.")
        if(queryData.name){
            console.log("The query has a name");
            sqlOperations.getNamedPrisoner(queryData.name, function(queryResponse){
                console.log("Got named prisoner: " + queryResponse);
                res.setHeader('Content-Type', 'application/json');
                console.log("Set the header.");
                res.write(JSON.stringify(queryResponse));
                console.log("Wrote the response");
                res.on('error', (err) => {
                    console.error(err);
                });
                res.end();
            });
        }else {
            console.log("Query doesn't have a name.");
        }

    } else if (req.url === "/"){
        res.writeHead(200, {"content-type": "text/html"});
        fs.createReadStream('index.html').pipe(res);
    } else {
        res.writeHead(404, {});
        res.end();
    }
    /*req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        const responseBody = {headers, method, url, body};
        res.write(JSON.stringify(responseBody));
        res.on('error', (err) => {
            console.error(err);
        });

        res.end();

    })*/
    //res.writeHead(200, { 'content-type': 'text/html' });
    //fs.createReadStream("index.html").pipe(res);

}).listen(8080);