const { MongoClient } = require('mongodb');
const db = process.env.ATLAS_URI;
const client = new MongoClient(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = client.connect();
