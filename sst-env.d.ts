/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

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
    "ApiRateLimiterWorker": {
      "type": "sst.cloudflare.Worker"
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
    "AppsyncEventApi": {
      "dns": {
        "http": string
        "realtime": string
      }
      "type": "pulumi-nodejs.dynamic.Resource"
    }
    "Auth": {
      "type": "sst.aws.Auth"
      "url": string
    }
    "Aws": {
      "account": {
        "id": string
      }
      "cloudfront": {
        "apiCachePolicy": {
          "id": string
        }
        "keyGroup": {
          "id": string
        }
        "keyPair": {
          "id": string
        }
        "s3OriginAccessControl": {
          "id": string
        }
      }
      "region": string
      "roles": {
        "pulumi": {
          "arn": string
        }
        "realtimePublisher": {
          "arn": string
        }
        "realtimeSubscriber": {
          "arn": string
        }
      }
      "tenant": {
        "parameters": {
          "documentsMimeTypes": {
            "nameTemplate": string
          }
          "documentsSizeLimit": {
            "nameTemplate": string
          }
          "papercutServerAuthToken": {
            "nameTemplate": string
          }
          "tailnetPapercutServerUri": {
            "nameTemplate": string
          }
          "tailscaleOauthClient": {
            "nameTemplate": string
          }
        }
        "roles": {
          "apiAccess": {
            "nameTemplate": string
          }
          "bucketsAccess": {
            "nameTemplate": string
          }
          "putParameters": {
            "nameTemplate": string
          }
          "realtimePublisher": {
            "nameTemplate": string
          }
          "realtimeSubscriber": {
            "nameTemplate": string
          }
        }
      }
      "type": "sst.sst.Linkable"
    }
    "BudgetEmail": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Cloudflare": {
      "account": {
        "id": string
      }
      "type": "sst.sst.Linkable"
    }
    "CloudflareAccountId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "CloudfrontPrivateKey": {
      "pem": string
      "type": "tls.index/privateKey.PrivateKey"
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
      "host": string
      "port": number
      "ssl": boolean
      "type": "pulumi-nodejs.dynamic.Resource"
      "user": string
    }
    "InfraDeadLetterQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "InfraDispatcher": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "InfraQueue": {
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
    "SitePassword": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "SiteUsername": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Web": {
      "type": "sst.aws.StaticSite"
      "url": string
    }
    "Www": {
      "type": "sst.aws.Astro"
      "url": string
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}