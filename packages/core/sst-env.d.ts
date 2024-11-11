/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */
import "sst"
export {}
declare module "sst" {
  export interface Resource {
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
    "Client": {
      "appFqdn": string
      "isDev": boolean
      "replicacheLicenseKey": string
      "type": "sst.sst.Linkable"
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
          "papercutSecureBridgeHandler": {
            "key": string
            "versionId": string
          }
          "tailscaleLayer": {
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
    "Db": {
      "postgres": {
        "url": string
      }
      "type": "sst.sst.Linkable"
    }
    "DomainName": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GoogleClientId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GoogleClientSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "InfraDeadLetterQueue": {
      "type": "sst.aws.Queue"
      "url": string
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
      "google": {
        "clientId": string
        "clientSecret": string
      }
      "type": "sst.sst.Linkable"
    }
    "PulumiBucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "ReplicacheLicenseKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ReverseProxy": {
      "type": "sst.cloudflare.Worker"
      "url": string
    }
    "TenantInfraQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "UsersSync": {
      "arn": string
      "invokeArn": string
      "name": string
      "roleArn": string
      "type": "sst.aws.Function"
    }
    "Web": {
      "server": {
        "role": {
          "principal": string
        }
      }
      "type": "sst.aws.Astro"
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
  }
}
