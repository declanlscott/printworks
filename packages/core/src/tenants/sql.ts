import { pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import { customJsonb, id, idPrimaryKey, timestamps } from "../drizzle/columns";
import { Constants } from "../utils/constants";
import { licenseStatus, tenantStatus } from "../utils/sql";
import {
  infraProgramInputSchema,
  licensesTableName,
  tenantMetadataTableName,
  tenantsTableName,
} from "./shared";

import type { InferSelectModel } from "drizzle-orm";

export const licensesTable = pgTable(licensesTableName, {
  key: uuid("key").defaultRandom().primaryKey(),
  tenantId: id("tenant_id").unique(),
  status: licenseStatus("status").notNull().default("active"),
});
export type LicensesTable = typeof licensesTable;
export type License = InferSelectModel<LicensesTable>;

export const tenantsTable = pgTable(
  tenantsTableName,
  {
    ...idPrimaryKey,
    slug: varchar("slug", { length: Constants.VARCHAR_LENGTH }).notNull(),
    name: varchar("name", { length: Constants.VARCHAR_LENGTH }).notNull(),
    status: tenantStatus("status").notNull().default("setup"),
    ...timestamps,
  },
  (table) => [uniqueIndex().on(table.slug)],
);
export type TenantsTable = typeof tenantsTable;
export type Tenant = InferSelectModel<TenantsTable>;

export const tenantMetadataTable = pgTable(tenantMetadataTableName, {
  tenantId: id("tenant_id").primaryKey(),
  infraProgramInput: customJsonb(
    "infra_program_input",
    infraProgramInputSchema,
  ).notNull(),
  apiKey: varchar("api_key"),
  ...timestamps,
});
export type TenantMetadataTable = typeof tenantMetadataTable;
export type TenantMetadata = InferSelectModel<TenantMetadataTable>;
