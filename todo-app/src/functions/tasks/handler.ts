// Reference: https://javascript.plainenglish.io/build-your-first-serverless-app-with-aws-lambda-api-gateway-express-and-typescript-2020-4841f54514eb
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import express from 'express';

import schema from './schema';

const tasks: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  console.log(event); // Contains incoming request data (e.g., query params, headers and more)

  return formatJSONResponse([{"_id":"61e2d5f027a80491c7c9587d","description":"Get the carpet steam cleaned","dueDate":"2022-02-12T01:10","userName":"tracy","completed":false},{"_id":"61e2d5fa27a80491c7c9587e","description":"Overdue task","dueDate":"2022-01-14T01:11","userName":"tracy","completed":false}]);
}

export const main = middyfy(tasks);
