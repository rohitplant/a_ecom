// const { login } = require('../Model/authModel')
let categorymodel = require('../Model/categoryModel')

async function addUI(req,res){
    return res.render('category/addCategory',{})
}

async function createcategory(req,res){
    let modelcategory = await categorymodel.createCategory(req.body).catch((err)=>{
        return {error:err}
    })
    console.log("12",modelcategory);
    if(!modelcategory || (modelcategory && modelcategory.error)){
        let error = (modelcategory && modelcategory.error) ? modelcategory.error : 'Internal server error'
        return res.send({error})
    }
    return res.redirect('/category')
}

async function viewCategory(req,res){
    let category = await categorymodel.viewall(req.query,req.userData.permissions).catch((err)=>{
        return {error:err}
    })
    console.log('category',category);
    if(!category || (category && category.error)){
         return res.render('category/viewCategory',{error:category.error})
    }
    return res.render('category/viewCategory',{category:category.data,total:category.total,page:category.page,limit:category.limit, permissions : req.userData.permissions})
}

async function viewDetail(req,res){
    let category = await categorymodel.viewdetail(req.params.id).catch((err)=>{
        return {error:err}
    })
    console.log('category',category);
    if(!category || (category && category.error)){
        return res.render('category/viewCategory',{error:category.error})
    }
    return res.render('category/detailsCategory',{category:category.data})
}

async function updateUI(req,res){
    let category = await categorymodel.viewdetail(req.params.id).catch((err)=>{
        return {error:err}
    })
    if(!category || (category && category.error)){
        let url = (category && category.data && category.data.id) ? '/category/'+category.data.id:'/category';
        return res.redirect(url)
    }
    return res.render('category/updateCategory',{category:category.data})
}

async function update(req,res){
    let category = await categorymodel.update(req.params.id,req.body).catch((err)=>{
        return {error:err}
    })
    console.log("57",category);
    if(!category || (category && category.error)){
        let url = (category && category.data && category.data.id) ? '/category/'+category.data.id:'/category';
        return res.redirect(url)
    }
    let url = (category && category.data && category.data.id) ? '/category/'+category.data.id:'/category';
    return res.redirect(url)
}

async function categoryDelete(req,res){
    let category = await categorymodel.cDelete(req.params.id, true).catch((err)=>{
        return {error:err}
    })
    console.log('category',category);
    if(!category || (category && category.error)){
        let url = (req.params && req.params.id) ? '/category/'+req.params.id:'/category';
        return res.redirect(url)
    }
    return res.redirect('/category')
}

async function categoryRestore(req,res){
    let category = await categorymodel.cDelete(req.params.id, false).catch((err)=>{
        return {error:err}
    })
    console.log('category',category);
    if(!category || (category && category.error)){
        let url = (req.params && req.params.id) ? '/category/'+req.params.id:'/category';
        return res.redirect(url)
    }
    return res.redirect('/category')
}

module.exports = {createcategory,addUI,viewCategory,viewDetail,updateUI,update,categoryDelete,categoryRestore}


