import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";

import { AuthStoreProvider } from "~/app/components/providers/auth";
import { ReplicacheProvider } from "~/app/components/providers/replicache";
import { ResourceProvider } from "~/app/components/providers/resource";
import { SlotProvider } from "~/app/components/providers/slot";
import { useAuthStore } from "~/app/lib/hooks/auth";
import { useReplicache } from "~/app/lib/hooks/replicache";
import { useResource } from "~/app/lib/hooks/resource";
import { routeTree } from "~/app/routeTree.gen";

import type { ClientResourceType } from "@paperwait/core/types";
import type { AppRouter, Auth, Slot } from "~/app/types";

const queryClient = new QueryClient();

export interface AppProps extends Partial<Slot> {
  clientResource: ClientResourceType;
  initialAuth: Auth;
}

export function App(props: AppProps) {
  const { clientResource, initialAuth, loadingIndicator, logo } = props;

  const [router] = useState(() =>
    createRouter({
      routeTree,
      context: {
        // These will be set after we wrap the app router in providers
        resource: undefined!,
        authStore: undefined!,
        replicache: undefined!,
        queryClient,
      },
      defaultPendingComponent: () => loadingIndicator,
    }),
  );

  // Hide the initial loading indicator
  // Router will handle the loading indicator afterwards with `defaultPendingComponent`
  document
    .getElementById("initial-app-loading-indicator")
    ?.style.setProperty("display", "none");

  return (
    <ResourceProvider resource={clientResource}>
      <AuthStoreProvider initialAuth={initialAuth}>
        <SlotProvider slot={{ loadingIndicator, logo }}>
          <ReplicacheProvider router={router}>
            <QueryClientProvider client={queryClient}>
              <AppRouter router={router} />

              <Toaster richColors />
            </QueryClientProvider>
          </ReplicacheProvider>
        </SlotProvider>
      </AuthStoreProvider>
    </ResourceProvider>
  );
}

type AppRouterProps = {
  router: AppRouter;
};

function AppRouter(props: AppRouterProps) {
  const resource = useResource();
  const authStore = useAuthStore((store) => store);
  const replicache = useReplicache();

  return (
    <RouterProvider
      router={props.router}
      context={{ resource, authStore, replicache, queryClient }}
    />
  );
}
