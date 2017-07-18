const router = require('koa-router')()
const crypto = require('crypto')
const querystring = require('querystring')
const token = 'token_donz'
const xml2js = require('xml2js')
const wxtransfer = require('../app/middleware/wxtransfer')

router.get('/', async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin','*');
  ctx.set('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, HEAD, PATCH')
  // await ctx.render('index', {
  //   title: 'Hello Koa 2!'
  // })
    ctx.body = 'this is resopnse'
})
//GET request
router.get('/wx_api',async (ctx,next)=>{
    const echostr = ctx.query.echostr;
    const signature = ctx.query.signature;
    const timestamp = ctx.query.timestamp;
    const nonce = ctx.query.nonce;
    if (!echostr||!signature||!timestamp||!nonce){
      //不是微信请求
        ctx.body = '小样，你是谁'
        return
    }
    var sortArr = [token,timestamp,nonce].sort()
    var hash = crypto.createHash('sha1')
    var str = hash.update(sortArr.join(''))
    var sha1str = str.digest('hex');
    console.log(sha1str===signature)
    if (sha1str!==signature){
      return
    }
    // /wx_api?signature=a2b882c1556e7b6f6aaedeb46a1d5efa215d3856&echostr=5744003174913404539&timestamp=1499849297&nonce=1224821012
    ctx.body = echostr;
    //执行业务逻辑
    //格式化解析消息
    //自动回复
})

router.post('/wx_api',async (ctx,next)=>{
    //执行业务逻辑
    //格式化解析消息
    //自动回复
    const message = ctx.req.body;
    // ctx.body = 'success'
    if (message.MsgType==='text'){
         var xmlBuilder = new xml2js.Builder({cdata:true})
        var replyxml = xmlBuilder.buildObject({xml:{
            ToUserName: message.FromUserName,
            FromUserName:message.ToUserName,
            CreateTime:Date.now(),
            MsgType: message.MsgType,
            Content:message.Content,
        }})
        console.log('replyxml is ->>>'+replyxml)
        ctx.body = replyxml
    }
})

router.get('/users', async (ctx,next)=>{
  await ctx.render('users',{
  })
})

router.get('/users_component', async (ctx,next)=>{
  await ctx.render('users_vue_component',{
  })
})

router.get('/vue_component_relation', async (ctx,next)=>{
    await ctx.render('vue_component_relation',{
    })
})

router.get('/slot', async (ctx,next)=>{
    await ctx.render('vue_slot_dialog',{

    })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
