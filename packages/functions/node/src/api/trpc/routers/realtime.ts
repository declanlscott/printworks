import { Realtime } from "@printworks/core/realtime";
import { useTenant } from "@printworks/core/tenants/context";
import { Credentials } from "@printworks/core/utils/aws";
import { Resource } from "sst";
import * as v from "valibot";

import { t } from "~/api/trpc";
import { appsyncSigner, executeApiSigner } from "~/api/trpc/middleware/aws";
import {
  systemProcedure,
  userProcedure,
} from "~/api/trpc/procedures/protected";

export const realtimeRouter = t.router({
  getPublicUrl: systemProcedure.query(async () => Realtime.getUrl()),
  getPublicAuth: systemProcedure
    .input(
      v.object({ channel: v.optional(v.pipe(v.string(), v.startsWith("/"))) }),
    )
    .meta({
      kind: "aws-assume-role",
      getInput: () => ({
        RoleArn: Resource.Aws.roles.realtimeSubscriber.arn,
        RoleSessionName: "PublicRealtimeSubscriber",
      }),
    })
    .use(appsyncSigner)
    .query(async ({ input }) => Realtime.getAuth(JSON.stringify(input))),
  getUrl: userProcedure
    .meta({
      kind: "aws-assume-role",
      getInput: () => ({
        RoleArn: Credentials.buildRoleArn(
          Resource.Aws.account.id,
          Resource.Aws.tenant.roles.apiAccess.nameTemplate,
          useTenant().id,
        ),
        RoleSessionName: "ApiGetRealtimeUrl",
      }),
    })
    .use(executeApiSigner)
    .query(async () => Realtime.getUrl((await Realtime.getDns()).realtime)),
  getAuth: userProcedure
    .input(
      v.object({
        channel: v.optional(v.pipe(v.string(), v.startsWith("/"))),
      }),
    )
    .meta({
      kind: "aws-assume-role",
      getInput: () => ({
        RoleArn: Credentials.buildRoleArn(
          Resource.Aws.account.id,
          Resource.Aws.tenant.roles.realtimeSubscriber.nameTemplate,
          useTenant().id,
        ),
        RoleSessionName: "TenantRealtimeSubscriber",
      }),
    })
    .use(appsyncSigner)
    .query(async ({ input }) =>
      Realtime.getAuth((await Realtime.getDns()).http, JSON.stringify(input)),
    ),
});
