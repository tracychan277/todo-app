// Reference: https://javascript.plainenglish.io/build-your-first-serverless-app-with-aws-lambda-api-gateway-express-and-typescript-2020-4841f54514eb
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import cors from 'cors';
import express , { Request, Response } from 'express';
import serverless from 'serverless-http';

import schema from './schema';

const app = express();
app.use(cors());
app.use(express.json());
// app.use(require('./routes/tasks'));
//
const clientPromise = require('./db/connection');

app.get('/tasks', async function(req, res) {
  const client = await clientPromise;
  console.log(client.db().databaseName);
  res.json({'dbName': client.db().databaseName});
});

// const tasks: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
//   console.log(event); // Contains incoming request data (e.g., query params, headers and more)
//
//   return formatJSONResponse([{"_id":"61e2d5f027a80491c7c9587d","description":"Get the carpet steam cleaned","dueDate":"2022-02-12T01:10","userName":"tracy","completed":false},{"_id":"61e2d5fa27a80491c7c9587e","description":"Overdue task","dueDate":"2022-01-14T01:11","userName":"tracy","completed":false}]);
// }

// const handler = serverless(app);

// Import the dependency.
// const clientPromise = require('./db/connection');

// const server: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
//   context.callbackWaitsForEmptyEventLoop = false;
//   // Get the MongoClient by calling await on the promise.
//   // Because this is a promise, it will only resolve once.
//   const client = await clientPromise;
//   // Use the client to return the name of the connected database.
//   console.log(client.db().databaseName);
//   const result = await handler(event, context);
//   return result;
// }

export const main = serverless(app);
