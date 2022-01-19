import type { AWS } from '@serverless/typescript';

import tasks from '@functions/tasks';

const serverlessConfiguration: AWS = {
  service: 'todo-app',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-dotenv-plugin',
    'serverless-single-page-app-plugin',
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
      CloudFrontDistribution: {
        Type: 'AWS::CloudFront::Distribution',
        Properties: {
          DistributionConfig: {
            Origins: [
              {
                DomainName: '${self:resources.Resources.S3Bucket.Properties.BucketName}.s3.amazonaws.com',
                // An identifier for the origin which must be unique within the distribution
                Id: 'Todo App S3',
                CustomOriginConfig: {
                  OriginProtocolPolicy: 'https-only',
                },
              },
            ],
            Enabled: 'true',
            DefaultRootObject: 'index.html',
            // Since the Single Page App is taking care of the routing we need to make sure ever path is served with index.html
            CustomErrorResponses: [
              {
                ErrorCode: 404,
                ResponseCode: 200,
                ResponsePagePath: '/index.html',
              },
            ],
            DefaultCacheBehavior: {
              AllowedMethods: [
                'DELETE',
                'GET',
                'HEAD',
                'OPTIONS',
                'PATCH',
                'POST',
                'PUT',
              ],
              // The origin id defined above
              TargetOriginId: 'Todo App S3',
              // Defining if and how the QueryString and Cookies are forwarded to the origin which in this case is S3
              ForwardedValues: {
                QueryString: 'false',
                Cookies: {
                  Forward: 'none',
                },
              },
              // The protocol that users can use to access the files in the origin. To allow HTTP use `allow-all`
              ViewerProtocolPolicy: 'redirect-to-https',
              // The certificate to use when viewers use HTTPS to request objects.
            },
            ViewerCertificate: {
              CloudFrontDefaultCertificate: 'true'
            },
          },
        },
      },
    },
    // In order to print out the hosted domain via `sls domainInfo` we need to define the DomainName output for CloudFormation
    Outputs: {
      WebAppCloudFrontDistributionOutput: {
        Value: {
          'Fn::GetAtt': [ 'CloudFrontDistribution', 'DomainName' ]
        },
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
  },
};

module.exports = serverlessConfiguration;
