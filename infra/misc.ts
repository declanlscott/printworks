import { domainName, fqdn } from "./dns";
import {
  organization,
  organizationManagementRole,
  tenantAccountAccessRoleName,
  tenantsOrganizationalUnit,
} from "./organization";

export const isDev = $dev;

export const replicacheLicenseKey = new sst.Secret("ReplicacheLicenseKey");

export const appData = new sst.Linkable("AppData", {
  properties: {
    name: $app.name,
    stage: $app.stage,
    isDev,
    domainName: {
      value: domainName.value,
      fullyQualified: fqdn,
    },
  },
});

export const aws_ = new sst.Linkable("Aws", {
  properties: {
    organization: {
      id: organization.id,
      email: organization.masterAccountEmail,
      managementRole: {
        arn: organizationManagementRole.arn,
      },
      tenantsOrganizationalUnit: {
        id: tenantsOrganizationalUnit.id,
      },
    },
    account: {
      id: aws.getCallerIdentityOutput().accountId,
    },
    region: aws.getRegionOutput().name,
    tenant: {
      accountAccessRole: {
        name: tenantAccountAccessRoleName,
      },
      realtimeSubscriberRole: {
        name: "TenantRealtimeSubscriberRole",
      },
      realtimePublisherRole: {
        name: "TenantRealtimePublisherRole",
      },
      bucketsAccessRole: {
        name: "TenantBucketsAccessRole",
      },
      putParametersRole: {
        name: "TenantPutParametersRole",
      },
    },
  },
});

sst.Linkable.wrap(tls.PrivateKey, (privateKey) => ({
  properties: {
    pem: privateKey.privateKeyPem,
  },
}));

export const cloudfrontPrivateKey = new tls.PrivateKey("CloudfrontPrivateKey", {
  algorithm: "RSA",
  rsaBits: 2048,
});

export const cloudfrontPublicKey = new sst.Linkable("CloudfrontPublicKey", {
  properties: {
    pem: cloudfrontPrivateKey.publicKeyPem,
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
      subscriberEmailAddresses: [organization.masterAccountEmail],
    },
  ],
});
