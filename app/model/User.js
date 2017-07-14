/**
 * Created by donz on 2017/6/5.
 */
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name:String,
    age:Number,
    phone:String
});

var UserModel = mongoose.model('UserModel',UserSchema);
module.exports = UserModel;
