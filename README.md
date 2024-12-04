# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

# API Gateway
Api Gateway URL for accessing AWS lambda function to test APIs : https://m1zgtm3mx3.execute-api.us-east-1.amazonaws.com/dev
* `/hello?name=Jack`   Hello/Greeting response
* `/docs`   To get open API documentation

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
