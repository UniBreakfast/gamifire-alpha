const [User, Task, jwt] = 
  [require('./User'), require('./Task'), require('jsonwebtoken')]
const minsPerLevel = 120


module.exports = require('express').Router()
  .post('/addtask', async (req, res) => {
    try { 
      const user_id = jwt.verify(req.header('auth-token'), process.env.SECRET).id
      await new Task({...req.body, user_id}).save()
      res.send()
    } 
    catch (err) { res.send(err) } })
  .post('/rmtask', async (req, res) => {
    try { 
      jwt.verify(req.header('auth-token'), process.env.SECRET).id
      (await Task.findById(req.body.id)).remove()
      res.send()
    } 
    catch (err) { res.send(err) } })
  .post('/addmins', async (req, res) => {
    try { 
      jwt.verify(req.header('auth-token'), process.env.SECRET).id
      const doc = (await Task.findById(req.body.id))
      doc.mins = +req.body.mins + doc.mins
      doc.level = Math.floor(doc.mins / minsPerLevel)
      doc.save()
      res.send()
    } 
    catch (err) { res.send(err) } })
  .get('/tasks', async (req, res) => {
    try { 
      const user_id = jwt.verify(req.header('auth-token'), process.env.SECRET).id
      res.send(await await Task.find({user_id}))
    }
    catch (err) { res.send(err) } })
  