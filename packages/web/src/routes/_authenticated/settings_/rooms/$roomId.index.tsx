import { useState } from "react";
import { Rooms } from "@printdesk/core/rooms/client";
import { roomStatuses } from "@printdesk/core/rooms/shared";
import { createFileRoute } from "@tanstack/react-router";
import { Delete, HousePlus, Lock, LockOpen, Pencil, Save } from "lucide-react";

import { useMutators, useSubscribe } from "~/lib/hooks/replicache";
import { collectionItem, onSelectionChange } from "~/lib/ui";
import { labelStyles } from "~/styles/components/primitives/field";
import { EnforceAbac } from "~/ui/access-control";
import { DeleteRoomDialog } from "~/ui/dialogs/delete-room";
import { Markdown } from "~/ui/markdown";
import { Button } from "~/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/primitives/card";
import { DialogTrigger } from "~/ui/primitives/dialog";
import {
  Select,
  SelectItem,
  SelectListBox,
  SelectPopover,
} from "~/ui/primitives/select";
import { TextArea } from "~/ui/primitives/text-area";
import { TextField } from "~/ui/primitives/text-field";
import { Toggle } from "~/ui/primitives/toggle";

import type { RoomStatus } from "@printdesk/core/rooms/shared";

const routeId = "/_authenticated/settings_/rooms/$roomId/";

