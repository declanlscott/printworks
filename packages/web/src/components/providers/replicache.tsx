import { useEffect, useState } from "react";
import loadingIndicator from "/loading-indicator.svg";
import { Replicache } from "replicache";
import { serialize } from "superjson";

import { ReplicacheContext } from "~/lib/contexts/replicache";
import { useActor } from "~/lib/hooks/actor";
import { useApi } from "~/lib/hooks/api";
import { useMutators } from "~/lib/hooks/replicache";
import { useResource } from "~/lib/hooks/resource";
import { initialLoginSearchParams } from "~/lib/schemas";

import type { PropsWithChildren } from "react";
import type { AppRouter } from "~/types";

type ReplicacheProviderProps = PropsWithChildren<{
  router: AppRouter;
}>;

export function ReplicacheProvider(props: ReplicacheProviderProps) {
  const actor = useActor();

  const [replicache, setReplicache] = useState<ReplicacheContext | null>(() =>
    actor.type === "user" ? { status: "initializing" } : null,
  );

  const { AppData, ReplicacheLicenseKey } = useResource();

  const mutators = useMutators();

  const api = useApi();

  const { invalidate, navigate } = props.router;

  useEffect(() => {
    if (actor.type !== "user") return setReplicache(() => null);

    const client = new Replicache({
      name: actor.properties.id,
      licenseKey: ReplicacheLicenseKey.value,
      logLevel: AppData.isDev ? "info" : "error",
      mutators,
      auth: "Bearer TODO",
      pullURL: "/api/replicache/pull",
      pusher: async (req) => {
        const res = await api.replicache.push.$post({
          header: {
            authorization: `Bearer TODO`,
          },
          json: {
            ...req,
            mutations: req.mutations.map((mutation) => ({
              ...mutation,
              args: serialize(mutation.args),
            })),
          },
        });
        if (!res.ok)
          return {
            httpRequestInfo: {
              httpStatusCode: res.status,
              errorMessage: await res.text(),
            },
          };

        const json = await res.json();

        return {
          response: json ?? undefined,
          httpRequestInfo: {
            httpStatusCode: res.status,
            errorMessage: json?.error ?? "",
          },
        };
      },
    });

    // client.getAuth = getAuth; // TODO

    setReplicache(() => ({ status: "ready", client }));

    return () => {
      setReplicache(() => ({ status: "initializing" }));

      void client.close();
    };
  }, [actor, mutators, ReplicacheLicenseKey.value, AppData.isDev, api]);

  if (replicache?.status === "initializing")
    return <img src={loadingIndicator} alt="Loading indicator" />;

  return (
    <ReplicacheContext.Provider value={replicache}>
      {props.children}
    </ReplicacheContext.Provider>
  );
}
