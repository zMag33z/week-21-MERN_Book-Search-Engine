const mongoose = require('mongoose');

// for two days i've been trying to figure this out, while taking a break and an epiphany struck - localhost needs to change to 127.0.0.1:27017  OMG
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;