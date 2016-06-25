/**
 * Created by tushar on 24/6/16.
 */
var express = require('express');
var router = express.Router();
var user = require('./LoginUserModel');

function removeUserFromDb(Json, res) {
    user.findOne({'username': Json.username}, function (err, users) {
        if (err) {
            console.log(err.body);
        }
        else {
            var str = {"message": "Logged out"};
            res.json(str);
        }
    }).remove().exec();

}

router.post('/', function (req, res, next) {
    var Json = req.body;
    console.log(Json);
    removeUserFromDb(Json, res);
});

module.exports = router;