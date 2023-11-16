//validate
//email
//pass hash
//format data
//insert useraData
//format userData
//permission



let joi = require("joi");
let { User } = require("../Schema/UserSchema");
let bcrypt = require("../Helpers/security");
let { Userpermission} = require("../Schema/userpermission");
let hash = require('../Helpers/security')


async function login(params) {

  let valid = await userlogin(params).catch((err)=>{
    return { error :err}
  })
  if (!valid ||(valid && valid.error)){
    console.log("joi",valid)
    return{ error:valid.error}
  }

  let finduse = await User.findOne({where:{email_id:params.email}}).catch((err)=>{
    return { error :err}
  })

  if(!finduse ||(finduse && finduse.error)){
    console.log(finduse.error)
    console.log()
    return{error:"login error finduser"}
    
  }
console.log(params.password)
      

  let pass= await bcrypt.compare(params.password,finduse.password).catch((err)=>{
    return {error:err}
  })
  console.log(pass)

  if(!pass || (pass && pass.error)){
    return {error:"passsword is wrong"}
  }

  let token = await bcrypt.encrypt({id:finduse.id},"wfiucn3").catch((err)=>{
    return {error :"token error"}
  })
  if(!token || (token && token.error)){
    return {error:"user alreddy there"}
  }


  let updatetoken = await  User.update({token:token},{where:{id:finduse.id}}).catch((err)=>{
    return { error:err}
  })

  if(!updatetoken||(updatetoken&&updatetoken.error)){
    console.log("db error",updatetoken.error)
    return{ error:updatetoken.error}
  }
  return {data:"login suss",token:token}

}


async function register(params) {
  let valid = await check(params).catch((err) => {
    return { error: err };
  });
  if (!valid || (valid && valid.error)) {
    return { error: valid.error };
  }

  let finduser = await User.findOne({where : {email_id:params.email}}).catch((err)=>{
    return {error : err}
  })
  if(finduser || (finduser && finduser.error)){
    return {error:finduser.error}
  }

  let pass = await bcrypt.hash(params.password).catch((err)=>{
    return {error:err}
  })
  console.log(pass)
  if(!pass || (pass && pass.error)){
    return {error:"user alreddy there"}
  }

  let userData = {
    name: params.userName,
    email_id: params.email,
    contact: params.phone,
    password: pass.data
  };
  let data = await User.create(userData).catch((err) => {
    return { error: err };
  });
console.log(data)
  if (!data || (data && data.error)) {
    return { error: "Internal server error3" };
  }


  let userPermission = {
   user_id:data.id,
   permission_id:1
   
  }
console.log(userPermission)
  let update = await Userpermission.create(userPermission).catch((err)=>{
    return {error:err}
  })
console.log(update.error,"hello")
  if(!update||(update&&update.error)){
    console.log(update)
    return {error : update.error}
   
  }
  console.log("done")
 
  return { data};
}


async function userlogin(params) {


  let Schema = joi.object({
    email:joi.string().email().min(8).max(30).required(),
    password:joi.string().min(8).max(16).required()

  })

  let valid = await Schema.validateAsync(params).catch((err)=>{
    return {error:err}
  })

  if(!valid||(valid && valid.error)){
    let msg = [];
    for(let i of valid.error.details){
      msg.push(i.message)
    }
    return { error:msg};
  }
  return { data : valid}
}

async function check(data){
    let Schema = joi.object({
        userName: joi.string().min(2).max(15).required(),
        email: joi.string().email().min(8).max(30).required(),
        phone: joi.string().required(),
        password: joi.string().min(8).max(15).required(),
      });
      let valid = await Schema.validateAsync(data).catch((err) => {
        return { error: err };
      });
      if (!valid || (valid && valid.error)) {
        let msg = [];
        for (let i of valid.error.details) {
          msg.push(i.message);
        }
        return { error: msg };
      }
      return { data: valid };
}

async  function forgetpasswordcheck(data){
  let Schema = joi.object({
    email: joi.string().min(6).max(15).required(),
   
  })
  let valid = await Schema.validateAsync(data).catch((err)=>{
    return {error:err}
  });
  if(!valid|| (valid&&valid.error)){
   for(let i of valid.error.details){
    msg.push(i.message)
   }
   return { error:msg}
  }
  return { data:valid};

}

async function forgetpassword(params) {
  
  let valid = await check(params).catch((err) => {
    return { error: err };
  });
  if (!valid || (valid && valid.error)) {
    return { error: valid.error };
  }

  let findemail = await User.findOne({where : {email_id:params.email}}).catch((err)=>{
    return {error : err}
  })
  if(findemail || (findemail && findemail.error)){
    return {error:findemail.error}
  }
 let  generate =await otp.generate(6,
   {upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false}).catch((err)=>{
      return {error:err}
 })
 
 if(generate || (generate && generate.error)){
  return {error:generate.error}
}

let encrypt = await bcrypt.hash(generate).catch((err)=>{
  return {error:err}
})
if(!encrypt || (encrypt && encrypt.error)){

  return {otp : encrypt}
}
// return {otp : encrypt}


let updateotp = await  User.update({generate:encrypt.data},{where:{id:findemail.id}}).catch((err)=>{
  return { error:err}
})

if(!updateotp||(updateotp&&updateotp.error)|| (updateotp && updateotp[0]<=0)){
  // console.log("db error",updatetoken)
  return {error:updateotp.error}

}


}



module.exports = {register,login}


//transssion google karo