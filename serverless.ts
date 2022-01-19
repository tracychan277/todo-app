import type { AWS } from '@serverless/typescript';

import tasks from '@functions/tasks';

const serverlessConfiguration: AWS = {
  service: 'todo-app',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-dotenv-plugin',
    // 'serverless-s3-sync',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'ap-southeast-2',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { tasks },
  resources: {
    Resources: {
      S3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          AccessControl: 'PublicRead',
          WebsiteConfiguration: {
            IndexDocument: 'index.html',
          },
          BucketName: 'todo-app-tracy',
        },
      },
      BucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: '${self:resources.Resources.S3Bucket.Properties.BucketName}',
          PolicyDocument: {
            Statement: {
              Action: ['s3:getObject'],
              Effect: 'Allow',
              Resource: 'arn:aws:s3:::todo-app-tracy/*',
              Principal: '*',
            },
          },
        }
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    // s3Sync: [
    //   {
    //     bucketName: 'todo-app-tracy',
    //     localDir: 'react/build/',
    //   }
    // ],
  },
};

module.exports = serverlessConfiguration;
