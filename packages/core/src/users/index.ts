import { and, eq, getTableName, inArray, sql } from "drizzle-orm";
import * as R from "remeda";

import { AccessControl } from "../access-control";
import {
  billingAccountCustomerAuthorizationsTable,
  billingAccountManagerAuthorizationsTable,
  billingAccountsTable,
} from "../billing-accounts/sql";
import { buildConflictUpdateColumns } from "../database/columns";
import { afterTransaction, useTransaction } from "../database/context";
import { ordersTable } from "../orders/sql";
import { poke } from "../replicache/poke";
import { useTenant } from "../tenants/context";
import { fn } from "../utils/shared";
import {
  deleteUserMutationArgsSchema,
  restoreUserMutationArgsSchema,
  updateUserRoleMutationArgsSchema,
} from "./shared";
import { usersTable } from "./sql";

import type { InferInsertModel } from "drizzle-orm";
import type { BillingAccount } from "../billing-accounts/sql";
import type { Order } from "../orders/sql";
import type { PartialExcept, Prettify } from "../utils/types";
import type { UserRole } from "./shared";
import type { User, UserByOrigin, UsersTable } from "./sql";

export namespace Users {
  export const put = async (values: Array<InferInsertModel<UsersTable>>) =>
    useTransaction((tx) =>
      tx
        .insert(usersTable)
        .values(values)
        .onConflictDoUpdate({
          target: [usersTable.id, usersTable.tenantId],
          set: {
            ...buildConflictUpdateColumns(usersTable, [
              "origin",
              "username",
              "subjectId",
              "identityProviderId",
              "name",
              "email",
              "role",
              "createdAt",
              "updatedAt",
              "deletedAt",
            ]),
            version: sql`${usersTable.version} + 1`,
          },
        })
        .returning(),
    );

  export const read = async (ids: Array<User["id"]>) =>
    useTransaction((tx) =>
      tx
        .select()
        .from(usersTable)
        .where(
          and(
            inArray(usersTable.id, ids),
            eq(usersTable.tenantId, useTenant().id),
          ),
        ),
    );

  export const byRoles = async (
    roles: Array<UserRole> = [
      "administrator",
      "operator",
      "manager",
      "customer",
    ],
  ) =>
    useTransaction((tx) =>
      tx
        .select()
        .from(usersTable)
        .where(
          and(
            inArray(usersTable.role, roles),
            eq(usersTable.tenantId, useTenant().id),
          ),
        ),
    );

  export const byOrigin = async <TUserOrigin extends User["origin"]>(
    origin: TUserOrigin,
  ) =>
    useTransaction(
      (tx) =>
        tx
          .select()
          .from(usersTable)
          .where(
            and(
              eq(usersTable.origin, origin),
              eq(usersTable.tenantId, useTenant().id),
            ),
          ) as unknown as Promise<Array<Prettify<UserByOrigin<TUserOrigin>>>>,
    );

  export const byIdentityProvider = async (
    subjectId: User["subjectId"],
    identityProviderId: User["identityProviderId"],
  ) =>
    useTransaction((tx) =>
      tx
        .select()
        .from(usersTable)
        .where(
          and(
            eq(usersTable.subjectId, subjectId),
            eq(usersTable.identityProviderId, identityProviderId),
            eq(usersTable.tenantId, useTenant().id),
          ),
        ),
    );

  export const byUsernames = async (usernames: Array<User["username"]>) =>
    useTransaction((tx) =>
      tx
        .select()
        .from(usersTable)
        .where(
          and(
            inArray(usersTable.username, usernames),
            eq(usersTable.tenantId, useTenant().id),
          ),
        ),
    );

