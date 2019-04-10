const mongoose = require('mongoose');
// mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost:27017/')
  .then(res => {
    console.log('connected');
  })
  .catch(err => {
    console.error(err);
    throw err;
  });
module.exports = { mongoose };
