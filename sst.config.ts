/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "hono-chatbot-api",
      home: "aws",
      removal: input?.stage === "production" ? "retain" : "remove",
    };
  },
  async run() {
    const openaiApiKeySecret = new sst.Secret("OpenaiApiKey");
    const slackApiTokenSecret = new sst.Secret("SlackApiToken");
    const slackEventTokenSecret = new sst.Secret("SlackEventToken");

    const worker = new sst.aws.Function("ChatbotWorker", {
      handler: "src/worker.handler",
      environment: {
        OPENAI_API_KEY: openaiApiKeySecret.value,
        SLACK_API_TOKEN: slackApiTokenSecret.value,
      },
    });

    const receiver = new sst.aws.Function("SlackEventReceiver", {
      handler: "src/receiver.handler",
      url: true,
      link: [worker],
      environment: {
        SLACK_EVENT_TOKEN: slackEventTokenSecret.value,
      },
    });

    return {
      receiverUrl: receiver.url,
    };
  },
});
