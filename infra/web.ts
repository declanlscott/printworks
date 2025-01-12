import { api } from "./api";
import { auth } from "./auth";
import { fqdn } from "./dns";
import { appData, replicacheLicenseKey } from "./misc";
import { injectLinkables } from "./utils";
import { www } from "./www";

export const webUsername = new sst.Secret("WebUsername");
export const webPassword = new sst.Secret("WebPassword");

const basicAuth = $output([webUsername.value, webPassword.value]).apply(
  ([username, password]) =>
    Buffer.from(`${username}:${password}`).toString("base64"),
);

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
  edge:
    $app.stage !== "production"
      ? {
          viewerRequest: {
            injection: $interpolate`
if (
  !event.request.headers.authorization ||
  event.request.headers.authorization.value !== "Basic ${basicAuth}"
) {
  return {
    statusCode: 401,
    headers: {
      "www-authenticate": { value: "Basic" }
    }
  };
}`,
          },
        }
      : undefined,
  environment: injectLinkables(
    {
      AppData: appData,
      Api: api,
      Auth: auth,
      ReplicacheLicenseKey: replicacheLicenseKey,
      Www: www,
    },
    "VITE_RESOURCE_",
  ),
});

export const outputs = {
  web: web.url,
};
