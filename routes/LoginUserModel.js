/**
 * Created by tushar on 24/6/16.
 */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    username: String,
    token: String
},{collection: 'active_user_db'});

module.exports = mongoose.model('active_user_db', userSchema);