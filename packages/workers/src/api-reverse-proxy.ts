import { createFetchProxy } from "@mjackson/fetch-proxy";
import { createClient } from "@openauthjs/openauth/client";
import { subjects } from "@printworks/core/auth/shared";
import { HttpError } from "@printworks/core/utils/errors";
import { Hono } from "hono";
import { getConnInfo } from "hono/cloudflare-workers";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { Resource } from "sst";

import type { RateLimit } from "@cloudflare/workers-types";
import type { StatusCode } from "hono/utils/http-status";

export default new Hono<{
  Bindings: {
    USER_RATE_LIMITER: RateLimit;
    IP_RATE_LIMITER: RateLimit;
  };
}>()
  .use(logger())
  .use(async (c, next) => {
    const accessToken = c.req.header("Authorization")?.replace("Bearer ", "");

    let outcome: RateLimitOutcome | undefined;
    if (accessToken) {
      const verified = await createClient({
        clientID: "api-reverse-proxy",
        issuer: Resource.Auth.url,
      }).verify(subjects, accessToken);

      if (!verified.err)
        outcome = await c.env.USER_RATE_LIMITER.limit({
          key: `${verified.subject.properties.tenantId}#${verified.subject.properties.id}`,
        });
      else console.log(verified.err.message, "rate limiting by IP");
    }

    if (!outcome) {
      const ip = getConnInfo(c).remote.address;
      if (!ip) throw new Error("Missing remote address");

      outcome = await c.env.IP_RATE_LIMITER.limit({ key: ip });
    }

    if (!outcome.success) throw new HttpError.TooManyRequests();

    await next();
  })
  .all("*", (c) => createFetchProxy(Resource.Api.url)(c.req.raw))
  .onError((e, c) => {
    console.error(e);

    if (e instanceof HttpError.Error)
      return c.json(e.message, e.statusCode as StatusCode);
    if (e instanceof HTTPException) return e.getResponse();

    return c.json("Internal server error", 500);
  });
