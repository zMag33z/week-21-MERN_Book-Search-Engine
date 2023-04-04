const mongoose = require('mongoose');

// for two days i've been trying to figure this out, while taking a break and an epiphany struck - localhost needs to change to 127.0.0.1:27017  OMG
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,  console says depreciated will not run removed runs then waits and then drops again
  // useFindAndModify: false,
});

module.exports = mongoose.connection;