import { ApplicationError } from "@printworks/core/utils/errors";

import { useSetupContext, useSetupStatusState } from "~/lib/hooks/setup";
import {
  FailureItem,
  PendingItem,
  SuccessItem,
} from "~/routes/setup/-components/status/items";

const name = "Registering";

export function RegisteringStatusItem() {
  const state = useSetupStatusState();
  const context = useSetupContext();

  switch (state) {
    case "initialize":
      return <PendingItem name={name} />;
    case "register":
      return <PendingItem name={name} isActive />;
    case "dispatchInfra":
    case "waitForInfra":
    case "healthcheck":
    case "determineHealth":
    case "waitForGoodHealth":
    case "configure":
    case "dispatchSync":
    case "waitForSync":
    case "activate":
    case "complete":
      return <SuccessItem name={name} />;
    case "failure":
      switch (context.failureStatus) {
        case null:
        case "initialize":
          return <PendingItem name={name} />;
        case "register":
          return <FailureItem name={name} isActive />;
        case "dispatchInfra":
        case "waitForInfra":
        case "healthcheck":
        case "determineHealth":
        case "waitForGoodHealth":
        case "configure":
        case "dispatchSync":
        case "waitForSync":
        case "activate":
          return <SuccessItem name={name} />;
        default:
          throw new ApplicationError.NonExhaustiveValue(context.failureStatus);
      }
    default:
      throw new ApplicationError.NonExhaustiveValue(state);
  }
}
