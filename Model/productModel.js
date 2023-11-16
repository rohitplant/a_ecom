const { viewDetail } = require('../Controllers/productcontrol')
let {Product} = require('../Schema/ProductSchema')
let joi = require('joi')

async function productcreate(params){
    let valid = await check(params).catch((err)=>{
        return {error:err}
    })

    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }

    let userproduct = {
        name:params.username,
        price:params.rupees,
        description:params.describe
    }

    let data = await Product.create(userproduct).catch((err)=>{
        return {error:err}
    })

    if(!data || (data && data.error)){
        return {error:"internal server error"}
    }
    console.log(data);
    return {data:data}
}

async function check(made){
    let schema = joi.object({
        username:joi.string().required(),
        rupees:joi.string().required(),
        describe:joi.string().required()
    })

    let valid = await schema.validateAsync(made).catch((err)=>{
        return {error:err}
    })

    if(!valid || (valid && valid.error)){
        let msg = []
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error:msg}
    }
    return {data:valid}
}

async function viewall(params,permissions){
    let limit = (params.limit) ? parseInt(params.limit) : 10;
    let page = (params.page) ? parseInt(params.page ): 1;
    let offset = (page-1)*limit

    let where = {};
    if(!permissions.product_restore){
        where = {is_deleted:false}
    }

    let counter = await Product.count({where}).catch((err)=>{
        return {error:err}
    })
    if(!counter || (counter && counter.error)){
        return {error:'internal error'}
    }
    if(counter <= 0){
        return {error:'record not found'}
    }

    let data = await Product.findAll({limit,offset,raw:true,where}).catch((err)=>{
        return {error:err}
    })
    if(!data || (data && data.error)){
        return {error:"internal",status:500}
    }
    //console.log(data)
    return {data:data,total:counter,page:page,limit:limit}
}


async function viewdetail(id) {

    let data = await Product.findOne({ where:{id},raw:true}).catch((err)=>{
        return {error:err}
    })
    console.log("mysql",data)
    if(!data || (data&&data.error )){
        return { error:"internal server error",stutus:500}
    }
    return  {data}
    
}

async function checkUpdate(made){
    let schema = joi.object(
        {
        id:joi.number().required(),
        username:joi.string().min(3).max(40),
        rupees:joi.number(),
        describe:joi.string().min(10).max(60),
    })

    let valid = await schema.validateAsync(made).catch((err)=>{
        return {error:err}
    })

    if(!valid || (valid && valid.error)){
        let msg = []
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error:msg}
    }
    return {data:valid}
}

async function update(id,params) {
    params.id= id;

    let valid = await checkUpdate(params).catch((err)=>{
            return  { error:err}
    })
    console.log(valid.error);
    if (!valid|| (valid && valid.error)) {
        return { error: "Internal server error 2" };
    }
    
    let data = await Product.findOne({where:{id},raw:true}).catch((err)=>{
        return { error:err}
    })

     if (!data|| (data && data.error)) {
        return { error: "Internal server error 3" };}


    data.name= params.username;
    data.price = params.rupees;
    data.description= params.describe;

    let updateProduct = await Product.update(data,{where:{id}}).catch((error)=>{
       return {error:err}})

       
    if (!updateProduct|| (updateProduct && updateProduct.error)) {
        return { error: "Internal server error4" };
    }

    return {data:data}
}


async function checkDelete(data){
    let schema = joi.object({
        id:joi.number().required()
    })
    let valid = await schema.validateAsync(data).catch((err)=>{
        return {error:err}
    })
    if(!valid || (valid && valid.error)){
        let msg = []
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error:msg}
    }
    return {data:valid}
}


async function pDelete(id,decision){
   

    let valid = await checkDelete({id}).catch((err)=>{
        return {error:err}
    })
    console.log('valid',valid);
    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }

    let data = await Product.findOne({where:{id},raw:decision}).catch((err)=>{
        return {error:err}
    })
    console.log('data',data);
    if(!data || (data && data.error)){
        return {error:"Internal server error"}
    }
    console.log(data);

   
    if(data.is_deleted == decision){
        return {error:"Product is already deleted"}
    }


    let updateProduct = await Product.update({is_deleted:decision},{where:{id}}).catch((err)=>{
        return {error:err}
    })
    if(!updateProduct || (updateProduct && updateProduct.error)){
        return {error:"Internal server error"}
    }
    if(updateProduct <= 0){
        return {error:"record not deleted"}
    }
    
    return {data:"record successfully deleted"}
}


// async function pRestore(id) {
    
//      let valid = await checkDelete({id}).catch((err)=>{
//         return { error :err}
//      })

//      if(!valid || (valid &&valid.error) ){
//         return { error:valid && valid.error}
//      }

//      let data = await Product.findOne({where:{id},raw:true}).catch((err)=>{
//         return { error:err}
//      })

//     if(!data || (data && data.error)){
//         return { error:"internal server error"}
//     }

//     if(data.is_deleted == false){
//         return { error:"product is alredy deleted"}
//     }

//     let updateProduct= (await Product.update({ is_deleted:true},{where:{id}})).catch((err)=>{
//         return { error:err}
//     })

//     if(!updateProduct||(updateProduct&&updateProduct.error)){
//         return { error :"internal server error"}
//     }

//     if(updateProduct<=0){
//         return { error :"internal server error"}
//     }

//     return { data:"record succesfully deleted"}
// }


module.exports = {productcreate, viewall,viewdetail,update,pDelete}