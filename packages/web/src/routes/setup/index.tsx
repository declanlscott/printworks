import { ApplicationError } from "@printworks/core/utils/errors";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createActorContext } from "@xstate/react";
import * as v from "valibot";

import { useSetupState } from "~/lib/hooks/setup";
import { getSetupMachine } from "~/lib/machines/setup";
import { SetupStatus } from "~/routes/setup/-components/status";
import { SetupWizard } from "~/routes/setup/-components/wizard";

export const Route = createFileRoute("/setup/")({
  validateSearch: v.object({ slug: v.optional(v.string()) }),
  loaderDeps: ({ search }) => ({ search }),
  beforeLoad: async ({ context }) => {
    try {
      await context.authStoreApi.getState().actions.verify();
    } catch {
      // Continue loading the register route if the user is unauthenticated
      return;
    }

    // Otherwise, redirect to the dashboard
    throw redirect({ to: "/" });
  },
  loader: async ({ context, deps }) => {
    const slug =
      context.resource.AppData.isDev || window.location.hostname === "localhost"
        ? deps.search.slug
        : window.location.hostname
            .split(`.${context.resource.AppData.domainName.fullyQualified}`)
            .at(0);
    if (!slug) throw new ApplicationError.Error("Missing slug");

    const res = await context.api.client.public.tenants["slug-availability"][
      ":value"
    ].$get({ param: { value: slug } });
    if (!res.ok) {
      switch (res.status as number) {
        case 429:
          throw new ApplicationError.Error(
            "Too many requests, try again later.",
          );
        default:
          throw new ApplicationError.Error("An unexpected error occurred.");
      }
    }

    const { isAvailable } = await res.json();
    if (!isAvailable)
      throw new ApplicationError.Error(`"${slug}" is unavailable to register.`);

    const SetupMachineContext = createActorContext(
      getSetupMachine(context.api.client, context.resource),
      { input: { tenantSlug: slug } },
    );

    return { SetupMachineContext };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { SetupMachineContext } = Route.useLoaderData();

  return (
    <SetupMachineContext.Provider>
      <Setup />
    </SetupMachineContext.Provider>
  );
}

function Setup() {
  const state = useSetupState();

  if ("wizard" in state) return <SetupWizard />;

  if ("status" in state) return <SetupStatus />;

  throw new ApplicationError.NonExhaustiveValue(state);
}
