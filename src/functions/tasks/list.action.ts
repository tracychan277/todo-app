// https://levelup.gitconnected.com/creating-a-simple-serverless-application-using-typescript-and-aws-part-1-be2188f5ff93
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';

import schema from './schema';

// Import DB connection
const clientPromise = require('./db/connection');

export const listTasks: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const requestHeaders = event.headers;
  const client = await clientPromise;
  const dbConnection = client.db();
  const userQuery = { userName: requestHeaders.username };
  const order = { dueDate: 1 };
  const result = await dbConnection.collection('tasks').find(userQuery).sort(order).toArray();
  return formatJSONResponse(result);
}
