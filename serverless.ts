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
      apiKeys: [
        {
          free: ['tasks'],
        },
      ],
      usagePlan: [
        {
          free: {
            quota: {
              limit: 5000,
              offset: 2,
              period: 'MONTH',
            },
            throttle: {
              burstLimit: 200,
              rateLimit: 100,
            },
          },
        }
      ],
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
          AccessControl: 'PublicRead', // TODO: Restrict access to the CloudFront distribution
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
              // TODO: Restrict access to the CloudFront distribution
              Action: ['s3:getObject'],
              Effect: 'Allow',
              Resource: 'arn:aws:s3:::todo-app-tracy/*',
              Principal: '*',
            },
          },
        }
      },
      // https://github.com/jonathanconway/serverless-single-page-app-plugin
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
            // Since the SPA is taking care of the routing we need to make sure every path is served through index.html
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
              // The origin ID defined above
              TargetOriginId: '${self:resources.Resources.CloudFrontDistribution.Properties.DistributionConfig.Origins.0.Id}',
              // Defining if and how the QueryString and Cookies are forwarded to the origin which in this case is S3
              ForwardedValues: {
                QueryString: 'false',
                Cookies: {
                  Forward: 'none',
                },
              },
              // The protocol that users can use to access the files in the origin. To allow HTTP use `allow-all`
              ViewerProtocolPolicy: 'redirect-to-https',
            },
            // The certificate to use when viewers use HTTPS to request objects.
            ViewerCertificate: {
              CloudFrontDefaultCertificate: 'true'
            },
          },
        },
      },
      // https://medium.com/@Da_vidgf/using-cognito-for-users-management-in-your-serverless-application-1695fec9e225
      CognitoUserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
          MfaConfiguration: 'OFF',
          UserPoolName: 'todo-user-pool',
          UsernameAttributes: ['email'],
          AutoVerifiedAttributes: ['email'],
          EmailConfiguration: {
            EmailSendingAccount: 'COGNITO_DEFAULT'
          },
          Policies: {
            PasswordPolicy: {
              MinimumLength: 6,
              RequireLowercase: 'False',
              RequireNumbers: 'True',
              RequireSymbols: 'False',
              RequireUppercase: 'True',
            },
          },
        },
      },
      CognitoUserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
          ClientName: 'todo-user-pool-client',
          GenerateSecret: 'False',
          UserPoolId: {
            'Ref': 'CognitoUserPool',
          }
        },
      },
      ApiGatewayAuthorizer: {
        DependsOn: ['ApiGatewayRestApi'],
        Type: 'AWS::ApiGateway::Authorizer',
        Properties: {
          Name: 'todo-app-authorizer',
          IdentitySource: 'method.request.header.Authorization',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
          Type: 'COGNITO_USER_POOLS',
          ProviderARNs: [
            {'Fn::GetAtt': ['CognitoUserPool', 'Arn']},
          ],
        },
      },
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
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
