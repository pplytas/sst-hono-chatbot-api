import { Resource } from "sst";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { invokeAsyncLambda } from "./utils";

const app = new Hono();

app.post("/slack/event", async (c) => {
  const body = await c.req.json();

  // Prevent unauthorized requests
  if (body?.token !== process.env.SLACK_EVENT_TOKEN) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  // Handle the url_verification event
  if (body.type === "url_verification") {
    return c.json({ challenge: body.challenge });
  }

  // Handle the message event
  if (body.type === "event_callback" && !body.event.bot_id) {
    await invokeAsyncLambda(Resource.ChatbotWorker.name, body);

    return c.json({ message: "success" });
  }

  return c.json({ message: "success" });
});

export const handler = handle(app);
