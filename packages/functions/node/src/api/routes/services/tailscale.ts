import { vValidator } from "@hono/valibot-validator";
import { Tailscale } from "@printworks/core/tailscale";
import { updateTailscaleOauthClientSchema } from "@printworks/core/tailscale/shared";
import { Hono } from "hono";
import { Resource } from "sst";

import { authz } from "~/api/middleware/auth";
import { executeApiSigner, ssmClient } from "~/api/middleware/aws";
import { authzValidator } from "~/api/middleware/validators";

export default new Hono().put(
  "/oauth-client",
  authz("services", "update"),
  authzValidator,
  vValidator("json", updateTailscaleOauthClientSchema),
  executeApiSigner,
  ssmClient({
    name: Resource.Aws.tenant.roles.putParameters.name,
    sessionName: "ApiSetTailscaleOauthClient",
  }),
  async (c) => {
    await Tailscale.setOauthClient(
      c.req.valid("json").id,
      c.req.valid("json").secret,
    );

    return c.body(null, 204);
  },
);
