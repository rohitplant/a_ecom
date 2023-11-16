let { sequelizecon, Model, DataTypes } = require('../Init/dbconfig')

class User extends Model { }

User.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email_id: { type: DataTypes.STRING, allowNull: false },
    contact: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },

    is_active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    token:{type:DataTypes.STRING(500),allowNull:true},
}, { tableName: 'users', modelName: 'User', sequelize: sequelizecon })

module.exports = { User }



//otp:{type:DataTypes.STRING,allowNull:false},
//token:{type:DataTypes.STRING,allowNull:false},