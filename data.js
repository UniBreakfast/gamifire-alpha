const [User, Task, jwt] = 
  [require('./User'), require('./Task'), require('jsonwebtoken')]

module.exports = require('express').Router()
  .post('/addtask', async (req, res) => {
    try { 
      const user_id = jwt.verify(req.header('auth-token'), process.env.SECRET).id
      await new Task({...req.body, user_id}).save()
      res.send()
    } 
    catch (err) { res.send(err) } })
  .get('/tasks', async (req, res) => {
    try { 
      const user_id = jwt.verify(req.header('auth-token'), process.env.SECRET).id
      res.send(await await Task.find({user_id}))
    } 
    catch (err) { res.send(err) } })
  