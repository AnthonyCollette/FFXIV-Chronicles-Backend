const { Sequelize, DataTypes } = require('sequelize')
const UserModel = require('../models/user')
const bcrypt = require('bcrypt')
  
const sequelize = new Sequelize('ffxiv', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
})
const User = UserModel(sequelize, DataTypes)
  
const initDb = () => {
  return sequelize.sync()
}
  
module.exports = { 
  initDb, User
}