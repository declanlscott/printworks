import { index, timestamp } from "drizzle-orm/pg-core";
import * as v from "valibot";

import { customEnum, customJsonb, id } from "../database/columns";
import { tenantTable } from "../database/tables";
import { invoicesTableName, invoiceStatuses, lineItemSchema } from "./shared";

import type { InferFromTable } from "../database/tables";

export const invoiceStatus = (name: string) =>
  customEnum(name, invoiceStatuses);

export const invoicesTable = tenantTable(
  invoicesTableName,
  {
    lineItems: customJsonb("line_items", v.array(lineItemSchema)).notNull(),
    status: invoiceStatus("status").default("processing").notNull(),
    chargedAt: timestamp("charged_at", { mode: "string" }),
    orderId: id("order_id").notNull(),
  },
  (table) => [index().on(table.orderId)],
);

export type InvoicesTable = typeof invoicesTable;

export type Invoice = InferFromTable<InvoicesTable>;
