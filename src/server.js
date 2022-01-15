// Reference: https://www.mongodb.com/languages/mern-stack-tutorial
const express = require('express');
const app = express();
const cors = require('cors');
// NOTE: config.env is gitignored for security reasons
require('dotenv').config({ path: './config.env' });
const port = 5000;
app.use(cors());
app.use(express.json());
app.use(require('./routes/tasks'));
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
