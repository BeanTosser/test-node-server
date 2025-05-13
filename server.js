var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require ('path');

var bcrypt = require('bcrypt');

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
app.use(express.static(path.join(__dirname, "public")));

app.get('/prisoners', async function(req, res) {
    console.log("The query: " + JSON.stringify(req.body));
    if(req.body.name){
        const prisoner = sqlOperations.getNamedPrisoner(req.body.name, function(prisonerData) {

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

app.get('/', async function(req, res) {
    console.log("What a salt looks like: " + (await bcrypt.genSalt(10)).length)
    res.render('home');
})

app.get('/login', function(req, res) {
    res.render('login');
})

app.get('/success', function(req, res){
    res.render('success');
})

app.get('/failure', function(req, res) {
    res.render('failure');
})

app.get('/new_user', function(req, res){
    res.render('new_user');
})

app.post('/new_user', async function(req,res){
    console.log("Attempting to add new user");
    const success = await sqlOperations.addUser(req.body.username, req.body.password);
    if(success){
        console.log("Redirecting");
        res.redirect("/success");
    }
    res.redirect("/failure");
    
})

app.post('/login', async function(req, res) {
    console.log("user tried to login: " + req.body.username + ", " + req.body.password);
    const loginWasSuccessful = await sqlOperations.login(req.body.username, req.body.password);
    if(loginWasSuccessful){
        res.redirect('/success');
    }
    res.redirect('/failure');
})

app.post('/prisoners', function(req, res) {
    console.log("The request body: " + req.body.name);
    res.redirect('/prisoners?name=' + req.body.name);
})

app.all('/{*any}', function(req, res){
    console.log("render all");
    res.render('404');
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})