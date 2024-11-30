import { Resource } from "sst";

import { Api } from "../api";
import { Ssm, Sts } from "../utils/aws";
import { Constants } from "../utils/constants";
import { HttpError } from "../utils/errors";

export namespace Papercut {
  export async function setTailscaleOauthClient(id: string, secret: string) {
    const accountId = await Api.getAccountId();

    const sts = new Sts.Client();

    const { Credentials } = await Sts.assumeRole(sts, {
      RoleArn: `arn:aws:iam::${accountId}:role/${Resource.Aws.tenant.putParametersRole.name}`,
      RoleSessionName: "SetTailscaleOauthClient",
      DurationSeconds: 60,
    });
    if (
      !Credentials?.AccessKeyId ||
      !Credentials.SecretAccessKey ||
      !Credentials.SessionToken
    )
      throw new Error("Missing ssm credentials");

    const ssm = new Ssm.Client({
      credentials: {
        accessKeyId: Credentials.AccessKeyId,
        secretAccessKey: Credentials.SecretAccessKey,
        sessionToken: Credentials.SessionToken,
      },
    });

    await Ssm.putParameter(ssm, {
      Name: Constants.TAILSCALE_OAUTH_CLIENT_PARAMETER_NAME,
      Value: JSON.stringify({ id, secret }),
      Type: "SecureString",
    });
  }

  export async function setServerUrl(url: string) {
    const accountId = await Api.getAccountId();

    const sts = new Sts.Client();

    const { Credentials } = await Sts.assumeRole(sts, {
      RoleArn: `arn:aws:iam::${accountId}:role/${Resource.Aws.tenant.putParametersRole.name}`,
      RoleSessionName: "SetPapercutServerUrl",
      DurationSeconds: 60,
    });
    if (
      !Credentials?.AccessKeyId ||
      !Credentials.SecretAccessKey ||
      !Credentials.SessionToken
    )
      throw new Error("Missing ssm credentials");

    const ssm = new Ssm.Client({
      credentials: {
        accessKeyId: Credentials.AccessKeyId,
        secretAccessKey: Credentials.SecretAccessKey,
        sessionToken: Credentials.SessionToken,
      },
    });

    await Ssm.putParameter(ssm, {
      Name: Constants.PAPERCUT_SERVER_URL_PARAMETER_NAME,
      Value: url,
      Type: "String",
    });
  }

  export async function setAuthToken(token: string) {
    const accountId = await Api.getAccountId();

    const sts = new Sts.Client();

    const { Credentials } = await Sts.assumeRole(sts, {
      RoleArn: `arn:aws:iam::${accountId}:role/${Resource.Aws.tenant.putParametersRole.name}`,
      RoleSessionName: "SetPapercutAuthToken",
      DurationSeconds: 60,
    });
    if (
      !Credentials?.AccessKeyId ||
      !Credentials.SecretAccessKey ||
      !Credentials.SessionToken
    )
      throw new Error("Missing ssm credentials");

    const ssm = new Ssm.Client({
      credentials: {
        accessKeyId: Credentials.AccessKeyId,
        secretAccessKey: Credentials.SecretAccessKey,
        sessionToken: Credentials.SessionToken,
      },
    });

    await Ssm.putParameter(ssm, {
      Name: Constants.PAPERCUT_SERVER_AUTH_TOKEN_PARAMETER_NAME,
      Value: token,
      Type: "SecureString",
    });
  }

  export async function getAuthToken() {
    const res = await Api.send(
      `/parameters${Constants.PAPERCUT_SERVER_AUTH_TOKEN_PARAMETER_NAME}?withDecryption=true`,
    );
    if (!res.ok) throw new HttpError.Error(res.statusText, res.status);

    return res.text();
  }
}
