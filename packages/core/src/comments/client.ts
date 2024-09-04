import { enforceRbac, mutationRbac } from "../auth/rbac";
import {
  AccessDeniedError,
  EntityNotFoundError,
  InvalidUserRoleError,
} from "../errors/application";
import * as Users from "../users/client";
import { optimisticMutator } from "../utils/helpers";
import {
  commentsTableName,
  createCommentMutationArgsSchema,
  deleteCommentMutationArgsSchema,
  updateCommentMutationArgsSchema,
} from "./shared";

import type { DeepReadonlyObject } from "replicache";
import type { Comment } from "./sql";

export const create = optimisticMutator(
  createCommentMutationArgsSchema,
  async (user, tx, values) => {
    const users = await Users.withOrderAccess(tx, values.orderId);

    if (
      users.some((u) => u.id === user.id) ||
      enforceRbac(user, mutationRbac.createComment, InvalidUserRoleError)
    )
      return true;

    throw new AccessDeniedError();
  },
  () => async (tx, values) =>
    tx.set(`${commentsTableName}/${values.id}`, values),
);

export const update = optimisticMutator(
  updateCommentMutationArgsSchema,
  async (user, tx, values) => {
    const users = await Users.withOrderAccess(tx, values.orderId);

    if (
      users.some((u) => u.id === user.id) ||
      enforceRbac(user, mutationRbac.updateComment, InvalidUserRoleError)
    )
      return true;

    throw new AccessDeniedError();
  },
  () => async (tx, values) => {
    const prev = await tx.get<Comment>(`${commentsTableName}/${values.id}`);
    if (!prev) throw new EntityNotFoundError(commentsTableName, values.id);

    const next = {
      ...prev,
      ...values,
    } satisfies DeepReadonlyObject<Comment>;

    return tx.set(`${commentsTableName}/${values.id}`, next);
  },
);

export const delete_ = optimisticMutator(
  deleteCommentMutationArgsSchema,
  async (user, tx, values) => {
    const users = await Users.withOrderAccess(tx, values.orderId);

    if (
      users.some((u) => u.id === user.id) ||
      enforceRbac(user, mutationRbac.deleteComment, InvalidUserRoleError)
    )
      return true;

    throw new AccessDeniedError();
  },
  ({ user }) =>
    async (tx, values) => {
      if (enforceRbac(user, ["administrator"])) {
        const prev = await tx.get<Comment>(`${commentsTableName}/${values.id}`);
        if (!prev) throw new EntityNotFoundError(commentsTableName, values.id);

        const next = {
          ...prev,
          ...values,
        } satisfies DeepReadonlyObject<Comment>;

        return tx.set(`${commentsTableName}/${values.id}`, next);
      }

      const success = await tx.del(`${commentsTableName}/${values.id}`);
      if (!success) throw new EntityNotFoundError(commentsTableName, values.id);
    },
);

export { commentSchema as schema } from "./shared";