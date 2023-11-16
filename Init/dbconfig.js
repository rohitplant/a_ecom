let {Sequelize,Model,DataTypes,Op,query} = require('sequelize')
let sequelizecon = new Sequelize('mysql://root:@localhost/ecom')
sequelizecon.authenticate().then().catch()
module.exports = {
    sequelizecon,
    Model,
    DataTypes,
    Op
    ,
    query
}