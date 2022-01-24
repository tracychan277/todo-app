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

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
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
    {
      http: {
        method: 'get',
        path: 'task/{id}',
        authorizer: cognitoAuthorizer,
        private: true,
        cors: corsOptions,
      }
    },
    {
      http: {
        method: 'post',
        path: 'task/add',
        authorizer: cognitoAuthorizer,
        private: true,
        cors: corsOptions,
      }
    },
    {
      http: {
        method: 'post',
        path: 'task/update/{id}',
        authorizer: cognitoAuthorizer,
        private: true,
        cors: corsOptions,
      }
    },
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
}
