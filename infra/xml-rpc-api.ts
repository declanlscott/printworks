import { fckNatSg, privateSubnet } from "./vpc";

export const xmlRpcApi = new sst.aws.Function("XmlRpcApi", {
  handler: "packages/functions/src/xml-rpc-api.handler",
  timeout: "10 seconds",
  permissions: [
    {
      actions: ["ssm:GetParameter"],
      resources: [
        $interpolate`arn:aws:ssm:${aws.getRegionOutput().name}:${aws.getCallerIdentityOutput().accountId}:parameter/paperwait/org/*/papercut`,
      ],
    },
  ],
  vpc: {
    securityGroups: [fckNatSg.id],
    subnets: [privateSubnet.id],
  },
});
