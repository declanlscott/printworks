import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { useResource } from "../resource";
import * as appsync from "./dynamic/aws/appsync";

import type { AssumeRoleCommandInput } from "@aws-sdk/client-sts";

export interface RealtimeArgs {
  roleChain: pulumi.Input<Array<AssumeRoleCommandInput>>;
}

export class Realtime extends pulumi.ComponentResource {
  private static _instance: Realtime;

  private _api: appsync.Api;
  private _eventsChannelNamespace: appsync.ChannelNamespace;
  private _replicacheChannelNamespace: appsync.ChannelNamespace;
  private _subscriberRole: aws.iam.Role;
  private _publisherRole: aws.iam.Role;

  static getInstance(
    args: RealtimeArgs,
    opts: pulumi.ComponentResourceOptions = {},
  ): Realtime {
    if (!this._instance) this._instance = new Realtime(args, opts);

    return this._instance;
  }

  private constructor(
    ...[args, opts]: Parameters<typeof Realtime.getInstance>
  ) {
    const { ApiFunction, AppData, Aws } = useResource();

    super(`${AppData.name}:tenant:aws:Realtime`, "Realtime", args, opts);

    this._api = new appsync.Api(
      "Api",
      {
        roleChain: args.roleChain,
        eventConfig: {
          authProviders: [{ authType: "AWS_IAM" }],
          connectionAuthModes: [{ authType: "AWS_IAM" }],
          defaultPublishAuthModes: [{ authType: "AWS_IAM" }],
          defaultSubscribeAuthModes: [{ authType: "AWS_IAM" }],
        },
      },
      { parent: this },
    );

    this._eventsChannelNamespace = new appsync.ChannelNamespace(
      "EventsChannelNamespace",
      {
        roleChain: args.roleChain,
        apiId: this._api.id,
        name: "events",
      },
      { parent: this },
    );

    this._replicacheChannelNamespace = new appsync.ChannelNamespace(
      "ReplicacheChannelNamespace",
      {
        roleChain: args.roleChain,
        apiId: this._api.id,
        name: "replicache",
      },
      { parent: this },
    );

    const assumeRolePolicy = aws.iam.getPolicyDocumentOutput(
      {
        statements: [
          {
            principals: [
              {
                type: "AWS",
                identifiers: [ApiFunction.roleArn],
              },
            ],
            actions: ["sts:AssumeRole"],
          },
        ],
      },
      { parent: this },
    ).json;

    this._subscriberRole = new aws.iam.Role(
      "SubscriberRole",
      { name: Aws.tenant.roles.realtimeSubscriber.name, assumeRolePolicy },
      { parent: this },
    );
    new aws.iam.RolePolicy(
      "SubscriberRoleInlinePolicy",
      {
        role: this._subscriberRole.name,
        policy: aws.iam.getPolicyDocumentOutput(
          {
            statements: [
              {
                actions: ["appsync:EventConnect"],
                resources: [this._api.apiArn],
              },
              {
                actions: ["appsync:EventSubscribe"],
                resources: [pulumi.interpolate`${this._api.apiArn}/*`],
              },
            ],
          },
          { parent: this },
        ).json,
      },
      { parent: this },
    );

    this._publisherRole = new aws.iam.Role(
      "PublisherRole",
      { name: Aws.tenant.roles.realtimeSubscriber.name, assumeRolePolicy },
      { parent: this },
    );
    new aws.iam.RolePolicy(
      "PublisherRoleInlinePolicy",
      {
        role: this._publisherRole.name,
        policy: aws.iam.getPolicyDocumentOutput(
          {
            statements: [
              {
                actions: ["appsync:EventPublish"],
                resources: [pulumi.interpolate`${this._api.apiArn}/*`],
              },
            ],
          },
          { parent: this },
        ).json,
      },
      { parent: this },
    );

    this.registerOutputs({
      api: this._api.id,
      eventsChannelNamespace: this._eventsChannelNamespace.id,
      replicacheChannelNamespace: this._replicacheChannelNamespace.id,
      subscriberRole: this._subscriberRole.id,
      publisherRole: this._publisherRole.id,
    });
  }

  get dns() {
    return {
      http: this._api.dns.HTTP,
      realtime: this._api.dns.REALTIME,
    };
  }
}
