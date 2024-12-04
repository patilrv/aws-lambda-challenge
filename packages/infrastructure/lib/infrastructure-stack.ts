import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CDKContext } from "../types";
import * as iam from 'aws-cdk-lib/aws-iam';
import { getLambdaDefinitions, getFunctionProps } from './lambda-config';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cwLogs from 'aws-cdk-lib/aws-logs';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, context: CDKContext, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda Role
    const lambdaRole = new iam.Role(this, 'lambdaRole', {
      roleName: `${context.appName}-lambda-role-${context.environment}`,
      description: `Lambda role for ${context.appName}`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'),
      iam.ManagedPolicy.fromManagedPolicyArn(
        this,
        'lambdaVPCAccessPolicy',
        'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
      ),],
    });

    // Attach inline policies to Lambda role
    lambdaRole.attachInlinePolicy(
      new iam.Policy(this, 'lambdaExecutionAccess', {
        policyName: 'lambdaExecutionAccess',
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: ['*'],
            actions: [
              'logs:CreateLogGroup',
              'logs:CreateLogStream',
              'logs:DescribeLogGroups',
              'logs:DescribeLogStreams',
              'logs:PutLogEvents',
            ],
          }),
        ],
      })
    );

    // Lambda Layer
    const lambdaLayer = new lambda.LayerVersion(this, 'lambdaLayer', {
      code: lambda.Code.fromAsset('lambda-layer'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_LATEST],
      description: `Lambda Layer for ${context.appName}`,
    });

    // Get Lambda definitions
    const lambdaDefinition = getLambdaDefinitions(context);
    
    // Get function props based on lambda definition
    let functionProps = getFunctionProps(lambdaDefinition, lambdaRole, lambdaLayer, context);
    
    // Lambda Function
    const lambdaFunction = new NodejsFunction(this, `${lambdaDefinition.name}`, functionProps);

    // Create corresponding Log Group with one month retention
    new cwLogs.LogGroup(this, `fn-${lambdaDefinition.name}-log-group`, {
      logGroupName: `/aws/lambda/${context.appName}-${lambdaDefinition.name}-${context.environment}`,
      retention: cwLogs.RetentionDays.ONE_MONTH,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // const endpoint = new apigateway.LambdaRestApi(this, `ApiGwEndpoint`, {
    //   handler: lambdaFunction,
    //   restApiName: `HelloApi`,
    // });

    // API Gateway
    const api = new apigateway.RestApi(this, "HelloApi", {
      restApiName: "Hello API",
      deployOptions: {
        stageName: "dev",
      },
    });

    // Add /hello route
    const helloResource = api.root.addResource("hello");
    helloResource.addMethod("GET", new apigateway.LambdaIntegration(lambdaFunction));

    // Add /docs route
    const docsResource = api.root.addResource("docs");
    docsResource.addMethod("GET", new apigateway.LambdaIntegration(lambdaFunction));

  }
}

