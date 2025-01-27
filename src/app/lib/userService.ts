import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./dynamoDbClient";

export async function saveUserToDynamoDB(user: {
  username: string;
  email: string;
  password: string;
}) {
  const params = {
    TableName: process.env.AWS_TABLE_NAME,
    Item: {
      email: user.email,
      username: user.username,
      password: user.password,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    console.log("User saved successfully!");
  } catch (error) {
    console.error("Error saving user:", error);
    throw new Error("Could not save user to DynamoDB.");
  }
}
