// Reference: https://www.mongodb.com/languages/mern-stack-tutorial
const express = require('express');
const routes = express.Router();
const dbo = require('../db/connection');
const dbConnection = dbo.getDb();

// This helps convert the ID from string to ObjectId for the MongoDB _id.
const ObjectId = require('mongodb').ObjectId;

// Helper function to handle result of MongoDB functions
function handleError(error, result, response, logMessage=null) {
  if (error) {
    throw error;
  }
  if (logMessage) {
    console.log(logMessage);
  }
  response.json(result);
}

// Get all the tasks available
routes.route('/tasks').get(function(request, response) {
  dbConnection
    .collection('tasks')
    .find({})
    .toArray((error, result) => handleError(error, result, res));
});

// Retrieve a single task by ID
routes.route('/task/:id').get(function(request, response) {
  const idQuery = { _id: ObjectId( request.params.id )};
  dbConnection
      .collection('tasks')
      .findOne(idQuery, (error, result) => handleError(error, result, response));
});

// Create a new task
routes.route('/task/add').post(function(request, response) {
  const newTask = {
    description: req.body.description,
    dueDate: req.body.dueDate,
    userName: req.body.userName,
  };
  dbConnection.collection('tasks').insertOne(
    newTask, (error, result) => handleError(error, result, response)
  );
});

// Update a task
routes.route('/update/:id').post(function(request, response) {
  const idQuery = { _id: ObjectId( request.params.id )};
  const updatedTask = {
    $set: {
      description: req.body.description,
      dueDate: req.body.dueDate,
      userName: req.body.userName,
    },
  };
  dbConnection
    .collection('tasks')
    .updateOne(idQuery, updatedTask, (error, result) => {
      handleError(error, result, response, "1 task updated");
    }
});

// Delete a task
routes.route("/:id").delete((request, response) => {
  const idQuery = { _id: ObjectId( request.params.id )};
  dbConnection.collection('tasks').deleteOne(idQuery, (error, result) => {
    handleError(error, result, response, "1 task deleted"));
  }
});

module.exports = routes;