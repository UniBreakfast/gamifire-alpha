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
      if (correct) return res.send({
        token: jwt.sign({id: userFound.id}, process.env.SECRET),
        name: userFound.name
      })
      res.send('false')
    }
    catch (err) { res.status(401).send(err.message) } })
  .post('/data', async (req, res) => {
    try { 
      const _id = jwt.verify(req.header('auth-token'), process.env.SECRET).id,
            name = (await User.findOne({_id})).name
      res.send(name)
    } 
    catch (err) { res.send(err) } })
  