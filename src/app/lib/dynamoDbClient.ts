import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: "AKIA4MTWG5HG4VDWHI53",
    secretAccessKey: "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",
  },
});

export const ddbDocClient = DynamoDBDocumentClient.from(client);
