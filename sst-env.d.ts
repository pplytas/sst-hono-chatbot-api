/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "ChatbotWorker": {
      "name": string
      "type": "sst.aws.Function"
    }
    "OpenaiApiKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "SlackApiToken": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "SlackEventReceiver": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "SlackEventToken": {
      "type": "sst.sst.Secret"
      "value": string
    }
  }
}
export {}
