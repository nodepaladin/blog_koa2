const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const mongo = require('mongoose')
const request = require('request')
const WXAccessToken = require('./app/model/WXAccessToken')
const wxtransfer = require('./app/middleware/wxtransfer')
const config = require('./config/config')
const db = mongo.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('conn mongo success')
});
mongo.connect(require('./config/config').mongodb.connction);


const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/src/views', {
  extension: 'html',
  //   map:{html:'swig'}
}))
app.use(wxtransfer())
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

getWX_AccessToken()

function getWX_AccessToken() {
    request.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.wxconfig.APPID+'&secret='+config.wxconfig.APPSECRET, function (err, result) {
        if (err){
            throw err
        }
        const body = JSON.parse(result.body)
        const access_token = body.access_token;
        const expires_in = body.expires_in;
        const wxAccessToken = new WXAccessToken({
            appid:config.wxconfig.APPID,
            access_token:access_token
        })
        WXAccessToken.find({appid:config.wxconfig.APPID}, function (err, tokens) {
            if (err){

            }
            if (tokens.length==0){
                const updateTime = new Date()
                wxAccessToken.updateTime = updateTime
                wxAccessToken.save(function (err) {
                    if (err){
                        throw err
                    }
                    console.log('save access_token success')
                })
            }else {
                var tokenBean = tokens[0]
                console.log(new Date().getTime()-tokenBean.updateTime.getTime())
                // if (new Date().getTime()-tokenBean.updateTime.getTime())
                tokenBean.access_token = access_token
                tokenBean.save(function (err) {
                    if (err){
                        throw err
                    }
                    console.log('update access_token success')
                })
            }
        })
    })
}

app.on('error', (err, ctx) =>
    log.error('server error', err, ctx)
);

module.exports = app
