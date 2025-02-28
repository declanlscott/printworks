import { index, timestamp } from "drizzle-orm/pg-core";
import * as v from "valibot";

import { customJsonb, id } from "../drizzle/columns";
import { tenantTable } from "../drizzle/tables";
import { invoiceStatus } from "../utils/sql";
import { invoicesTableName, lineItemSchema } from "./shared";

import type { InferTable } from "../utils/types";

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

export type Invoice = InferTable<InvoicesTable>;
