import type { SyncedTableName } from "../data";

export type Resource =
  | SyncedTableName
  | "documents-mime-types"
  | "documents-size-limit"
  | "papercut-sync"
  | "services"
  | "monthly-active-users"
  | "oauth-providers";

export type Action = "create" | "read" | "update" | "delete";
