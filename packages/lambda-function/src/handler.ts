import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as fs from "fs";
import * as path from "path";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { resource, httpMethod } = event;

  if (resource === "/docs" && httpMethod === "GET") {
    const openApiSpec = fs.readFileSync(path.join(__dirname, "./openapi.yaml"), "utf-8");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/yaml" },
      body: openApiSpec,
    };
  }

  const name = event.queryStringParameters?.name || "World";
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello, ${name}` }),
  };
};
