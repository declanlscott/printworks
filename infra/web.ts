import { Constants } from "@printworks/core/utils/constants";

import { apiReverseProxy } from "./api";
import { auth, siteEdgeProtection } from "./auth";
import { fqdn } from "./dns";
import { appData, replicacheLicenseKey } from "./misc";
import { injectLinkables } from "./utils";
import { www } from "./www";

export const web = new sst.aws.StaticSite("Web", {
  path: "packages/web",
  build: {
    command: "pnpm build",
    output: "dist",
  },
  domain: {
    name: $interpolate`*.${fqdn}`,
    dns: sst.cloudflare.dns(),
  },
  edge: siteEdgeProtection,
  environment: injectLinkables(
    {
      AppData: appData,
      ApiReverseProxy: apiReverseProxy,
      Auth: auth,
      ReplicacheLicenseKey: replicacheLicenseKey,
      Www: www,
    },
    Constants.VITE_RESOURCE_PREFIX,
  ),
});

export const outputs = {
  web: web.url,
};
