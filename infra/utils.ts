import { join } from "node:path";

import type { Resource } from "sst";

export const normalizePath = (path: string, root = $cli.paths.root) =>
  join(root, path);

export function injectLinkables(
  linkables: {
    [TLogicalName in keyof Resource]?: {
      getSSTLink: () => sst.Definition<
        Record<keyof Omit<Resource[TLogicalName], "type">, any>
      >;
    };
  },
  prefix: string = "",
) {
  const vars: Record<string, $util.Output<string>> = {};
  for (const logicalName in linkables) {
    const value =
      linkables[logicalName as keyof Resource]?.getSSTLink().properties;

    if (value) vars[`${prefix}${logicalName}`] = $jsonStringify($output(value));
  }

  return vars;
}
