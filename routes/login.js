/**
 * Created by tushar on 24/6/16.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var app = express();
app.set('jwtTokenSecret', 'hello');
var loggedInUser = require('./LoginUserModel');
var user = require('./UserModel');

function addUserToActiveList(user, response) {

    var token = jwt.encode({
        iss: user.username
    }, app.get('jwtTokenSecret'));
    var loggedIn = new loggedInUser({
        username: user.username,
        token: token
    });
    try {
        loggedIn.save();
        var text = '{ "uuid" : "' + user._id +
            '","username" : "' + user.username +
            '", "status" : "verified" ' +
            ', "token": "' + token + '"' +
            ', "success": "true"}';
        response.json(JSON.parse(text));
    }
    catch (err) {
        console.log(err.message);
    }
}

function writeUserInfoToAdminReport(users, response) {
    var requirement = {
        user: []
    };

    var count = 0;
    for (var i in users) {
        var name = users[i];
        user.findOne({'username': name}, {}, function (err, user) {
            if (err) {
                console.log(err.body);
            }
            requirement.user.push(user);
            count++;
            if (count == users.length) {
                response.json(requirement);
            }
        });
    }
}

function sendReports(response) {
    var users = [];
    try {
        loggedInUser.find().lean().exec(function (err, orphanageList) {
            if (err) return handleError(err);
            for (var i in orphanageList) {
                var item = orphanageList[i];
                users.push(item.username);
            }
            writeUserInfoToAdminReport(users, response);
        })
    }
    catch (err) {
        console.log(err.message);
    }
}

function checkStatusinDb(Json, response) {
    try {
        user.findOne({'username': Json.username}, {}, function (err, user) {
            if (err) return handleError(err);
            if(user==null){
                var notValid='{"success":"false","message":"user not registered"}';
                response.json(JSON.parse(notValid));
            }
            else if (user.status === "verified" && user.password === Json.password) {
                if (user.username === "admin") {
                    sendReports(response);
                }
                else {
                    addUserToActiveList(user, response);
                }
            }
            else {
                var text = '{ "uuid" : "' + user._id +
                    '","username" : "' + Json.username +
                    '", "status" : "verified" ' +
                    ', "token": "null" , "success":"false"}';
                response.json(JSON.parse(text));
            }
        })
    }
    catch (err) {
        console.log(err.message);
    }
}

router.post('/', function (req, res, next) {
    var Json = req.body;
    console.log(Json);
    checkStatusinDb(Json, res);
});

module.exports = router;