import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as fs from "fs";
import * as path from "path";
import * as utils from '/opt/utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { path: requestPath, httpMethod } = event;
  
  utils.logInfo(`event : ${JSON.stringify(event)}`);

  if (requestPath === "/docs" && httpMethod === "GET") {
    try {
      const openApiSpec = fs.readFileSync(path.join(__dirname, "openapi.yaml"), "utf-8");
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/yaml" },
        body: openApiSpec,
      };
    } 
    catch (err) {
      utils.logError(`Error reading OpenAPI spec: ${err}`)
      
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to load documentation." }),
      };
    }
  }

  const name = event.queryStringParameters?.name || "World";
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello, ${name}` }),
  };
};
