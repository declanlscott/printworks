# Automatically generated by SST
# pylint: disable=all
from typing import Any

class Resource:
    class AwsOrgRootEmail:
        type: str
        value: str
    class Client:
        domain: str
        isDev: bool
        realtimeUrl: str
        replicacheLicenseKey: str
        type: str
    class Cloud:
        class aws:
            class identity:
                accountId: str
                arn: str
                id: str
                userId: str
            manageTenantInfraRoleArn: str
            orgRootEmail: str
            region: str
            tenantsOrganizationalUnitId: str
        class cloudflare:
            apiToken: str
        type: str
    class Db:
        class postgres:
            url: str
        type: str
    class GoogleClientId:
        type: str
        value: str
    class GoogleClientSecret:
        type: str
        value: str
    class ManageTenantInfraRoleArn:
        type: str
        value: str
    class Meta:
        class app:
            name: str
            stage: str
        domain: str
        isDev: bool
        type: str
    class Oauth2:
        class entraId:
            clientId: str
            clientSecret: str
        class google:
            clientId: str
            clientSecret: str
        type: str
    class PartyKitUrl:
        type: str
        value: str
    class PulumiBackendBucket:
        name: str
        type: str
    class Realtime:
        apiKey: str
        type: str
        url: str
    class ReplicacheLicenseKey:
        type: str
        value: str
    class ReverseProxy:
        type: str
        url: str
    class Storage:
        class pulumiBackend:
            bucket: str
        tenantInfraQueue: str
        type: str
    class TenantInfraDlq:
        type: str
        url: str
    class TenantInfraQueue:
        type: str
        url: str
    class TenantsOrganizationalUnitId:
        type: str
        value: str
    class Web:
        type: str
        url: str
    class WebPassword:
        type: str
        value: str
    class WebUsername:
        type: str
        value: str
