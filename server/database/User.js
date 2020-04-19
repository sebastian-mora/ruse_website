const Sequelize = require('sequelize');
const db  = require('./database')

const User = db.define('user',{
  username: Sequelize.STRING,
  password: Sequelize.STRING
})

// User.sync().then(() => {
//   console.log('New table created');
// }).finally(() => {
//   db.close();
// })

module.exports = User;