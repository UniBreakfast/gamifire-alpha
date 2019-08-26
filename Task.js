const { Schema, model } = require('mongoose')

module.exports = model('Task', new Schema({
  task: {type: String, required: true, minlength: 2, maxlength: 256},
  user_id: {type: String, required: true},
  exp: {type: Number, default: 0},
  datetime: {type: Date, default: Date.now}
}))