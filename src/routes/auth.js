const { User } = require('../db/sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()
  
module.exports = (app) => {
  app.post('/api/login', (req, res) => {
  
    User.findOne({ where: { username: req.body.username } }).then(user => {
      console.log("USER : " + user)
        if (!user) {
            const message = "L'utilisateur demandé n'existe pas."
            return res.status(404).json({ message })
        }
      bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
        if(!isPasswordValid) {
          const message = `Le mot de passe est incorrect`;
          return res.status(401).json({ message })
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        const message = `L'utilisateur a été connecté avec succès`;
        return res.json({ message, data: user, token })
      })
    }).catch(error => {
        const message = "L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants."
        return res.json({ message, data: error })
    })
  })

  app.post('/api/register', (req, res) => {
    bcrypt.hash(req.body.password, 10).then(hash => User.create({username: req.body.username, password: hash}))
    return res.json({ message: "L'utilisateur a été créé avec succès" })
  })
}