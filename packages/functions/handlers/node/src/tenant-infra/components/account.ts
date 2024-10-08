import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { resource } from "../resource";

import type { Tenant } from "@paperwait/core/tenants/sql";

export interface AccountArgs {
  tenantId: Tenant["id"];
}

export class Account extends pulumi.ComponentResource {
  private static instance: Account;

  private account: aws.organizations.Account;
  private _provider: aws.Provider;

  public static getInstance(
    args: AccountArgs,
    opts: pulumi.ComponentResourceOptions = {},
  ): Account {
    if (!this.instance) this.instance = new Account(args, opts);

    return this.instance;
  }

  private constructor(...[args, opts]: Parameters<typeof Account.getInstance>) {
    super(`${resource.AppData.name}:tenant:aws:Account`, "Account", args, opts);

    const accountName = `${resource.AppData.name}-${resource.AppData.stage}-tenant-${args.tenantId}`;

    const emailSegments = resource.Cloud.aws.orgRootEmail.split("@");

    this.account = new aws.organizations.Account(
      "Account",
      {
        name: accountName,
        email: `${emailSegments[0]}+${accountName}@${emailSegments[1]}`,
        parentId: resource.Cloud.aws.tenantsOrganizationalUnitId,
        roleName: resource.Cloud.aws.tenantAccountRoleName,
        iamUserAccessToBilling: "ALLOW",
      },
      { parent: this },
    );

    this._provider = new aws.Provider(
      "Provider",
      {
        region: resource.Cloud.aws.region as aws.Region,
        assumeRole: {
          roleArn: pulumi.interpolate`arn:aws:iam::${this.account.id}:role/${this.account.roleName}`,
        },
      },
      { parent: this },
    );

    this.registerOutputs({
      account: this.account.id,
      provider: this._provider.id,
    });
  }

  public get id() {
    return this.account.id;
  }

  public get provider() {
    return this._provider;
  }
}
