import pulumi_aws as aws

from .components import Ssl, SslArgs, Storage, StorageArgs, Realtime, RealtimeArgs
from models import sqs_record
from utilities import tags


def inline(payload: sqs_record.Payload):
    ssl = Ssl(args=SslArgs(tenant_id=payload.tenantId))

    gateway = aws.apigateway.RestApi(
        "Gateway",
        aws.apigateway.RestApiArgs(
            endpoint_configuration=aws.apigateway.RestApiEndpointConfigurationArgs(
                types="REGIONAL"
            ),
            tags=tags(payload.tenantId),
        ),
    )

    storage = Storage(args=StorageArgs(tenant_id=payload.tenantId))

    realtime = Realtime(args=RealtimeArgs(tenant_id=payload.tenantId))
