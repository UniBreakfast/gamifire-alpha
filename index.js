require('dotenv').config()
const options = {dbName: "GFdb", useNewUrlParser: true, useCreateIndex: true}
require('mongoose').connect(process.env.MONGO_URI, options, err => 
  console.log(err || "Connected to MongoDB Cloud"))

require('express')().use(require('body-parser').json())
  .use(require('body-parser').urlencoded( {extended: true} ))
  .use('/api/user', require('./auth'))
  .listen(3000, () => console.log("Server started"))

