const mongoose = require('mongoose');

const RecognizationSchema = mongoose.Schema({
  from: String,
  value: String,
  details: String
});

const UserSchema = mongoose.Schema({
  userName: { type: String, unique: true },
  password: String,
  name: String,
  age: Number,
  email: String,
  recognization: [RecognizationSchema],
});

module.exports = mongoose.model('User', UserSchema);
