import { handlerPath } from '@libs/handlerResolver';

const cognitoAuthorizer = {
  type: 'COGNITO_USER_POOLS',
  authorizerId: {
    Ref: 'ApiGatewayAuthorizer',
  },
};

// https://www.serverless.com/blog/cors-api-gateway-survival-guide/
const corsOptions = {
  origin: '*',
  headers: [
    'Content-Type',
    'X-Amz-Date',
    'Authorization',
    'X-Api-Key',
    'X-Amz-Security-Token',
    'X-Amz-User-Agent',
    'Username', // Custom header
  ],
  allowCredentials: false,
};

// https://levelup.gitconnected.com/creating-a-simple-serverless-application-using-typescript-and-aws-part-1-be2188f5ff93
export default {
  addTask: {
    handler: `${handlerPath(__dirname)}/handler.addTask`,
    events: [
      {
        http: {
          method: 'POST',
          path: 'task/add',
          authorizer: cognitoAuthorizer,
          private: true,
          cors: corsOptions,
        }
      }
    ]
  },
  deleteTask: {
    handler: `${handlerPath(__dirname)}/handler.deleteTask`,
    events: [
      {
        http: {
          method: 'delete',
          path: 'task/delete/{id}',
          authorizer: cognitoAuthorizer,
          private: true,
          cors: corsOptions,
        }
      },
    ]
  },
  updateTask: {
    handler: `${handlerPath(__dirname)}/handler.updateTask`,
    events: [
      {
        http: {
          method: 'post',
          path: 'task/update/{id}',
          authorizer: cognitoAuthorizer,
          private: true,
          cors: corsOptions,
        }
      },
    ]
  },
  listTasks: {
    handler: `${handlerPath(__dirname)}/handler.listTasks`,
    events: [
      {
        http: {
          method: 'get',
          path: 'tasks',
          authorizer: cognitoAuthorizer,
          private: true,
          cors: corsOptions,
        },
      },
    ]
  },
  getTask: {
    handler: `${handlerPath(__dirname)}/handler.getTask`,
    events: [
      {
        http: {
          method: 'get',
          path: 'task/{id}',
          authorizer: cognitoAuthorizer,
          private: true,
          cors: corsOptions,
        }
      },
    ]
  }
}
