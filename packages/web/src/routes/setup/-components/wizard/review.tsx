import { useState } from "react";
import { Constants } from "@printdesk/core/utils/constants";
import { ArrowLeft, Eye, EyeOff, Send } from "lucide-react";

import { useSetupMachine } from "~/lib/hooks/setup";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent } from "~/ui/primitives/card";
import {
  Disclosure,
  DisclosureGroup,
  DisclosureHeader,
  DisclosurePanel,
} from "~/ui/primitives/disclosure";
import { TextField } from "~/ui/primitives/text-field";

export function SetupWizardReview() {
  const setupMachine = useSetupMachine();

  const actorRef = setupMachine.useActorRef();

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Review</h2>

      <Card>
        <CardContent className="grid gap-4 py-2">
          <DisclosureGroup>
            <Step1 />

            <Step2 />

            <Step3 />

            <Step4 />
          </DisclosureGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          onPress={() => actorRef.send({ type: "wizard.back" })}
          className="gap-2"
          variant="secondary"
        >
          <ArrowLeft className="size-5" />
          Back
        </Button>

        <Button
          className="gap-2"
          onPress={() => actorRef.send({ type: "wizard.register" })}
        >
          <Send className="size-5" />
          Register
        </Button>
      </div>
    </div>
  );
}

function Step1() {
  const { licenseKey, tenantName, tenantSubdomain } =
    useSetupMachine().useSelector(({ context }) => ({
      licenseKey: context.licenseKey,
      tenantName: context.tenantName,
      tenantSubdomain: context.tenantSubdomain,
    }));

  return (
    <Disclosure id={1}>
      <DisclosureHeader>1. Basic Information</DisclosureHeader>

      <DisclosurePanel className="grid gap-4">
        <div className="grid gap-2">
          <TextField
            labelProps={{ children: "License Key" }}
            inputProps={{ disabled: true, value: licenseKey }}
            className="grid gap-2"
          />
        </div>

        <div className="grid gap-2">
          <TextField
            labelProps={{ children: "Name" }}
            inputProps={{ disabled: true, value: tenantName }}
            className="grid gap-2"
          />
        </div>

        <div className="grid gap-2">
          <TextField
            labelProps={{ children: "Subdomain" }}
            inputProps={{ disabled: true, value: tenantSubdomain }}
            className="grid gap-2"
          />
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

function Step2() {
  const { identityProviderKind, identityProviderId } =
    useSetupMachine().useSelector(({ context }) => ({
      identityProviderKind: context.identityProviderKind,
      identityProviderId: context.identityProviderId,
    }));

  const identityProviderNames = {
    [Constants.ENTRA_ID]: "Microsoft Entra ID",
    [Constants.GOOGLE]: "Google",
  };

  return (
    <Disclosure id={2}>
      <DisclosureHeader>2. Identity Provider</DisclosureHeader>

      <DisclosurePanel>
        <DisclosurePanel className="grid gap-4">
          <div className="grid gap-2">
            <TextField
              labelProps={{ children: "Type" }}
              inputProps={{
                disabled: true,
                value: identityProviderNames[identityProviderKind],
              }}
              className="grid gap-2"
            />
          </div>

          <div className="grid gap-2">
            <TextField
              labelProps={{ children: "Tenant ID" }}
              inputProps={{ disabled: true, value: identityProviderId }}
              className="grid gap-2"
            />
          </div>
        </DisclosurePanel>
      </DisclosurePanel>
    </Disclosure>
  );
}

function Step3() {
  const { tailscaleOauthClientId, tailscaleOauthClientSecret } =
    useSetupMachine().useSelector(({ context }) => ({
      tailscaleOauthClientId: context.tailscaleOauthClientId,
      tailscaleOauthClientSecret: context.tailscaleOauthClientSecret,
    }));

  const [isSecretVisible, setIsSecretVisible] = useState(() => false);

  return (
    <Disclosure id={3}>
      <DisclosureHeader>3. Tailscale</DisclosureHeader>

      <DisclosurePanel className="grid gap-4">
        <div className="grid gap-2">
          <TextField
            labelProps={{ children: "Client ID" }}
            inputProps={{ disabled: true, value: tailscaleOauthClientId }}
            className="grid gap-2"
          />
        </div>

        <div className="grid gap-2">
          <TextField
            labelProps={{ children: "Client Secret" }}
            inputProps={{
              type: isSecretVisible ? "text" : "password",
              disabled: true,
              value: tailscaleOauthClientSecret,
            }}
            groupProps={{
              className: "flex gap-2",
              children: (
                <Button
                  variant="ghost"
                  size="icon"
                  onPress={() =>
                    setIsSecretVisible((isSecretVisible) => !isSecretVisible)
                  }
                >
                  {isSecretVisible ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </Button>
              ),
            }}
            className="grid gap-2"
          />
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

function Step4() {
  const { tailnetPapercutServerUri, papercutServerAuthToken } =
    useSetupMachine().useSelector(({ context }) => ({
      tailnetPapercutServerUri: context.tailnetPapercutServerUri,
      papercutServerAuthToken: context.papercutServerAuthToken,
    }));

  const [isTokenVisible, setIsTokenVisible] = useState(() => false);

  return (
    <Disclosure id={4}>
      <DisclosureHeader>4. PaperCut</DisclosureHeader>

      <DisclosurePanel className="grid gap-4">
        <div className="grid gap-2">
          <TextField
            labelProps={{ children: "PaperCut Server URL" }}
            inputProps={{ disabled: true, value: tailnetPapercutServerUri }}
            className="grid gap-2"
          />
        </div>

        <div className="grid gap-2">
          <TextField
            labelProps={{ children: "PaperCut Server Auth Token" }}
            inputProps={{
              type: isTokenVisible ? "text" : "password",
              disabled: true,
              value: papercutServerAuthToken,
            }}
            groupProps={{
              className: "flex gap-2",
              children: (
                <Button
                  variant="ghost"
                  size="icon"
                  onPress={() =>
                    setIsTokenVisible((isTokenVisible) => !isTokenVisible)
                  }
                >
                  {isTokenVisible ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </Button>
              ),
            }}
            className="grid gap-2"
          />
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
