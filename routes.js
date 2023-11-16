let express = require('express')
let routes = express.Router()
let user = require('./Controllers/userController')
let product = require('./Controllers/productcontrol')
let auth = require('./Controllers/authcontroller')
let authMid= require("../a_ecom/Middleware/authMiddleware")
let dashboard = require("./Controllers/dashboard")
let category = require("./Controllers/categoryController")




//User routes
routes.get('/',auth.registerui)
routes.get("/login",auth.registerui)
routes.post('/register',auth.registerUser)
routes.post("/login",auth.loginUser)
routes.get('/dashboard',authMid.auth('user'),dashboard.indexs)

//product routes

routes.get('/product/create',authMid.auth("product_create"),product.addUI)
routes.post('/product/create',authMid.auth("product_create"),product.add)
routes.get('/product',authMid.auth("product_view"),product.viewAlll)
routes.get('/product/:id',authMid.auth("product_view"),product.viewDetaill)
routes.get('/product/update/:id',authMid.auth("product_update"),product.updateUI)
routes.post('/product/:id',authMid.auth("product_update"),product.update)
routes.post("/product/delete/:id",authMid.auth('product_delete'),product.productDelete)
routes.post("/product/restore/:id",authMid.auth('product_restore'),product.productRestore)

routes:-
//category routes
routes.get('/category/create',authMid.auth('category_create'),category.addUI)
routes.post('/category/create',authMid.auth('category_create'),category.createcategory)
routes.get('/category',authMid.auth('category_view'),category.viewCategory)
routes.get('/category/:id',authMid.auth('category_view'),category.viewDetail)
routes.get('/category/update/:id',authMid.auth('category_update'),category.updateUI)
routes.post('/category/:id',authMid.auth('category_update'),category.update)
routes.post('/category/delete/:id',authMid.auth('category_delete'),category.categoryDelete)
routes.post('/category/restore/:id',authMid.auth('category_restore'),category.categoryRestore)


module.exports = {routes}