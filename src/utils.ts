import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

export async function invokeAsyncLambda(functionName: string, body: any) {
  const client = new LambdaClient();

  const command = new InvokeCommand({
    FunctionName: functionName,
    InvocationType: "Event",
    Payload: JSON.stringify(body),
  });

  const response = await client.send(command);

  return response;
}

export async function sendSlackMessage(channelId: string, blocks: any[]) {
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SLACK_API_TOKEN}`,
    },
    body: JSON.stringify({ channel: channelId, blocks: blocks }),
  });

  const responseJson = await response.json();

  return responseJson;
}