  export async function withOrderAccess(orderId: Order["id"]) {
    const tenant = useTenant();

    return useTransaction(async (tx) => {
      const [adminsOps, managers, [customer]] = await Promise.all([
        byRoles(["administrator", "operator"]),
        tx
          .select({ id: usersTable.id })
          .from(usersTable)
          .innerJoin(
            billingAccountManagerAuthorizationsTable,
            and(
              eq(
                usersTable.id,
                billingAccountManagerAuthorizationsTable.managerId,
              ),
              eq(
                usersTable.tenantId,
                billingAccountManagerAuthorizationsTable.tenantId,
              ),
            ),
          )
          .innerJoin(
            ordersTable,
            and(
              eq(
                billingAccountManagerAuthorizationsTable.billingAccountId,
                ordersTable.billingAccountId,
              ),
              eq(billingAccountsTable.tenantId, tenant.id),
            ),
          )
          .where(
            and(
              eq(ordersTable.id, orderId),
              eq(ordersTable.tenantId, tenant.id),
            ),
          ),
        tx
          .select({ id: usersTable.id })
          .from(usersTable)
          .innerJoin(
            ordersTable,
            and(
              eq(usersTable.id, ordersTable.customerId),
              eq(usersTable.tenantId, ordersTable.tenantId),
            ),
          )
          .where(
            and(
              eq(ordersTable.id, orderId),
              eq(ordersTable.tenantId, tenant.id),
            ),
          ),
      ]);

      return R.uniqueBy([...adminsOps, ...managers, customer], R.prop("id"));
    });
  }

  export const withCustomerAuthorization = async (
    accountId: BillingAccount["id"],
  ) =>
    useTransaction((tx) =>
      tx
        .select({
          customerId: billingAccountCustomerAuthorizationsTable.customerId,
        })
        .from(billingAccountCustomerAuthorizationsTable)
        .where(
          and(
            eq(
              billingAccountCustomerAuthorizationsTable.billingAccountId,
              accountId,
            ),
            eq(
              billingAccountCustomerAuthorizationsTable.tenantId,
              useTenant().id,
            ),
          ),
        ),
    );

  export const withManagerAuthorization = async (
    accountId: BillingAccount["id"],
  ) =>
    useTransaction(async (tx) =>
      tx
        .select({
          managerId: billingAccountManagerAuthorizationsTable.managerId,
        })
        .from(billingAccountManagerAuthorizationsTable)
        .where(
          and(
            eq(
              billingAccountManagerAuthorizationsTable.billingAccountId,
              accountId,
            ),
            eq(
              billingAccountManagerAuthorizationsTable.tenantId,
              useTenant().id,
            ),
          ),
        ),
    );

  export const updateOne = async (values: PartialExcept<User, "id">) =>
    useTransaction(async (tx) => {
      await tx
        .update(usersTable)
        .set(values)
        .where(
          and(
            eq(usersTable.id, values.id),
            eq(usersTable.tenantId, useTenant().id),
          ),
        );

      await afterTransaction(() => poke("/tenant"));
    });

  export const updateRole = fn(
    updateUserRoleMutationArgsSchema,
    async ({ id, ...values }) => {
      await AccessControl.enforce(getTableName(usersTable), "update");

      return useTransaction(async (tx) => {
        await tx
          .update(usersTable)
          .set(values)
          .where(
            and(eq(usersTable.id, id), eq(usersTable.tenantId, useTenant().id)),
          );

        await afterTransaction(() => poke("/tenant"));
      });
    },
  );

  export const delete_ = fn(
    deleteUserMutationArgsSchema,
    async ({ id, ...values }) => {
      await AccessControl.enforce(getTableName(usersTable), "delete", id);

      return useTransaction(async (tx) => {
        await tx
          .update(usersTable)
          .set({ ...values, role: "customer" })
          .where(
            and(eq(usersTable.id, id), eq(usersTable.tenantId, useTenant().id)),
          );

        await afterTransaction(() => poke("/tenant"));
      });
    },
  );

  export const restore = fn(restoreUserMutationArgsSchema, async ({ id }) => {
    await AccessControl.enforce(getTableName(usersTable), "update");

    return useTransaction(async (tx) => {
      await tx
        .update(usersTable)
        .set({ deletedAt: null })
        .where(
          and(eq(usersTable.id, id), eq(usersTable.tenantId, useTenant().id)),
        );

      await afterTransaction(() => poke("/tenant"));
    });
  });

  export const exists = async (userId: User["id"]) =>
    useTransaction((tx) =>
      tx
        .select()
        .from(usersTable)
        .where(
          and(
            eq(usersTable.id, userId),
            eq(usersTable.tenantId, useTenant().id),
          ),
        )
        .then(R.isNot(R.isEmpty)),
    );
}
