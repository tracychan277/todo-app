const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
const port = 5000;
app.use(cors());
const dbo = require('./db/connection');

app.listen(port, () => {
  // Perform a DB connection when the server starts
  dbo.connectToServer(function(err) {
    if (err) {
      console.error(err);
    }
  });
  console.log(`Server is running on port: ${port}`);
});
