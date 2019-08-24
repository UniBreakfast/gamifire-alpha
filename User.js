const { Schema, model } = require('mongoose')

module.exports = model('User', new Schema({
  name: {type: String, required: true, minlength: 3, maxlength: 64},
  mail: {
    type: String, required: true, index: true, unique: true,
    validate: {
      validator: value => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(value),
      message: ({value}) => `${value} is not a valid email`
    }
  },
  pass: {type: String, required: true},
  datetime: {type: Date, default: Date.now}
}))