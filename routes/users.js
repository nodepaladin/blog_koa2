const router = require('koa-router')()
const UserModel = require('../app/model/User')
const UserController = require('../app/controller/UserController')

router.prefix('/users')

router.get('/getUsers',UserController.getUsers)

router.post('/saveUser',async function (ctx, next) {
    let User = new UserModel(ctx.request.body)
    let result = await User.save();
    ctx.body = result
})

router.post('/deleteUser',async function (ctx, next) {
    let userId = ctx.request.body.id;
    let user = await UserModel.findOne({_id:userId})
    if (user) {
     let res = await UserModel.remove(user)
        ctx.body = res
    }
})

module.exports = router
