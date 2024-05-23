import { eq, sql } from "drizzle-orm";

import { transact } from "../database/transaction";
import { BadRequestError } from "../errors/http";
import { parseSchema } from "../valibot";
import { updateUserRole } from "./mutations";
import { pokeMany } from "./poke";
import { ReplicacheClient, ReplicacheClientGroup } from "./replicache.sql";
import { Mutation } from "./schemas";

import type { User as LuciaUser } from "lucia";
import type {
  ClientStateNotFoundResponse,
  MutationV1,
  PushRequest,
  VersionNotSupportedResponse,
} from "replicache";
import type { Transaction } from "../database/transaction";
import type { OmitTimestamps } from "../drizzle/utils";

type PushResult =
  | { type: "success" }
  | {
      type: "error";
      response: ClientStateNotFoundResponse | VersionNotSupportedResponse;
    };

export async function push(
  user: LuciaUser,
  pushRequest: PushRequest,
): Promise<PushResult> {
  if (pushRequest.pushVersion !== 1)
    return {
      type: "error",
      response: { error: "VersionNotSupported", versionType: "push" },
    };

  for (const mutation of pushRequest.mutations) {
    try {
      const channels = await processMutation(
        user,
        pushRequest.clientGroupID,
        mutation,
      );

      await pokeMany(channels);
    } catch (e) {
      // retry in error mode
      await processMutation(user, pushRequest.clientGroupID, mutation, true);
    }
  }

  return { type: "success" };
}

// Implements push algorithm from Replicache docs
// https://doc.replicache.dev/strategies/row-version#push
async function processMutation(
  user: LuciaUser,
  clientGroupId: string,
  mutation: MutationV1,
  // 1: `let errorMode = false`. In JS, we implement this step naturally
  // as a param. In case of failure, caller will call us again with `true`
  errorMode = false,
) {
  // 2: Begin transaction
  return await transact(async (tx) => {
    let channels: Array<string> = [];

    // 3: Get client group
    const [clientGroup] = (await tx
      .select({
        id: ReplicacheClientGroup.id,
        cvrVersion: ReplicacheClientGroup.cvrVersion,
        userId: ReplicacheClientGroup.userId,
      })
      .from(ReplicacheClientGroup)
      .for("update")
      .where(eq(ReplicacheClientGroup.id, clientGroupId))) ?? [
      {
        id: clientGroupId,
        cvrVersion: 0,
        userId: user.id,
      } satisfies OmitTimestamps<ReplicacheClientGroup>,
    ];

    // 4: Verify requesting user owns the client group
    if (clientGroup.userId !== user.id)
      throw new Error(
        `User ${user.id} does not own client group ${clientGroupId}`,
      );

    // 5: Get client
    const [client] = (await tx
      .select({
        id: ReplicacheClient.id,
        clientGroupId: ReplicacheClient.clientGroupId,
        lastMutationId: ReplicacheClient.lastMutationId,
      })
      .from(ReplicacheClient)
      .for("update")
      .where(eq(ReplicacheClient.id, mutation.clientID))) ?? [
      {
        id: mutation.clientID,
        clientGroupId: clientGroupId,
        lastMutationId: 0,
      } satisfies OmitTimestamps<ReplicacheClient>,
    ];

    // 6: Verify requesting client group owns the client
    if (client.clientGroupId !== clientGroupId) {
      throw new Error(
        `Client ${mutation.clientID} does not belong to client group ${clientGroupId}`,
      );
    }

    // 7: Next mutation ID
    const nextMutationId = client.lastMutationId + 1;

    // 8: Rollback and skip if mutation already processed
    if (mutation.id < nextMutationId) {
      console.log(`Mutation ${mutation.id} already processed - skipping`);

      return channels;
    }

    // 9: Rollback and throw if mutation is from the future
    if (mutation.id > nextMutationId) {
      throw new Error(`Mutation ${mutation.id} is from the future - aborting`);
    }

    const start = Date.now();

    // 10. Perform mutation
    if (!errorMode) {
      try {
        // 10(i): Business logic
        // 10(i)(a): xmin column is automatically updated by Postgres on any affected rows
        channels = await mutate(
          tx,
          user,
          parseSchema(Mutation, mutation, {
            Error: BadRequestError,
            message: "Failed to parse mutation",
          }),
        );
      } catch (e) {
        // 10(ii)(a-c): Log, abort, and retry
        console.error(`Error processing mutation ${mutation.id}:`, e);

        throw e;
      }
    }

    const nextClient = {
      id: client.id,
      clientGroupId,
      lastMutationId: nextMutationId,
    } satisfies OmitTimestamps<ReplicacheClient>;

    await Promise.all([
      // 11. Upsert client group
      await tx
        .insert(ReplicacheClientGroup)
        .values(clientGroup)
        .onConflictDoUpdate({
          target: ReplicacheClientGroup.id,
          set: { ...clientGroup, updatedAt: sql`now()` },
        }),

      // 12. Upsert client
      await tx
        .insert(ReplicacheClient)
        .values(nextClient)
        .onConflictDoUpdate({
          target: ReplicacheClient.id,
          set: { ...nextClient, updatedAt: sql`now()` },
        }),
    ]);

    const end = Date.now();
    console.log(`Processed mutation ${mutation.id} in ${end - start}ms`);

    return channels;
  });
}

async function mutate(
  tx: Transaction,
  user: LuciaUser,
  mutation: Mutation,
): Promise<string[]> {
  switch (mutation.name) {
    case "updateUserRole":
      return await updateUserRole(tx, user, mutation.args);
    default:
      return [];
  }
}
