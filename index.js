let express = require('express')
let session = require("express-session")
let config = require('config')
let port = config.get('port')
let app = express()
let {routes} = require('./routes')
let cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({secret:"wfiucn3"}))
app.set("view engine","ejs")
 function corsFun(origin,cb) {

    let whitelist = {
        'abc.com':true,
        'egnod.com':true,
        "localhost:3002":true

    }

    if(!origin || whitelist[origin]){
        cb(null,true);
    }
    else{
        cb(new Error('domain not valid'))
    }
    
 }

app.use(express.static(__dirname + '/public'))
app.use(routes)
app.listen(port,()=>{console.log("Connected",port);})