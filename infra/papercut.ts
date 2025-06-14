import { identityProviders } from "./auth";
import { cloudfrontPrivateKey, cloudfrontPublicKey } from "./cdn";
import * as custom from "./custom";
import { dsqlCluster } from "./db";
import { domains, tenantDomains } from "./dns";
import { tenantRoles } from "./iam";
import { appData, aws_, resourceFileName, resourcePrefix } from "./misc";
import { repository } from "./storage";
import { injectLinkables, normalizePath } from "./utils";

const papercutTailgatePath = normalizePath(
  "packages/go/services/papercut-tailgate",
);

export const papercutTailgateResourceCiphertext = new custom.Ciphertext(
  "PapercutTailgateResourceCiphertext",
  {
    plaintext: $jsonStringify(
      injectLinkables(resourcePrefix, appData, aws_, tenantDomains),
    ),
    writeToFile: normalizePath(resourceFileName, papercutTailgatePath),
  },
);

export const papercutTailgateSstKeyParameter = new aws.ssm.Parameter(
  "PapercutTailgateSstKey",
  {
    name: `/${$app.name}/${$app.stage}/papercut-tailgate/sst-key`,
    type: aws.ssm.ParameterType.SecureString,
    value: papercutTailgateResourceCiphertext.encryptionKey,
  },
);

export const papercutTailgateImage = new awsx.ecr.Image(
  "PapercutTailgateImage",
  {
    repositoryUrl: repository.url,
    context: papercutTailgatePath,
    platform: "linux/arm64",
    imageTag: "latest",
  },
  { dependsOn: [papercutTailgateResourceCiphertext] },
);

export const papercutSync = new custom.aws.Function("PapercutSync", {
  handler: "packages/functions/src/papercut-sync.handler",
  timeout: "20 seconds",
  link: [
    appData,
    aws_,
    cloudfrontPublicKey,
    cloudfrontPrivateKey,
    domains,
    dsqlCluster,
    identityProviders,
    tenantDomains,
    tenantRoles,
  ],
});

export const invoicesProcessor = new custom.aws.Function("InvoicesProcessor", {
  handler: "packages/functions/src/invoices-processor.handler",
  timeout: "20 seconds",
  link: [
    appData,
    aws_,
    cloudfrontPublicKey,
    cloudfrontPrivateKey,
    domains,
    dsqlCluster,
    tenantDomains,
    tenantRoles,
  ],
  permissions: [
    sst.aws.permission({
      actions: [
        "sqs:ChangeMessageVisibility",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes",
        "sqs:GetQueueUrl",
        "sqs:ReceiveMessage",
      ],
      resources: ["*"],
    }),
  ],
});
