import { HttpRequest } from "@smithy/protocol-http";
import * as R from "remeda";
import { Resource } from "sst";
import * as v from "valibot";

import { SignatureV4, Util } from "../aws";
import { Backend } from "../backend";
import { Api } from "../backend/api";
import { ServerErrors } from "../errors";

import type { StartsWith } from "../utils/types";
import type { Event } from "./shared";

export namespace Realtime {
  export async function getDns() {
    const res = await Api.send(
      `/.well-known/appspecific/${Backend.getReverseDns()}.realtime.json`,
    );
    if (!res.ok)
      throw new ServerErrors.InternalServerError("Failed to get realtime DNS", {
        cause: await res.text(),
      });

    return v.parse(
      v.object({
        http: v.string(),
        realtime: v.string(),
      }),
      await res.json(),
    );
  }

  export const getUrl = (
    realtimeDomainName = Resource.AppsyncEventApi.dns.realtime,
  ) =>
    Util.formatUrl(
      new HttpRequest({
        protocol: "wss:",
        hostname: realtimeDomainName,
        path: "/event/realtime",
      }),
    );

  export async function getAuth(
    expiresIn?: number,
    body = "{}",
    httpDomainName = Resource.AppsyncEventApi.dns.http,
  ) {
    const args = [
      "appsync",
      new HttpRequest({
        method: "POST",
        protocol: "https:",
        hostname: httpDomainName,
        path: "/event",
        headers: {
          accept: "application/json, text/javascript",
          "content-encoding": "amz-1.0",
          "content-type": "application/json; charset=UTF-8",
          host: httpDomainName,
        },
        body,
      }),
    ] as const;

    return (
      expiresIn
        ? SignatureV4.presign(...args, { expiresIn })
        : SignatureV4.sign(...args)
    ).then(R.prop("headers"));
  }

  export async function publish<TChannel extends string>(
    httpDomainName: string,
    channel: StartsWith<"/", TChannel>,
    events: Array<Event>,
  ) {
    const req = await SignatureV4.sign(
      "appsync",
      new HttpRequest({
        method: "POST",
        protocol: "https:",
        hostname: httpDomainName,
        path: "/event",
        headers: { "Content-Type": "application/json", host: httpDomainName },
        body: JSON.stringify({
          channel,
          events: JSON.stringify(events),
        }),
      }),
    );

    await fetch(Util.formatUrl(req), {
      method: req.method,
      headers: req.headers,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body: req.body,
    });
  }
}
