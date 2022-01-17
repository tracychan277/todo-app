// Reference: https://www.mongodb.com/languages/mern-stack-tutorial
const express = require('express');
const routes = express.Router();
const clientPromise = require('../db/connection');

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
routes.route('/tasks').get(async function(request, response) {
  const client = await clientPromise;
  const dbConnection = client.db();
  const order = { dueDate: 1 };
  dbConnection
    .collection('tasks')
    .find({})
    .sort(order)
    .toArray((error, result) => handleError(error, result, response));
});

// Retrieve a single task by ID
routes.route('/task/:id').get(async function(request, response) {
  const client = await clientPromise;
  const dbConnection = client.db();
  const idQuery = { _id: ObjectId( request.params.id )};
  dbConnection
      .collection('tasks')
      .findOne(idQuery, (error, result) => handleError(error, result, response));
});

// Create a new task
routes.route('/task/add').post(async function(request, response) {
  const client = await clientPromise;
  const dbConnection = client.db();
  const newTask = {
    description: request.body.description,
    dueDate: request.body.dueDate,
    userName: request.body.userName,
    completed: request.body.completed,
  };
  dbConnection.collection('tasks').insertOne(
    newTask, (error, result) => handleError(error, result, response)
  );
});

// Update a task
routes.route('/task/update/:id').post(async function(request, response) {
  const client = await clientPromise;
  const dbConnection = client.db();
  const idQuery = { _id: ObjectId( request.params.id )};
  const updatedTask = {
    $set: {
      description: request.body.description,
      dueDate: request.body.dueDate,
      userName: request.body.userName,
      completed: request.body.completed,
    },
  };
  dbConnection
    .collection('tasks')
    .updateOne(idQuery, updatedTask, (error, result) => {
      handleError(error, result, response, "1 task updated");
    });
});

// Delete a task
routes.route("/task/delete/:id").delete(async function(request, response) {
  const client = await clientPromise;
  const dbConnection = client.db();
  const idQuery = { _id: ObjectId( request.params.id )};
  dbConnection.collection('tasks').deleteOne(idQuery, (error, result) => {
    handleError(error, result, response, "1 task deleted");
  });
});

module.exports = routes;
