var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require ('path');

var util = require('util');

var utilities = require('./utilities/utilities.js');
var sqlOperations = require('./SqlOperations.js');

var ejs = require('ejs');

const express = require("express");
const app = express();
const port = 8080;
// EJS is our templating system; it will make dynamic HTML possible.
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

// allow serving files from the root directory
//app.use(express.static('.'));

app.get('/prisoners', function(req, res) {
    console.log("The query: " + JSON.stringify(req.query));
    if(req.query.name){
        const prisoner = sqlOperations.getNamedPrisoner(req.query.name, function(prisonerData) {
            if(prisonerData === undefined){
                res.render('prisoners', {prisonerWasSubmitted: false, prisonerNotFound: true});
            } else {
                console.log("The prisoner data: " + JSON.stringify(prisonerData[0]));
                res.render('prisoners', Object.assign(prisonerData, {prisonerWasSubmitted: true, prisonerNotFound: false}));
            }
        })
    } else {
        console.log("No prisoner was submitted");
        res.render('prisoners', {prisonerWasSubmitted: false, prisonerNotFound: false});
    }
})

app.post('/prisoners', function(req, res) {
    console.log("The request body: " + req.body.name);
    res.redirect('/prisoners?name=' + req.body.name);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

/*
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

    })
    //res.writeHead(200, { 'content-type': 'text/html' });
    //fs.createReadStream("index.html").pipe(res);

}).listen(8080);
*/