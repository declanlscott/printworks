import { useMemo } from "react";
import {
  billingAccountCustomerAuthorizationsTableName,
  billingAccountManagerAuthorizationsTableName,
  billingAccountsTableName,
} from "@printworks/core/billing-accounts/shared";
import { productsTableName } from "@printworks/core/products/shared";
import { Replicache } from "@printworks/core/replicache/client";
import {
  deliveryOptionsTableName,
  roomsTableName,
  workflowStatusesTableName,
} from "@printworks/core/rooms/shared";
import { tenantsTableName } from "@printworks/core/tenants/shared";
import { usersTableName } from "@printworks/core/users/shared";
import { HttpError } from "@printworks/core/utils/errors";
import * as R from "remeda";

import { useApi } from "~/lib/hooks/api";
import { useReplicache } from "~/lib/hooks/replicache";
import { AuthStoreApi } from "~/lib/stores/auth";

import type { BillingAccount } from "@printworks/core/billing-accounts/sql";
import type {
  UpdateServerAuthToken,
  UpdateServerTailnetUri,
} from "@printworks/core/papercut/shared";
import type { Product } from "@printworks/core/products/sql";
import type { DeliveryOptions, Workflow } from "@printworks/core/rooms/shared";
import type { Room } from "@printworks/core/rooms/sql";
import type { TailscaleOauthClient } from "@printworks/core/tailscale/shared";
import type { Tenant } from "@printworks/core/tenants/sql";
import type { User } from "@printworks/core/users/sql";
import type { MutationOptions, Query } from "~/types";

export const query = {
  billingAccounts: () => (tx) => Replicache.scan(tx, billingAccountsTableName),
  billingAccount: (accountId: BillingAccount["id"]) => (tx) =>
    Replicache.get(tx, billingAccountsTableName, accountId),
  billingAccountCustomerAuthorizations: () => (tx) =>
    Replicache.scan(tx, billingAccountCustomerAuthorizationsTableName),
  billingAccountManagerAuthorizations: () => (tx) =>
    Replicache.scan(tx, billingAccountManagerAuthorizationsTableName),
  deliveryOptions: (roomId: Room["id"]) => async (tx) =>
    Replicache.scan(tx, deliveryOptionsTableName).then((options) =>
      R.pipe(
        options,
        R.filter((option) => option.roomId === roomId),
        R.sortBy(R.prop("index")),
        R.reduce((options, option) => {
          options.push({
            id: option.id,
            description: option.description,
            detailsLabel: option.detailsLabel,
            cost: option.cost,
          });

          return options;
        }, [] as DeliveryOptions),
      ),
    ),
  managedBillingAccountIds: (managerId: User["id"]) => async (tx) =>
    Replicache.scan(tx, billingAccountManagerAuthorizationsTableName).then(
      (authorizations) =>
        R.pipe(
          authorizations,
          R.filter((a) => a.managerId === managerId),
          R.map(R.prop("billingAccountId")),
        ),
    ),
  managedCustomerIds: (managerId: User["id"]) => async (tx) =>
    Replicache.scan(tx, billingAccountManagerAuthorizationsTableName).then(
      (authorizations) =>
        R.pipe(
          authorizations,
          R.filter((a) => a.managerId === managerId),
          R.map(R.prop("billingAccountId")),
          async (managedBillingAccountIds) =>
            Replicache.scan(
              tx,
              billingAccountCustomerAuthorizationsTableName,
            ).then((authorizations) =>
              R.pipe(
                authorizations,
                R.filter((a) =>
                  managedBillingAccountIds.includes(a.billingAccountId),
                ),
                R.map(R.prop("customerId")),
              ),
            ),
        ),
    ),
  products: () => (tx) => Replicache.scan(tx, productsTableName),
  product: (productId: Product["id"]) => (tx) =>
    Replicache.get(tx, productsTableName, productId),
  tenant: (tenantId: Tenant["id"]) => (tx) =>
    Replicache.get(tx, tenantsTableName, tenantId),
  rooms: () => (tx) => Replicache.scan(tx, roomsTableName),
  room: (roomId: Room["id"]) => (tx) =>
    Replicache.get(tx, roomsTableName, roomId),
  users: () => (tx) => Replicache.scan(tx, usersTableName),
  user: (userId: User["id"]) => (tx) =>
    Replicache.get(tx, usersTableName, userId),
  workflow: (roomId: Room["id"]) => async (tx) =>
    Replicache.scan(tx, workflowStatusesTableName).then((statuses) =>
      R.pipe(
        statuses,
        R.filter((status) => status.roomId === roomId),
        R.sortBy(R.prop("index")),
        R.reduce((workflow, status) => {
          if (status.type !== "Review")
            workflow.push({
              id: status.id,
              type: status.type,
              color: status.color,
              charging: status.charging,
            });

          return workflow;
        }, [] as Workflow),
      ),
    ),
} satisfies Query;

export const useMutator = () => useReplicache().mutate;

export function useMutationOptions() {
  const api = useApi();

  const { getAuth, refresh } = AuthStoreApi.useActions();

  return useMemo(
    () =>
      ({
        papercutServerTailnetUri: () => ({
          mutationKey: ["services", "papercut", "server", "tailnet-uri"],
          mutationFn: async ({ tailnetUri }: UpdateServerTailnetUri) => {
            const call = async () =>
              api.client.services.papercut.server["tailnet-uri"].$put({
                header: { authorization: getAuth() },
                json: { tailnetUri },
              });

            const res = await call();
            if ((res.status as number) === 401) await refresh().then(call);
            if (!res.ok) throw new HttpError.Error(res.statusText, res.status);
          },
        }),
        papercutServerAuthToken: () => ({
          mutationKey: ["services", "papercut", "server", "auth-token"],
          mutationFn: async ({ authToken }: UpdateServerAuthToken) => {
            const call = async () =>
              api.client.services.papercut.server["auth-token"].$put({
                header: { authorization: getAuth() },
                json: { authToken },
              });

            const res = await call();
            if ((res.status as number) === 401) await refresh().then(call);
            if (!res.ok) throw new HttpError.Error(res.statusText, res.status);
          },
        }),
        tailscaleOauthClient: () => ({
          mutationKey: ["services", "tailscale", "oauth-client"],
          mutationFn: async ({ id, secret }: TailscaleOauthClient) => {
            const call = async () =>
              api.client.services.tailscale["oauth-client"].$put({
                header: { authorization: getAuth() },
                json: { id, secret },
              });

            const res = await call();
            if ((res.status as number) === 401) await refresh().then(call);
            if (!res.ok) throw new HttpError.Error(res.statusText, res.status);
          },
        }),
      }) satisfies MutationOptions,
    [api, getAuth, refresh],
  );
}
