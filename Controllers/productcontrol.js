let productmodel = require('../Model/productModel')

async function addUI(req,res) {

    return res.render("productCrud/add")
    
}

async function add(req,res){
    let modelproduct = await productmodel.productcreate(req.body).catch((err)=>{
        return {error:err}
    })
    if(!modelproduct || (modelproduct && modelproduct.error)){
        let error = (modelproduct && modelproduct.error) ? 
        modelproduct.error : "Internal server error"
        return res.render("productCrud/create",{error})
    }
    return res.redirect("/product/")
}



//control
async function viewAlll(req,res){
    let product = await productmodel.viewall(req.query,req.userData.permissions).catch((err)=>{

        return {error:err}
    })
    if(!product || (product && product.error)){
        return res.render('productCrud/view',{error:product.error})
    }
    return res.render('productCrud/view',{product : product.data, total : product.total, page : product.page, limit : product.limit, permissions : req.userData.permissions})
}




async  function viewDetaill(req,res) {
    let product = await productmodel.viewdetail(req.params.id).catch((err)=>{
        return { error:err}
    })
// console.log("product",product)
    if(!product || (product&& product.error)){
        return res.render('productCrud/view',{error:product.error})
    }

    return res.render("productCrud/details",{product:product.data})

   
 }

 async function updateUI(req,res) {

    let product =  await productmodel.viewdetail(req.params.id).catch((err)=>{
        return {error:err}
    })

    if(!product || (product&& product.error)){

        let url = (product && product.data && product.data.id)? "/product/"+product.data.id:"/product";
        return res.redirect(url);
    }

    return res.render("productCrud/update",{product:product.data})

    
 }

 async function  update(req,res) {
    let product = await productmodel.update(req.params.id,req.body).catch((err)=>{
        return { error:err}
    })
    // console.log(product,'cat');
    if(!product || (product&& product.error)){

        let url = (product && product.data && product.data.id)? "/product/"+product.data.id:"/product";
        return res.redirect(url);
    }

    let url = (product && product.data && product.data.id)? "/product/"+product.data.id:"/product";
        return res.redirect(url);

    
 }

 async function productDelete(req,res){
    let product = await productmodel.pDelete(req.params.id,true).catch((err)=>{
        return {error:err}
    })
    console.log('product',product);
    if(!product || (product && product.error)){
        let url = (req.params && req.params.id) ? '/product/'+req.params.id:'/product';
        return res.redirect(url)
    }
    return res.redirect('/product')
}



async function productRestore(req,res) {

    let product = await productmodel.pDelete(req.params.id,false).catch((err)=>{
        return {errro:err}
    })

    if(!product || (product && product.error)){
        let url = (req.params&& req.params.id)?"/product/"+req.params.id:"/product";
        return res.redirect(url)
    }
    

    return res.redirect("/product")
}

module.exports = {add,viewAlll,addUI,viewDetaill,update,updateUI,productDelete,productRestore}