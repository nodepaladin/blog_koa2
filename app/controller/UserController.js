/**
 * Created by donz on 2017/6/5.
 */
const UserModel = require('../model/User')

exports.getUsers = async function (ctx,next) {
    let users = await UserModel.find();
    console.log(users.toString())
    ctx.body = users
}
