import { handlerPath } from '@libs/handlerResolver';

const cognitoAuthorizer = {
  type: 'COGNITO_USER_POOLS',
  authorizerId: {
    Ref: 'ApiGatewayAuthorizer',
  },
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
        cors: true,
      },
    },
    {
      http: {
        method: 'get',
        path: 'task/{id}',
        authorizer: cognitoAuthorizer,
        private: true,
        cors: true,
      }
    },
    {
      http: {
        method: 'post',
        path: 'task/add',
        authorizer: cognitoAuthorizer,
        private: true,
        cors: true,
      }
    },
    {
      http: {
        method: 'post',
        path: 'task/update/{id}',
        authorizer: cognitoAuthorizer,
        private: true,
        cors: true,
      }
    },
    {
      http: {
        method: 'delete',
        path: 'task/delete/{id}',
        authorizer: cognitoAuthorizer,
        private: true,
        cors: true,
      }
    },
  ]
}
