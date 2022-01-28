// https://levelup.gitconnected.com/creating-a-simple-serverless-application-using-typescript-and-aws-part-1-be2188f5ff93
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { ObjectId } from 'mongodb';

import schema from './schema';

// Import DB connection
const clientPromise = require('./db/connection');

export const updateTask: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const requestData = JSON.parse(event.body);
  const client = await clientPromise;
  const dbConnection = client.db();
  const idQuery = { _id: new ObjectId( event.pathParameters.id )};
  const updatedTask = {
    $set: {
      description: requestData.description,
      dueDate: requestData.dueDate,
      userName: requestData.userName,
      completed: requestData.completed,
    },
  };
  const result = dbConnection.collection('tasks').updateOne(idQuery, updatedTask);
  return formatJSONResponse(result);
}
