/**
 * Created by donz on 2017/6/5.
 */
var mongoose = require('mongoose');

var WX_AccessTokenSchema = new mongoose.Schema({
    appid:String,
    access_token:String,
    updateTime:Date
});

var WX_AccessTokenModel = mongoose.model('WXAccessToken',WX_AccessTokenSchema);
module.exports = WX_AccessTokenModel;
