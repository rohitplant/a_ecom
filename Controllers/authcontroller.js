let registercontrol = require('../Model/authModel')
let logiccontrol = require('../Model/authModel')
async function registerUser(req,res) {
    let registerdata = await registercontrol.register(req.body).catch((err) => {
        return { error: err }
    })
    console.log('registerdata', registerdata)
    if (!registerdata || (registerdata && registerdata.error)) {
        let error = (registerdata && registerdata.error) ? registerdata : 'internal server error'
        return res.send({ error })
    }
    return res.redirect("/msg=success")
}

async function loginUser(req, res) {

    let logindata = await logiccontrol.login(req.body).catch((err) => {
        return res.send({ error: err })
    })

    console.log('loginData', logindata)

    if (!logindata || (logindata && logindata.error)) {
        let error = (logindata && logindata.error) ? logindata : "internal server errorrr"
        // console.log(error);
        return res.send({ error })
    }
    req.session.token=logindata.token
     
    return res.redirect('/dashboard')
}

async function index(req,res) {

    res.render('regLog',{})
    
}

function registerui(req,res) {
    return res.render("reglog.ejs",{})
    
}

module.exports = { registerUser,loginUser,index,registerui }


// controller steps 
// mauke async function 
// make default variable like (loginUser =  loginData)
// make sure u import login function in req.body
// lets verify the the data in function
// res.send the selected out put




