import { ApplicationError } from "@printworks/core/utils/errors";

import { useAuthenticatedRouteApi, useUserSubject } from "~/lib/hooks/auth";
import { query } from "~/lib/hooks/data";
import { useSubscribe } from "~/lib/hooks/replicache";

import type { BillingAccount } from "@printworks/core/billing-accounts/sql";
import type { User } from "@printworks/core/users/sql";

export function useUser() {
  const { initialUser } = useAuthenticatedRouteApi().useLoaderData();

  return useSubscribe(query.user(useUserSubject().id), {
    defaultData: initialUser,
  });
}

export function useManager() {
  const user = useUser();

  if (user.profile.role !== "manager")
    throw new ApplicationError.AccessDenied();

  const billingAccountIds = useSubscribe(
    query.managedBillingAccountIds(user.id),
    { defaultData: [] as Array<BillingAccount["id"]> },
  );

  const customerIds = useSubscribe(query.managedCustomerIds(user.id), {
    defaultData: [] as Array<User["id"]>,
  });

  return { billingAccountIds, customerIds };
}
