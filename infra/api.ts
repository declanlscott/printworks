import { appsyncEventApi } from "infra/realtime";

import { auth } from "./auth";
import * as custom from "./custom";
import { dsqlCluster } from "./db";
import { apiFqdn, domainName } from "./dns";
import { appData, aws_, cloudfrontPrivateKey } from "./misc";
import { tenantInfraQueue } from "./queues";

export const apiFunction = new custom.aws.Function("ApiFunction", {
  handler: "packages/functions/node/src/api/index.handler",
  url: true,
  link: [
    appData,
    auth,
    aws_,
    appsyncEventApi,
    cloudfrontPrivateKey,
    dsqlCluster,
    tenantInfraQueue,
  ],
  permissions: [
    {
      actions: ["execute-api:Invoke"],
      resources: [
        $interpolate`arn:aws:execute-api:${aws_.properties.region}:*:${appData.properties.stage}/*`,
      ],
    },
    {
      actions: ["sts:AssumeRole"],
      resources: [
        ...[
          aws_.properties.tenant.roles.realtimeSubscriber.name,
          aws_.properties.tenant.roles.realtimePublisher.name,
          aws_.properties.tenant.roles.bucketsAccess.name,
          aws_.properties.tenant.roles.putParameters.name,
        ].map((roleName) => $interpolate`arn:aws:iam::*:role/${roleName}`),
        aws_.properties.roles.realtimeSubscriber.arn,
        aws_.properties.roles.realtimePublisher.arn,
      ],
    },
  ],
});

export const api = new sst.aws.Router("Api", {
  routes: {
    "/*": apiFunction.url,
  },
  domain: {
    name: apiFqdn,
    dns: sst.cloudflare.dns(),
  },
});

export const apiRateLimiter = new sst.cloudflare.Worker(
  "ApiRateLimiterWorker",
  {
    handler: "packages/workers/src/api-rate-limiter.ts",
    link: [auth],
    url: false,
    // NOTE: In the future when cloudflare terraform provider v5 is released and
    // pulumi/sst supports it, we can remove this transform and bind the rate limiters
    // directly to the worker instead of binding to another worker with the rate limiters.
    transform: {
      worker: {
        serviceBindings: [
          {
            name: "API_RATE_LIMITERS",
            service: "printworks-api-rate-limiters",
          },
        ],
      },
    },
  },
);
new cloudflare.WorkerRoute("ApiRateLimiterWorkerRoute", {
  pattern: $interpolate`${apiFqdn}/*`,
  zoneId: cloudflare.getZoneOutput({ name: domainName.value }).zoneId,
  scriptName: apiRateLimiter.nodes.worker.name,
});

export const outputs = {
  api: api.url,
};
