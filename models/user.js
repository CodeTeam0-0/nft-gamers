const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bestNews: {
    type: Types.ObjectId,
    ref: 'New',
  },
});

const User = model('User', userSchema);

module.exports = User;
