/**
 * Created by tushar on 25/6/16.
 */
var express=require('express');
var router=express.Router();
var user=require('./UserModel');

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function registerUser(Json,response) {
    var uuid=guid();
    var newUser=new user({
        username : Json.username,
        password : Json.password,
        status : "verified",
        _id: uuid
    });
    try{
    newUser.save();
        var regStr='{ "uuid" : "' + uuid +
            '","username" : "' + Json.username +
            '","password" : "' + Json.password +
            '", "status" : "verified" ' +
            ', "token": "null","success": "true"}';
        response.json(JSON.parse(regStr))
    }
    catch (err){
        console.log(err.body);
    }
}
function addUserToDb(Json,response) {
    user.findOne({'username': Json.username },{},function (err, user) {
        if(err){
            console.log(err.body);
        }
        if(user==null){
            registerUser(Json,response);
        }
        else {
            var resString='{"success":"false","message":"user already registered"}';
            response.json(JSON.parse(resString));
        }
    })
}

router.post('/', function (req, res, next) {
    var Json = req.body;
    console.log(Json);
    addUserToDb(Json,res);
});

module.exports = router;
