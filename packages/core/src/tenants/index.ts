import { and, eq, getTableName, isNull, or } from "drizzle-orm";
import * as R from "remeda";
import { Resource } from "sst";

import { AccessControl } from "../access-control";
import { Auth } from "../auth";
import { Documents } from "../backend/documents";
import { buildConflictUpdateColumns } from "../drizzle/columns";
import { afterTransaction, useTransaction } from "../drizzle/context";
import { Papercut } from "../papercut";
import { poke } from "../replicache/poke";
import { Tailscale } from "../tailscale";
import { Sqs } from "../utils/aws";
import { Constants } from "../utils/constants";
import { ApplicationError } from "../utils/errors";
import { fn, generateId } from "../utils/shared";
import { useTenant } from "./context";
import { updateTenantMutationArgsSchema } from "./shared";
import { licensesTable, tenantMetadataTable, tenantsTable } from "./sql";

import type { InferInsertModel } from "drizzle-orm";
import type { ConfigureData, InfraProgramInput, RegisterData } from "./shared";
import type { License, Tenant, TenantMetadataTable, TenantsTable } from "./sql";

export namespace Tenants {
  export const put = async (values: InferInsertModel<TenantsTable>) =>
    useTransaction((tx) =>
      tx
        .insert(tenantsTable)
        .values({ ...values, status: "setup" })
        .onConflictDoUpdate({
          target: [tenantsTable.id],
          set: buildConflictUpdateColumns(tenantsTable, [
            "id",
            "name",
            "slug",
            "status",
          ]),
          setWhere: eq(tenantsTable.status, "setup"),
        }),
    );

  export const read = async () =>
    useTransaction((tx) =>
      tx.select().from(tenantsTable).where(eq(tenantsTable.id, useTenant().id)),
    );

  export const update = fn(updateTenantMutationArgsSchema, async (values) => {
    await AccessControl.enforce([getTableName(tenantsTable), "update"], {
      Error: ApplicationError.AccessDenied,
      args: [{ name: getTableName(tenantsTable), id: values.id }],
    });

    return useTransaction(async (tx) => {
      await tx
        .update(tenantsTable)
        .set(values)
        .where(eq(tenantsTable.id, useTenant().id));

      await afterTransaction(() => poke(["/tenant"]));
    });
  });

  export async function isSlugAvailable(slug: Tenant["slug"]) {
    if (["api", "auth", "backend"].includes(slug)) return false;

    const tenant = await useTransaction((tx) =>
      tx
        .select({ status: tenantsTable.status })
        .from(tenantsTable)
        .where(eq(tenantsTable.slug, slug))
        .then(R.first()),
    );
    if (!tenant || tenant.status === "setup") return true;

    return false;
  }

  export const isLicenseKeyAvailable = async (licenseKey: License["key"]) =>
    useTransaction((tx) =>
      tx
        .select({})
        .from(licensesTable)
        .leftJoin(tenantsTable, eq(tenantsTable.id, licensesTable.tenantId))
        .where(
          and(
            eq(licensesTable.key, licenseKey),
            eq(licensesTable.status, "active"),
            or(
              isNull(licensesTable.tenantId),
              eq(tenantsTable.status, "setup"),
            ),
          ),
        )
        .then(R.isNot(R.isEmpty)),
    );

  export const assignLicense = async (
    tenantId: Tenant["id"],
    licenseKey: License["key"],
  ) =>
    useTransaction((tx) =>
      tx
        .update(licensesTable)
        .set({ tenantId })
        .where(
          and(
            eq(licensesTable.key, licenseKey),
            or(
              isNull(licensesTable.tenantId),
              eq(licensesTable.tenantId, tenantId),
            ),
          ),
        ),
    );

  export const putMetadata = async (
    values: InferInsertModel<TenantMetadataTable>,
  ) =>
    useTransaction((tx) =>
      tx
        .insert(tenantMetadataTable)
        .values(values)
        .onConflictDoUpdate({
          target: [tenantMetadataTable.tenantId],
          set: buildConflictUpdateColumns(tenantMetadataTable, [
            "infraProgramInput",
            "apiKey",
          ]),
        }),
    );

  export async function initialize(
    licenseKey: License["key"],
    infraProgramInput: InfraProgramInput,
  ) {
    const tenantId = generateId();
    const apiKey = await Auth.generateToken();

    await useTransaction(() =>
      Promise.all([
        assignLicense(tenantId, licenseKey),
        putMetadata({ tenantId, apiKey: apiKey.hash, infraProgramInput }),
      ]),
    );

    return { tenantId, apiKey: apiKey.value };
  }

  export const register = async (data: RegisterData) =>
    useTransaction(() =>
      Promise.all([
        put({
          id: useTenant().id,
          name: data.tenantName,
          slug: data.tenantSlug,
        }),
        Auth.putOauth2Provider({
          id: data.userOauthProviderId,
          type: data.userOauthProviderType,
          tenantId: useTenant().id,
        }),
      ]),
    );

  export async function dispatchInfra() {
    const programInput = await useTransaction((tx) =>
      tx
        .select({ programInput: tenantMetadataTable.infraProgramInput })
        .from(tenantMetadataTable)
        .where(eq(tenantMetadataTable.tenantId, useTenant().id))
        .then((rows) => R.pipe(rows, R.map(R.prop("programInput")), R.first())),
    );
    if (!programInput) throw new Error("Tenant metadata not found");

    const output = await Sqs.sendMessage({
      QueueUrl: Resource.InfraQueue.url,
      MessageBody: JSON.stringify({
        tenantId: useTenant().id,
        ...programInput,
      }),
    });
    if (!output.MessageId) throw new Error("Failed to dispatch infra");

    return output.MessageId;
  }

  export const config = async (data: ConfigureData) =>
    Promise.all([
      Tailscale.setOauthClient(
        data.tailscaleOauthClientId,
        data.tailscaleOauthClientSecret,
      ),
      Papercut.setTailnetServerUri(data.tailnetPapercutServerUri),
      Papercut.setServerAuthToken(data.papercutServerAuthToken),
      Documents.setMimeTypes(Constants.DEFAULT_DOCUMENTS_MIME_TYPES),
      Documents.setSizeLimit(Constants.DEFAULT_DOCUMENTS_SIZE_LIMIT),
    ]);

  export const activate = async () =>
    useTransaction((tx) =>
      Promise.all([
        tx
          .update(tenantsTable)
          .set({ status: "active" })
          .where(eq(tenantsTable.id, useTenant().id)),
        tx
          .update(tenantMetadataTable)
          .set({ apiKey: null })
          .where(eq(tenantMetadataTable.tenantId, useTenant().id)),
      ]),
    );
}
