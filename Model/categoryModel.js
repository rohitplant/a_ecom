let {Category} = require('../Schema/category')
let joi = require('joi')



async function check(data){
    let schema = joi.object({
        name:joi.string().required(),
        image:joi.string(),   
    })

    let valid = await schema.validateAsync(data).catch((err)=>{
        return {error:err}
    })
    if(!valid || (valid && valid.error)){
        let msg = []
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return{error:msg}
    }
    return {data:valid}
}

async function createCategory(params){
    let valid = await check(params).catch((err)=>{
        return {error:err}
    })
    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }

    let find = await Category.findOne({where:{name:params.name}}).catch((err)=>{
        return {error:err}
    })
    if(find || (find && find.error)){
        return {error:"Already created"}
    }

    let userData = {
        name : params.name,
        img : params.image
    }

    let data = await Category.create(userData).catch((err)=>{
        return {error:err}
    })
    if(!data || (data && data.error)){
        return {error:data.error}
    }
    return {data:data}
}

async function viewall(params,permissions){
  
    let limit = (params.limit) ? parseInt(params.limit) : 10;
    let page = (params.page) ? parseInt(params.page) : 1;
    let offset = (page-1)*limit

    let where = {};
    if(!permissions.category_restore){
        where = {is_deleted:false}
    }

    let counter = await Category.count({where}).catch((err)=>{
        return {error:err}
    })
    if(!counter || (counter && counter.error)){
        return {error:'internal error'}
    }

    if(counter <=0 ){
        return {error:'record not found'}
    }

    let valid = await Category.findAll({limit,offset,raw:true,where}).catch((err)=>{
        return {error:err}
    })
    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }
    return {data:valid,total:counter,page:page,limit:limit}
}

async function viewdetail(id){
    console.log(id);
    let data = await Category.findOne({where:{id}}).catch((err)=>{
        return {error:err}
    })
    console.log('data',data);
    if(!data || (data && data.error)){
        return {error:'Internal error in viewdetail'}
    }
    return {data:data}
}

async function checkUpdate(data){
    let schema = joi.object({
        id:joi.number().required(),
        name:joi.string(),
        image:joi.string()
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

async function update(id,params){
    params.id = id;

    let valid = await checkUpdate(params).catch((err)=>{
        return {error:err}
    })
    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }

    let data = await Category.findOne({where:{id},raw:true}).catch((err)=>{
        return {error:err}
    })
    if(!data || (data && data.error)){
        return {error: "internal server error1"}
    }

    data.name = params.name,
    data.img = params.image

    let updateProduct = await Category.update(data,{where:{id}}).catch((err)=>{
        return {error:err}
    })
    console.log("141",updateProduct);
    if(!updateProduct || (updateProduct && updateProduct.error)){
        return {error: "internal server error2"}
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

async function cDelete(id,decision){

    let valid = await checkDelete({id}).catch((err)=>{
        return {error:err}
    })
    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }

    let data = await Category.findOne({where:{id},raw:decision}).catch((err)=>{
        return {error:err}
    })
    if(!data || (data && data.error)){
        return {error:"Internal server error"}
    }

    if(data.is_deleted == decision){
        return {error:"Product is already deleted"}
    }

    let updateProduct = await Category.update({is_deleted:decision},{where:{id}}).catch((err)=>{
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



// async function cRestore(id){

//     let valid = await checkDelete({id}).catch((err)=>{
//         return {error:err}
//     })
//     if(!valid || (valid && valid.error)){
//         return {error:valid.error}
//     }

//     let data = await Category.findOne({where:{id},raw:true}).catch((err)=>{
//         return {error:err}
//     })
//     if(!data || (data && data.error)){
//         return {error:"Internal server error"}
//     }

//     if(data.is_deleted == false){
//         return {error:"Category is already deleted"}
//     }

//     let updateProduct = await Category.update({is_deleted:false},{where:{id}}).catch((err)=>{
//         return {error:err}
//     })
//     if(!updateProduct || (updateProduct && updateProduct.error)){
//         return {error:"Internal server error"}
//     }
//     if(updateProduct <= 0){
//         return {error:"record not deleted"}
//     }
    
//     return {data:"record successfully restore"}
// }


module.exports = {createCategory,viewall,viewdetail,update,cDelete}



