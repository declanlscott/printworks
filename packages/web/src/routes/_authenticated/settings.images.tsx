import { useState } from "react";
import { Constants } from "@printworks/core/utils/constants";
import { createFileRoute } from "@tanstack/react-router";

import { Dropzone } from "~/ui/primitives/dropzone";

const routeId = "/_authenticated/settings/images";

export const Route = createFileRoute(routeId)({
  beforeLoad: ({ context }) =>
    context.replicache.query((tx) =>
      context.authStore.actions.authorizeRoute(tx, routeId),
    ),
  component: RouteComponent,
});

function RouteComponent() {
  const [files, setFiles] = useState<Array<string>>([]);

  return (
    <Dropzone
      onDrop={async (e) => {
        const items = await Promise.all(
          e.items
            .filter((item) => item.kind === "file")
            .filter((item) => {
              const isImage = Constants.ASSETS_MIME_TYPES.includes(item.type);
              if (!isImage) {
                //
              }

              return isImage;
            })
            .map(async (item) => {
              const file = await item.getFile();

              setFiles((files) => [...files, URL.createObjectURL(file)]);
            }),
        );
      }}
    ></Dropzone>
  );
}