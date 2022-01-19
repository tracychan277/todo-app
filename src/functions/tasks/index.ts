import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'tasks',
        // private: true,
        cors: true,
      },
    },
    {
      http: {
        method: 'get',
        path: 'task/{id}',
        // private: true,
        cors: true,
      }
    },
    {
      http: {
        method: 'post',
        path: 'task/add',
        // private: true,
        cors: true,
      }
    },
    {
      http: {
        method: 'post',
        path: 'task/update/{id}',
        // private: true,
        cors: true,
      }
    },
    {
      http: {
        method: 'delete',
        path: 'task/delete/{id}',
        // private: true,
        cors: true,
      }
    },
  ]
}
