import pulumi
import pulumi_aws as aws
import pulumi_cloudflare as cloudflare

from utilities import resource, tags

from typing import Optional


class RouterArgs:
    def __init__(
        self,
        tenant_id: str,
        domain_name: pulumi.Input[str],
        api_origin_domain_name: pulumi.Input[str],
        api_origin_path: pulumi.Input[str],
        assets_origin_domain_name: pulumi.Input[str],
        documents_origin_domain_name: pulumi.Input[str],
    ):
        self.tenant_id = tenant_id
        self.domain_name = domain_name
        self.api_origin_domain_name = api_origin_domain_name
        self.api_origin_path = api_origin_path
        self.assets_origin_domain_name = assets_origin_domain_name
        self.documents_origin_domain_name = documents_origin_domain_name


class Router(pulumi.ComponentResource):
    def __init__(self, args: RouterArgs, opts: Optional[pulumi.ResourceOptions] = None):
        super().__init__(
            t="pw:resource:Router", name="Router", props=vars(args), opts=opts
        )

        custom_origin_config = aws.cloudfront.DistributionOriginCustomOriginConfigArgs(
            http_port=80,
            https_port=443,
            origin_protocol_policy="https-only",
            origin_read_timeout=30,
            origin_ssl_protocols=["TLSv1.2"],
        )

        s3_origin_access_control_id = resource["Aws"]["cloudfront"][
            "s3OriginAccessControl"
        ]["id"]

        api_cache_policy_id = resource["Aws"]["cloudfront"]["apiCachePolicy"]["id"]

        all_viewer_except_host_header_policy = (
            aws.cloudfront.get_origin_request_policy_output(
                name="Managed-AllViewerExceptHostHeader"
            )
        )

        caching_optimized_policy = aws.cloudfront.get_cache_policy_output(
            name="Managed-CachingOptimized"
        )

        self.__distribution = aws.cloudfront.Distribution(
            resource_name="Distribution",
            args=aws.cloudfront.DistributionArgs(
                enabled=True,
                comment=f"{args.tenant_id} router",
                origins=[
                    aws.cloudfront.DistributionOriginArgs(
                        origin_id="/api/*",
                        custom_origin_config=custom_origin_config,
                        domain_name=args.api_origin_domain_name,
                        origin_path=args.api_origin_path,
                    ),
                    aws.cloudfront.DistributionOriginArgs(
                        origin_id="/assets/*",
                        origin_access_control_id=s3_origin_access_control_id,
                        domain_name=args.assets_origin_domain_name,
                    ),
                    aws.cloudfront.DistributionOriginArgs(
                        origin_id="/documents/*",
                        origin_access_control_id=s3_origin_access_control_id,
                        domain_name=args.documents_origin_domain_name,
                    ),
                    aws.cloudfront.DistributionOriginArgs(
                        origin_id="/*",
                        domain_name=f"does-not-exist.{resource["AppData"]["domainName"]["value"]}",
                        custom_origin_config=custom_origin_config,
                    ),
                ],
                default_cache_behavior=aws.cloudfront.DistributionDefaultCacheBehaviorArgs(
                    target_origin_id="/*",
                    viewer_protocol_policy="redirect-to-https",
                    allowed_methods=[
                        "GET",
                        "HEAD",
                        "OPTIONS",
                        "PUT",
                        "POST",
                        "PATCH",
                        "DELETE",
                    ],
                    cached_methods=["GET", "HEAD"],
                    default_ttl=0,
                    compress=True,
                    cache_policy_id=api_cache_policy_id,
                    origin_request_policy_id=all_viewer_except_host_header_policy.id,
                    trusted_key_groups=[
                        resource["Aws"]["cloudfront"]["keyGroup"]["id"]
                    ],
                ),
                ordered_cache_behaviors=[
                    aws.cloudfront.DistributionOrderedCacheBehaviorArgs(
                        target_origin_id="/api/*",
                        path_pattern="/api/.well-known/*",
                        viewer_protocol_policy="redirect-to-https",
                        allowed_methods=["GET", "HEAD", "OPTIONS"],
                        cached_methods=["GET", "HEAD"],
                        default_ttl=31536000,  # 1 year
                        compress=True,
                        cache_policy_id=api_cache_policy_id,
                        origin_request_policy_id=all_viewer_except_host_header_policy.id,
                    ),
                    aws.cloudfront.DistributionOrderedCacheBehaviorArgs(
                        target_origin_id="/api/*",
                        path_pattern="/api/parameters/*",
                        viewer_protocol_policy="redirect-to-https",
                        allowed_methods=["GET", "HEAD", "OPTIONS"],
                        cached_methods=["GET", "HEAD"],
                        default_ttl=31536000,  # 1 year
                        compress=True,
                        cache_policy_id=api_cache_policy_id,
                        origin_request_policy_id=all_viewer_except_host_header_policy.id,
                        trusted_key_groups=[
                            resource["Aws"]["cloudfront"]["keyGroup"]["id"]
                        ],
                    ),
                    aws.cloudfront.DistributionOrderedCacheBehaviorArgs(
                        target_origin_id="/api/*",
                        path_pattern="/api/*",
                        viewer_protocol_policy="redirect-to-https",
                        allowed_methods=[
                            "GET",
                            "HEAD",
                            "OPTIONS",
                            "PUT",
                            "POST",
                            "PATCH",
                            "DELETE",
                        ],
                        cached_methods=["GET", "HEAD"],
                        default_ttl=0,
                        compress=True,
                        cache_policy_id=api_cache_policy_id,
                        origin_request_policy_id=all_viewer_except_host_header_policy.id,
                        trusted_key_groups=[
                            resource["Aws"]["cloudfront"]["keyGroup"]["id"]
                        ],
                    ),
                    aws.cloudfront.DistributionOrderedCacheBehaviorArgs(
                        target_origin_id="/assets/*",
                        path_pattern="/assets/*",
                        viewer_protocol_policy="redirect-to-https",
                        allowed_methods=["GET", "HEAD", "OPTIONS"],
                        cached_methods=["GET", "HEAD"],
                        compress=True,
                        cache_policy_id=caching_optimized_policy.id,
                        trusted_key_groups=[
                            resource["Aws"]["cloudfront"]["keyGroup"]["id"]
                        ],
                    ),
                    aws.cloudfront.DistributionOrderedCacheBehaviorArgs(
                        target_origin_id="/documents/*",
                        path_pattern="/documents/*",
                        viewer_protocol_policy="redirect-to-https",
                        allowed_methods=["GET", "HEAD", "OPTIONS"],
                        cached_methods=["GET", "HEAD"],
                        compress=True,
                        cache_policy_id=caching_optimized_policy.id,
                        trusted_key_groups=[
                            resource["Aws"]["cloudfront"]["keyGroup"]["id"]
                        ],
                    ),
                ],
                restrictions=aws.cloudfront.DistributionRestrictionsArgs(
                    geo_restriction=aws.cloudfront.DistributionRestrictionsGeoRestrictionArgs(
                        restriction_type="none"
                    )
                ),
                viewer_certificate=aws.cloudfront.DistributionViewerCertificateArgs(
                    cloudfront_default_certificate=True
                ),
                wait_for_deployment=False,
                tags=tags(args.tenant_id),
            ),
            opts=pulumi.ResourceOptions(parent=self),
        )

        self.__cname = cloudflare.Record(
            resource_name="Cname",
            args=cloudflare.RecordArgs(
                zone_id=cloudflare.get_zone_output(
                    name=resource["AppData"]["domainName"]["value"]
                ).id,
                name=args.domain_name,
                type="CNAME",
                content=self.__distribution.domain_name,
            ),
            opts=pulumi.ResourceOptions(parent=self, delete_before_replace=True),
        )

        self.register_outputs(
            {
                "distribution": self.__distribution.id,
                "cname": self.__cname.id,
            }
        )

    @property
    def distribution_id(self):
        return self.__distribution.id
