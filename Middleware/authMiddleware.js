let {sequelizecon} = require("../Init/dbconfig")
let {QueryTypes}= require("sequelize")
let security = require("../Helpers/security")

 function auth(permission){
    return async(req,res,next)=>{
        let token = req.session.token
        
        if(typeof(token)!="string"){
            console.log(typeof(token))
            return res.redirect('/login?msg=unauthorized this error')
        }
        let decrypt = await security.decrypt(token,"wfiucn3").catch((err)=>{
            return {error :err}
        })

        if(!decrypt||(decrypt&&decrypt.error)){
            console.log(decrypt.error)
            return res.redirect('/login?msg=unauthorized this is error')
        }

        let Query = `select users.id, users.name,permission.name as permission
        from users
        left join userpermission 
        on users.id = userpermission.user_id
        left join permission 
        on userpermission.permission_id= permission.id
        where users.id = '${decrypt.id}'
        and token = '${token}'`;
        let user = await sequelizecon.query(Query,{type:QueryTypes.SELECT}).catch((err)=>{
            return { error:err}

        })
        // console.log("user",user);

        if(!user||(user&&user.error)){
            return res.redirect('/login?msg=user.error')
        }

        let permissions = {}
        for(let i of user){
            if(i.permission){
                
                permissions[i.permission]=true
            }

        }
        console.log(permissions)
        if(permissions.lenght==0 || !permissions[permission]){
            console.log(permission)
            return res.redirect('/login?msg=unauthorized')
        }
        console.log("hello")

        req['userData']={
            name:user[0].name,
            id:user[0].id,
            permissions
        }
        console.log(req.userData)
        next();
    }

    // let decrypt=  security.decrypt(token,)
}

module.exports= {auth}