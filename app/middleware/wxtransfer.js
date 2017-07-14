/**
 * Created by donz on 2017/7/14.
 */
const Xml2js = require('xml2js')
const xmlparser = new Xml2js.Parser();

module.exports = ()=>{
    return async (ctx,next)=>{
        if (ctx.method==='POST'&&ctx.is('text/xml')){
            let buf = ''
            ctx.req.on('data', function (chunk) {
                buf+=chunk;
            })
            ctx.req.on('end', function () {
                xmlparser.parseString(buf, function (err, result) {
                  console.log(result)
                    return result;
                })
            })
        }else {
            await next()
        }
    }
}
