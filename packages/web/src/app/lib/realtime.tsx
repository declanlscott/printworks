import usePartySocket from "partysocket/react";

import { useReplicache } from "~/app/lib/replicache";
import { useResource } from "~/app/lib/resource";

type RealtimeProps = {
  channel: string;
};

export function useRealtime(props: RealtimeProps) {
  const { PartyKitUrl, ReplicacheLicenseKey } = useResource();

  const replicache = useReplicache();

  return usePartySocket({
    host: PartyKitUrl.value,
    room: props.channel,
    onMessage: (message) => {
      if (message.data === "poke") void replicache?.pull();
    },
    query: {
      replicacheLicenseKey: ReplicacheLicenseKey.value,
    },
  });
}
