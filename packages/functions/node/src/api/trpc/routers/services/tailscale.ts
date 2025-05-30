import { Credentials } from "@printdesk/core/aws";
import { Tailscale } from "@printdesk/core/tailscale";
import { tailscaleOauthClientSchema } from "@printdesk/core/tailscale/shared";
import { Resource } from "sst";

import { t } from "~/api/trpc";
import { authz } from "~/api/trpc/middleware/auth";
import { ssmClient } from "~/api/trpc/middleware/aws";
import { userProcedure } from "~/api/trpc/procedures/protected";

import type { InferRouterIO, IO } from "~/api/trpc/types";

export const tailscaleRouter = t.router({
  setOauthClient: userProcedure
    .use(authz("services", "update"))
    .input(tailscaleOauthClientSchema)
    .use(
      ssmClient(() => [
        {
          RoleArn: Credentials.buildRoleArn(
            Resource.TenantRoles.putParameters.nameTemplate,
          ),
          RoleSessionName: "ApiSetTailscaleOauthClient",
        },
      ]),
    )
    .mutation(async ({ input }) => {
      await Tailscale.setOauthClient(input.id, input.secret);
    }),
});

export type TailscaleRouterIO<TIO extends IO> = InferRouterIO<
  TIO,
  typeof tailscaleRouter
>;
