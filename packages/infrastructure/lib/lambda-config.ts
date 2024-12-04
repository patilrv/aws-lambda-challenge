import { Duration } from 'aws-cdk-lib';
import { LambdaDefinition, CDKContext } from '../types';
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from "path";

// Constants
const DEFAULT_LAMBDA_MEMORY_MB = 1024;
const DEFAULT_LAMBDA_TIMEOUT_MINS = 10;

// Returns lambda definitions with custom env
export const getLambdaDefinitions = (context: CDKContext): LambdaDefinition => {
  const lambdaDefinitions: LambdaDefinition = {
    name: 'hello-function',
    environment: {
      REGION: context.region,
      ENV: context.environment,
      GIT_BRANCH: context.branchName,
    },
    isPrivate: false,
  }

  return lambdaDefinitions;
};

// Returns Lambda Function properties with defaults and overwrites
export const getFunctionProps = (
  lambdaDefinition: LambdaDefinition,
  lambdaRole: iam.Role,
  lambdaLayer: lambda.LayerVersion,
  context: CDKContext
): NodejsFunctionProps => {
  const functionProps: NodejsFunctionProps = {
    functionName: `${context.appName}-${lambdaDefinition.name}-${context.environment}`,
    entry: path.join(__dirname, "../../lambda-function/src/handler.ts"),
    handler: "handler",
    runtime: lambda.Runtime.NODEJS_LATEST,
    memorySize: lambdaDefinition.memoryMB ? lambdaDefinition.memoryMB : DEFAULT_LAMBDA_MEMORY_MB,
    timeout: lambdaDefinition.timeoutMins ? Duration.minutes(lambdaDefinition.timeoutMins) : Duration.minutes(DEFAULT_LAMBDA_TIMEOUT_MINS),
    // environment: lambdaDefinition.environment,
    role: lambdaRole,
    layers: [lambdaLayer],
    bundling: {
      externalModules: ["aws-sdk"], // Exclude AWS SDK since it's available in Lambda runtime
      commandHooks: {
        beforeBundling(inputDir: string, outputDir: string): string[] {
          const sourcePath = path.posix.join(inputDir, "packages/lambda-function/src/openapi.yaml");
          const destinationPath = path.posix.join(outputDir, "openapi.yaml");
          return [`cp ${sourcePath} ${destinationPath}`];
        },
        afterBundling(inputDir: string, outputDir: string): string[] {
          return [];
        },
        beforeInstall() {
          return [];
        },
      },
    }
  };
  return functionProps;
};