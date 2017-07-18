/**
 * Created by donz on 2017/7/15.
 */
const userUrl = 'https://api.weixin.qq.com/cgi-bin/'
const request = require('request')
const Promise = require('bluebird')
Promise.promiseAll(request);

module.exports = {
    sendTextMessage: function (text) {

    },
//   用户管理
//   获取所有用户
    getUserList: function () {
        // request.get
    }
}

function jsonToXml(data) {
    const type = data.MsgType[0];
    if (type=='text'){

    }
}
