import * as v from "valibot";

export const updateTailscaleOauthClientSchema = v.object({
  id: v.string(),
  secret: v.string(),
});
