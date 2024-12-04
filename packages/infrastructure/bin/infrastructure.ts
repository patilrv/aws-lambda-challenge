#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import gitBranch from 'git-branch';
import { CDKContext } from "../types";
import { LambdaStack } from '../lib/infrastructure-stack';

export const getContext = async (app: cdk.App): Promise<CDKContext> => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentBranch = await gitBranch()
      const environment = app.node.tryGetContext('environments').find((e: any) => e.branchName === currentBranch);

      const global = app.node.tryGetContext('globals')
      return resolve({ ...global, ...environment })
    }
    catch (error) {
      console.log("error : ", error);
      reject(error)

    }
  })
}


export const createStack = async () => {
  try {
    const app = new cdk.App()

    const context = await getContext(app)
    const tags: any = {
      Environment: context.environment
    }

    const stackProps: cdk.StackProps = {
      env: {
        region: context.region,
        account: context.accountNumber
      },

      stackName: `${context.appName}-stack-${context.environment}`,
      description: `This is the Stack Description`,
      tags,
    }
    new LambdaStack(app, `${context.appName}-stack-${context.environment}`, context, stackProps)

  }
  catch (error) {
    console.log("error : ", error);
  }
}
createStack()
