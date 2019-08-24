const [User, bcrypt, jwt] = 
  [require('./User'), require('bcryptjs'), require('jsonwebtoken')]

module.exports = require('express').Router()
  .post('/register', async ({body}, res) => {
    body.pass = await bcrypt.hash(body.pass, await bcrypt.genSalt(10))
    try { res.status(201).send( await new User(body).save() ) }
    catch (err) { res.status(400).send(err) } })
  .post('/login', async ({body: {mail, pass}}, res) => {
    try {
      const userFound = await User.findOne({ mail }),
            correct = await bcrypt.compare(pass, (userFound).pass)
      res.send(correct? jwt.sign({id: userFound.id}, process.env.SECRET) : false)
    }
    catch (err) { res.status(401).send(err.message) } })
  .get('/data', (req, res) => {
    try { res.send(jwt.verify(req.header('auth-token'), process.env.SECRET)) } 
    catch (err) { res.send(err) } })
  