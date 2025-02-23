import { HttpRequest } from "@smithy/protocol-http";
import { addMinutes } from "date-fns";
import { Resource } from "sst";
import * as v from "valibot";

import { Backend } from ".";
import { Cloudfront, SignatureV4 } from "../utils/aws";
import { HttpError } from "../utils/errors";
import { buildUrl } from "../utils/shared";

import type { PutEventsResponse } from "@aws-sdk/client-eventbridge";
import type { GetParameterResult } from "@aws-sdk/client-ssm";
import type { StartsWith } from "../utils/types";

export namespace Api {
  export async function getRealtimeDns() {
    const res = await send(
      `/.well-known/appspecific/${Backend.getReverseDns()}.realtime.json`,
    );
    if (!res.ok)
      throw new HttpError.BadGateway({
        upstream: {
          error: new HttpError.Error(res.statusText, res.status),
          text: await res.text(),
        },
      });

    return v.parse(
      v.object({
        http: v.string(),
        realtime: v.string(),
      }),
      await res.json(),
    );
  }

  export async function getBuckets() {
    const res = await send(
      `/.well-known/appspecific/${Backend.getReverseDns()}.buckets.json`,
    );
    if (!res.ok)
      throw new HttpError.BadGateway({
        upstream: {
          error: new HttpError.Error(res.statusText, res.status),
          text: await res.text(),
        },
      });

    return v.parse(
      v.object({
        assets: v.string(),
        documents: v.string(),
      }),
      await res.json(),
    );
  }

  export async function dispatchPapercutSync() {
    const res = await send("/papercut/sync", { method: "POST" });
    if (!res.ok)
      throw new HttpError.BadGateway({
        upstream: {
          error: new HttpError.Error(res.statusText, res.status),
          text: await res.text(),
        },
      });

    const output = (await res.json()) as Required<PutEventsResponse>;

    if (output.FailedEntryCount > 0)
      throw new HttpError.InternalServerError("Papercut sync event failure");

    const dispatchId = output.Entries.at(0)?.EventId;
    if (!dispatchId)
      throw new HttpError.InternalServerError("Missing papercut sync event id");

    return dispatchId;
  }

  export async function getParameter<TName extends string>(
    name: StartsWith<"/", TName>,
  ) {
    const res = await send(`/parameters${name}`);

    if (!res.ok)
      throw new HttpError.BadGateway({
        upstream: {
          error: new HttpError.Error(res.statusText, res.status),
          text: await res.text(),
        },
      });

    const result = (await res.json()) as Required<GetParameterResult>;

    return result.Parameter.Value!;
  }

  export async function invalidateCache(paths: Array<string>) {
    const res = await send("/cdn/invalidation", {
      method: "POST",
      body: JSON.stringify({ paths }),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok)
      throw new HttpError.BadGateway({
        upstream: {
          error: new HttpError.Error(res.statusText, res.status),
          text: await res.text(),
        },
      });
  }

  export async function send<TPath extends string>(
    path: StartsWith<"/", TPath>,
    init?: RequestInit,
  ): Promise<Response> {
    const url = buildUrl({
      fqdn: Backend.getFqdn(),
      path: `/api${path}`,
    });

    if (path === "/health") return fetch(url, init);

    const req = await SignatureV4.sign(
      "execute-api",
      new HttpRequest({
        method: init?.method ?? "GET",
        protocol: url.protocol,
        hostname: url.hostname,
        path,
        query: Object.fromEntries(
          new URLSearchParams(url.searchParams).entries(),
        ),
        headers: Object.fromEntries(
          new Headers({ host: url.hostname, ...init?.headers }).entries(),
        ),
        body: init?.body,
      }),
    );

    return fetch(
      Cloudfront.getSignedUrl({
        keyPairId: Resource.Aws.cloudfront.keyPair.id,
        privateKey: Resource.CloudfrontPrivateKey.pem,
        url: url.toString(),
        dateLessThan: addMinutes(Date.now(), 1).toISOString(),
      }),
      {
        method: req.method,
        headers: req.headers,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: req.body,
      },
    );
  }
}
