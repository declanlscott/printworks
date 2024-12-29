/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */
import "sst"
export {}
declare module "sst" {
  export interface Resource {
    "Api": {
      "type": "sst.aws.Router"
      "url": string
    }
    "ApiFunction": {
      "arn": string
      "invokeArn": string
      "name": string
      "roleArn": string
      "type": "sst.aws.Function"
      "url": string
    }
    "ApiReverseProxy": {
      "type": "sst.cloudflare.Worker"
      "url": string
    }
    "AppData": {
      "domainName": {
        "fullyQualified": string
        "value": string
      }
      "isDev": boolean
      "name": string
      "stage": string
      "type": "sst.sst.Linkable"
    }
    "Auth": {
      "type": "sst.aws.Auth"
      "url": string
    }
    "Aws": {
      "account": {
        "id": string
      }
      "organization": {
        "email": string
        "id": string
        "managementRole": {
          "arn": string
        }
        "tenantsOrganizationalUnit": {
          "id": string
        }
      }
      "region": string
      "tenant": {
        "accountAccessRole": {
          "name": string
        }
        "bucketsAccessRole": {
          "name": string
        }
        "putParametersRole": {
          "name": string
        }
        "realtimePublisherRole": {
          "name": string
        }
        "realtimeSubscriberRole": {
          "name": string
        }
      }
      "type": "sst.sst.Linkable"
    }
    "BootstrapRoleArn": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "CloudfrontPrivateKey": {
      "pem": string
      "type": "tls.index/privateKey.PrivateKey"
    }
    "CloudfrontPublicKey": {
      "pem": string
      "type": "sst.sst.Linkable"
    }
    "Code": {
      "bucket": {
        "name": string
        "object": {
          "papercutSecureReverseProxy": {
            "key": string
            "versionId": string
          }
        }
      }
      "type": "sst.sst.Linkable"
    }
    "CodeBucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "DomainName": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DsqlCluster": {
      "database": string
      "hostname": string
      "port": number
      "ssl": string
      "type": "pulumi-nodejs.dynamic.Resource"
      "user": string
    }
    "InvoicesProcessor": {
      "arn": string
      "invokeArn": string
      "name": string
      "roleArn": string
      "type": "sst.aws.Function"
    }
    "InvoicesProcessorDeadLetterQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "Oauth2": {
      "entraId": {
        "clientId": string
        "clientSecret": string
      }
      "type": "sst.sst.Linkable"
    }
    "PapercutSync": {
      "arn": string
      "invokeArn": string
      "name": string
      "roleArn": string
      "type": "sst.aws.Function"
    }
    "PulumiBucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "ReplicacheLicenseKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "TenantInfraDeadLetterQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "TenantInfraDispatcher": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "TenantInfraQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "Web": {
      "type": "sst.aws.StaticSite"
      "url": string
    }
    "WebPassword": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "WebUsername": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Www": {
      "type": "sst.aws.Astro"
      "url": string
    }
  }
}