export const Route = createFileRoute(routeId)({
  beforeLoad: ({ context }) => context.authorizeRoute(routeId),
  loader: async ({ context, params }) => {
    const initialRoom = await context.replicache.query(
      Rooms.byId(params.roomId),
    );

    return { initialRoom };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData.initialRoom.name} | Printdesk`,
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid gap-6">
      <RoomCard />

      <DangerZoneCard />
    </div>
  );
}

function RoomCard() {
  const { roomId } = Route.useParams();
  const { initialRoom } = Route.useLoaderData();

  const room = useSubscribe(Rooms.byId(roomId), {
    defaultData: initialRoom,
  });

  const [isLocked, setIsLocked] = useState(() => true);
  const [name, setName] = useState(() => room.name);

  const { updateRoom } = useMutators();

  async function mutateName() {
    if (name !== room.name)
      await updateRoom({
        id: room.id,
        name,
        updatedAt: new Date(),
      });
  }

  return (
    <Card>
      <CardHeader className="flex-row justify-between gap-4 space-y-0">
        <CardTitle>Room</CardTitle>

        <EnforceAbac resource="rooms" action="update" input={[]}>
          {room.deletedAt ? null : (
            <Toggle onPress={() => setIsLocked((isLocked) => !isLocked)}>
              {({ isHovered }) =>
                isLocked ? (
                  isHovered ? (
                    <LockOpen className="size-5" />
                  ) : (
                    <Lock className="size-5" />
                  )
                ) : isHovered ? (
                  <Lock className="size-5" />
                ) : (
                  <LockOpen className="size-5" />
                )
              }
            </Toggle>
          )}
        </EnforceAbac>
      </CardHeader>

      <CardContent className="space-y-4">
        <EnforceAbac
          resource="rooms"
          action="update"
          input={[]}
          unauthorized={
            <TextField
              labelProps={{ children: "Name" }}
              inputProps={{ value: name ?? "" }}
            />
          }
        >
          <TextField
            labelProps={{ children: "Name" }}
            inputProps={{
              disabled: isLocked,
              value: name ?? "",
              onChange: (e) => setName(e.target.value),
              onBlur: void mutateName,
            }}
          />
        </EnforceAbac>

        <RoomStatus />

        <RoomDetails isLocked={isLocked} />
      </CardContent>
    </Card>
  );
}

function RoomStatus() {
  const { roomId } = Route.useParams();
  const { initialRoom } = Route.useLoaderData();

  const room = useSubscribe(Rooms.byId(roomId), {
    defaultData: initialRoom,
  });

  const { updateRoom } = useMutators();

  async function mutate(status: RoomStatus) {
    if (status !== room.status)
      await updateRoom({
        id: room.id,
        status,
        updatedAt: new Date(),
      });
  }

  return (
    <div className="flex justify-between gap-4">
      <div>
        <span className={labelStyles()}>Status</span>

        <CardDescription>{`The room status is currently "${room.status}".`}</CardDescription>
      </div>

      <EnforceAbac resource="rooms" action="update" input={[]}>
        <Select
          aria-label="status"
          selectedKey={room.status}
          onSelectionChange={onSelectionChange(roomStatuses, mutate)}
          isDisabled={!!room.deletedAt}
        >
          <Button>
            <Pencil className="mr-2 size-5" />
            Change Status
          </Button>

          <SelectPopover>
            <SelectListBox items={roomStatuses.map(collectionItem)}>
              {(item) => (
                <SelectItem
                  id={item.name}
                  textValue={item.name}
                  className="capitalize"
                >
                  {item.name}
                </SelectItem>
              )}
            </SelectListBox>
          </SelectPopover>
        </Select>
      </EnforceAbac>
    </div>
  );
}

type RoomDetailsProps = {
  isLocked: boolean;
};
function RoomDetails(props: RoomDetailsProps) {
  const { roomId } = Route.useParams();
  const { initialRoom } = Route.useLoaderData();

  const room = useSubscribe(Rooms.byId(roomId), {
    defaultData: initialRoom,
  });

  const [details, setDetails] = useState(() => room.details);
  const [isEditing, setIsEditing] = useState(() => false);

  const markdown = props.isLocked ? room.details : details;

  const { updateRoom } = useMutators();

  const saveDetails = async () => {
    if (room && details !== room.details)
      await updateRoom({
        id: room.id,
        details,
        updatedAt: new Date(),
      });
  };

  return (
    <>
      <div className="flex justify-between gap-4">
        <div>
          <span className={labelStyles()}>Details</span>

          <CardDescription>
            Write any additional details about this room, for example, contact
            information or room rules. Markdown is supported.
          </CardDescription>
        </div>

        <EnforceAbac resource="rooms" action="update" input={[]}>
          <div className="flex gap-2">
            <Toggle onPress={() => setIsEditing((toggle) => !toggle)}>
              <Pencil className="size-5" />
            </Toggle>

            <Button
              isDisabled={
                props.isLocked || room.details === details || !!room.deletedAt
              }
              onPress={saveDetails}
            >
              <Save className="mr-2 size-5" />
              Save
            </Button>
          </div>
        </EnforceAbac>
      </div>

      <EnforceAbac
        resource="rooms"
        action="update"
        input={[]}
        unauthorized={
          <Card className="bg-muted/20 p-4">
            {markdown ? (
              <Markdown>{markdown}</Markdown>
            ) : (
              <CardDescription>
                There are no details for this room.
              </CardDescription>
            )}
          </Card>
        }
      >
        {isEditing ? (
          <TextArea
            disabled={props.isLocked}
            value={details ?? ""}
            onChange={(e) => setDetails(e.target.value)}
          />
        ) : (
          <Card className="bg-muted/20 p-4">
            {markdown ? (
              <Markdown>{markdown}</Markdown>
            ) : (
              <CardDescription>
                There are no details for this room.
              </CardDescription>
            )}
          </Card>
        )}
      </EnforceAbac>
    </>
  );
}

function DangerZoneCard() {
  const { roomId } = Route.useParams();
  const { initialRoom } = Route.useLoaderData();

  const room = useSubscribe(Rooms.byId(roomId), {
    defaultData: initialRoom,
  });

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6">
        {room.deletedAt ? (
          <EnforceAbac resource="rooms" action="update" input={[]}>
            <RestoreRoom />
          </EnforceAbac>
        ) : (
          <EnforceAbac resource="rooms" action="delete" input={[]}>
            <DeleteRoom />
          </EnforceAbac>
        )}
      </CardContent>
    </Card>
  );
}

function DeleteRoom() {
  const { roomId } = Route.useParams();

  return (
    <div className="flex justify-between gap-4">
      <div>
        <span className={labelStyles()}>Delete Room</span>

        <CardDescription>Delete this room.</CardDescription>
      </div>

      <DialogTrigger>
        <Button variant="destructive">
          <Delete className="mr-2 size-5" />
          Delete Room
        </Button>

        <DeleteRoomDialog roomId={roomId} />
      </DialogTrigger>
    </div>
  );
}

function RestoreRoom() {
  const { roomId } = Route.useParams();

  const { restoreRoom } = useMutators();

  return (
    <div className="flex justify-between gap-4">
      <div>
        <span className={labelStyles()}>Restore Room</span>

        <CardDescription>
          This room has been deleted. You can restore it here.
        </CardDescription>
      </div>

      <Button variant="secondary" onPress={() => restoreRoom({ id: roomId })}>
        <HousePlus className="mr-2 size-5" />
        Restore Room
      </Button>
    </div>
  );
}
