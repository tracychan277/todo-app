const { MongoClient } = require('mongodb');
const db = process.env.ATLAS_URI;
const client = new MongoClient(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

module.exports = {
  connectToServer: function(callback) {
    client.connect(function(err, db) {
      // Verify that we have a proper DB object
      if (db) {
        _db = db.db('myFirstDatabase');
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
  },

  getDb: function() {
    return _db;
  },
};
