// https://levelup.gitconnected.com/creating-a-simple-serverless-application-using-typescript-and-aws-part-1-be2188f5ff93
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';

import schema from './schema';

// Import DB connection
const clientPromise = require('./db/connection');

export const addTask: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const requestData = JSON.parse(event.body);
    const client = await clientPromise;
    const dbConnection = client.db();
    const newTask = {
        description: requestData.description,
        dueDate: requestData.dueDate,
        userName: requestData.userName,
        completed: requestData.completed,
    }
    const result = await dbConnection.collection('tasks').insertOne(newTask);
    return formatJSONResponse(result);
}
