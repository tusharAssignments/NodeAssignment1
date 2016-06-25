/**
 * Created by tushar on 24/6/16.
 */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    _id: String,
    username: String,
    password: String,
    status: String
},{collection: 'user_db'});

module.exports = mongoose.model('user_db', userSchema);