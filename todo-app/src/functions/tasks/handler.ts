// Reference: https://javascript.plainenglish.io/build-your-first-serverless-app-with-aws-lambda-api-gateway-express-and-typescript-2020-4841f54514eb
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import cors from 'cors';
import express, { Request, Response } from 'express';
import serverless from 'serverless-http';

import schema from './schema';

const app = express();
app.use(cors());
app.use(express.json());
app.use(require('./routes/tasks'));

const handler = serverless(app);

// Import the dependency.
const clientPromise = require('./db/connection');

const server: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // Get the MongoClient by calling await on the promise.
  // Because this is a promise, it will only resolve once.
  const client = await clientPromise;
  // Use the client to return the name of the connected database.
  console.log(client.db().databaseName);
  const result = await handler(event, context);
  return result;
}

export const main = middyfy(server);
