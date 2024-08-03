import { generateObject, jsonSchema } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { sendSlackMessage } from "./utils";

export async function handler(body) {
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: jsonSchema<{
      blocks: Array<{ type: string; text: { type: string; text: string } }>;
    }>({
      type: "object",
      properties: {
        blocks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
              },
              text: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                  },
                  text: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    }),
    system: "Generate an answer using the Slack Block Kit syntax.",
    prompt: body.event.text,
  });

  await sendSlackMessage(body.event.channel, object.blocks);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "success" }),
  };
}
