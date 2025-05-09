import { domainName, fqdn } from "./dns";
import { tenantParameters } from "./parameters";
import {
  pulumiRole,
  realtimePublisherRole,
  realtimeSubscriberRole,
  tenantRoles,
} from "./roles";

sst.Linkable.wrap(tls.PrivateKey, (privateKey) => ({
  properties: {
    pem: privateKey.privateKeyPem,
  },
}));

sst.Linkable.wrap(random.RandomPassword, (password) => ({
  properties: {
    value: password.result,
  },
}));

export const isDevMode = $dev;
export const isProdStage = $app.stage === "production";

export const cloudflareAccountId = new sst.Secret("CloudflareAccountId");

export const replicacheLicenseKey = new sst.Secret("ReplicacheLicenseKey");

export const appData = new sst.Linkable("AppData", {
  properties: {
    name: $app.name,
    stage: $app.stage,
    isDevMode,
    isProdStage,
    domainName: {
      value: domainName.value,
      fullyQualified: fqdn,
    },
  },
});

export const cloudfrontPrivateKey = new tls.PrivateKey("CloudfrontPrivateKey", {
  algorithm: "RSA",
  rsaBits: 2048,
});

export const cloudfrontPublicKey = new aws.cloudfront.PublicKey(
  "CloudfrontPublicKey",
  { encodedKey: cloudfrontPrivateKey.publicKeyPem },
);

export const cloudfrontKeyGroup = new aws.cloudfront.KeyGroup(
  "CloudfrontKeyGroup",
  { items: [cloudfrontPublicKey.id] },
);

export const cloudfrontApiCachePolicy = new aws.cloudfront.CachePolicy(
  "CloudfrontApiCachePolicy",
  {
    defaultTtl: 0,
    minTtl: 0,
    maxTtl: 31536000, // 1 year
    parametersInCacheKeyAndForwardedToOrigin: {
      cookiesConfig: {
        cookieBehavior: "none",
      },
      headersConfig: {
        headerBehavior: "none",
      },
      queryStringsConfig: {
        queryStringBehavior: "none",
      },
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    },
  },
);

export const cloudfrontS3OriginAccessControl =
  new aws.cloudfront.OriginAccessControl("CloudfrontS3OriginAccessControl", {
    originAccessControlOriginType: "s3",
    signingBehavior: "always",
    signingProtocol: "sigv4",
  });

export const cloudfrontRewriteUriFunction = new aws.cloudfront.Function(
  "CloudfrontRewriteUriFunction",
  {
    runtime: "cloudfront-js-2.0",
    code: [
      `function handler(event) {`,
      `  let request = event.request;`,
      `  request.uri = request.uri.replace(/^\\/[^\\/]*\\//, "/");`,
      `  return request;`,
      `}`,
    ].join("\n"),
  },
);

// Group of non-sensitive AWS metadata
export const aws_ = new sst.Linkable("Aws", {
  properties: {
    account: { id: aws.getCallerIdentityOutput().accountId },
    region: aws.getRegionOutput().name,
    tenant: {
      roles: tenantRoles,
      parameters: tenantParameters,
    },
    roles: {
      realtimeSubscriber: { arn: realtimeSubscriberRole.arn },
      realtimePublisher: { arn: realtimePublisherRole.arn },
      pulumi: { arn: pulumiRole.arn },
    },
    cloudfront: {
      keyPair: { id: cloudfrontPublicKey.id },
      keyGroup: { id: cloudfrontKeyGroup.id },
      apiCachePolicy: { id: cloudfrontApiCachePolicy.id },
      s3OriginAccessControl: { id: cloudfrontS3OriginAccessControl.id },
      rewriteUriFunction: { arn: cloudfrontRewriteUriFunction.arn },
    },
  },
});

export const cloudflare_ = new sst.Linkable("Cloudflare", {
  properties: {
    account: { id: cloudflareAccountId.value },
  },
});

export const cloudflareApiTokenParameter = new aws.ssm.Parameter(
  "CloudflareApiToken",
  {
    name: `/${$app.name}/${$app.stage}/cloudflare/api-token`,
    type: aws.ssm.ParameterType.SecureString,
    value: process.env.CLOUDFLARE_API_TOKEN!,
  },
);

export const budgetEmail = new sst.Secret("BudgetEmail");
export const budget = new aws.budgets.Budget("Budget", {
  budgetType: "COST",
  limitAmount: "1",
  limitUnit: "USD",
  timeUnit: "MONTHLY",
  notifications: [
    {
      comparisonOperator: "GREATER_THAN",
      threshold: 100,
      thresholdType: "PERCENTAGE",
      notificationType: "FORECASTED",
      subscriberEmailAddresses: [budgetEmail.value],
    },
  ],
});
