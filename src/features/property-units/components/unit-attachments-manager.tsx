"use client";

import { useState } from "react";
import { GripVertical, ImageOff, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/axios";
import { cn } from "@/lib/utils/utils";
import {
  useDeletePropertyUnitAttachmentMutation,
  useReorderPropertyUnitAttachmentsMutation,
  useUploadPropertyUnitAttachmentsMutation,
} from "../queries/property-unit-query";
import { MAX_UNIT_PHOTOS } from "../schemas/property-unit-schema";
import type { PropertyUnit, PropertyUnitAttachment } from "../types";

type UnitAttachmentsManagerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyUuid: string;
  unit: PropertyUnit | null;
};

export function UnitAttachmentsManager({
  open,
  onOpenChange,
  propertyUuid,
  unit,
}: UnitAttachmentsManagerProps) {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [lastSyncedAttachments, setLastSyncedAttachments] = useState<
    PropertyUnitAttachment[] | null | undefined
  >(unit?.attachments);
  const [orderedAttachments, setOrderedAttachments] = useState<
    PropertyUnitAttachment[]
  >(unit?.attachments ?? []);
  const [draggedUuid, setDraggedUuid] = useState<string | null>(null);

  const uploadMutation = useUploadPropertyUnitAttachmentsMutation(propertyUuid);
  const deleteMutation = useDeletePropertyUnitAttachmentMutation(propertyUuid);
  const reorderMutation =
    useReorderPropertyUnitAttachmentsMutation(propertyUuid);

  // Reconcile with fresh server data (e.g. after a refetch) without an
  // effect, per https://react.dev/learn/you-might-not-need-an-effect.
  if (unit?.attachments !== lastSyncedAttachments) {
    setLastSyncedAttachments(unit?.attachments);
    setOrderedAttachments(unit?.attachments ?? []);
  }

  if (!unit) return null;

  const remainingSlots = Math.max(
    0,
    MAX_UNIT_PHOTOS - (unit.attachments?.length ?? 0),
  );

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length > remainingSlots) {
      toast.error(
        `You can only add ${remainingSlots} more photo${remainingSlots === 1 ? "" : "s"} (max ${MAX_UNIT_PHOTOS} total).`,
      );
    }

    setPendingFiles(files.slice(0, remainingSlots));
  };

  const handleUpload = async () => {
    if (!pendingFiles.length) return;

    try {
      await uploadMutation.mutateAsync({ uuid: unit.uuid, images: pendingFiles });
      setPendingFiles([]);
      toast.success("Image(s) uploaded successfully.");
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  const handleRemove = async (attachmentUuid: string) => {
    try {
      await deleteMutation.mutateAsync({ uuid: unit.uuid, attachmentUuid });
      toast.success("Image deleted successfully.");
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  const handleDrop = (targetUuid: string) => (event: React.DragEvent) => {
    event.preventDefault();

    const previousOrder = orderedAttachments;

    if (!draggedUuid || draggedUuid === targetUuid) {
      setDraggedUuid(null);
      return;
    }

    const fromIndex = previousOrder.findIndex((a) => a.uuid === draggedUuid);
    const toIndex = previousOrder.findIndex((a) => a.uuid === targetUuid);
    setDraggedUuid(null);

    if (fromIndex === -1 || toIndex === -1) return;

    const newOrder = [...previousOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);

    setOrderedAttachments(newOrder);

    reorderMutation.mutate(
      { uuid: unit.uuid, attachmentUuids: newOrder.map((a) => a.uuid) },
      {
        onError: (err) => {
          toast.error((err as ApiError).message);
          setOrderedAttachments(previousOrder);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage photos</DialogTitle>
          <DialogDescription>
            Upload, remove, or drag to reorder photos for &quot;{unit.name}
            &quot;. The first photo is shown as the large cover image.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {orderedAttachments.length ? (
            <div className="grid grid-cols-3 gap-2">
              {orderedAttachments.map((attachment, index) => (
                <div
                  key={attachment.uuid}
                  draggable
                  onDragStart={() => setDraggedUuid(attachment.uuid)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop(attachment.uuid)}
                  onDragEnd={() => setDraggedUuid(null)}
                  className={cn(
                    "group relative aspect-square cursor-grab active:cursor-grabbing",
                    draggedUuid === attachment.uuid && "opacity-50",
                  )}
                >
                  <Avatar className="size-full rounded-md">
                    <AvatarImage
                      src={attachment.url}
                      alt={attachment.original_filename}
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md">
                      <ImageOff className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  {index === 0 ? (
                    <Badge className="absolute bottom-1 left-1">Cover</Badge>
                  ) : null}
                  <GripVertical className="absolute top-1 left-1 size-4 rounded-sm bg-background/80 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    className="absolute top-1 right-1"
                    disabled={deleteMutation.isPending}
                    onClick={() => handleRemove(attachment.uuid)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="flex flex-col items-center gap-2 py-6 text-sm text-muted-foreground">
              <ImageOff className="size-6" />
              No photos yet.
            </p>
          )}

          {remainingSlots === 0 ? (
            <p className="text-sm text-muted-foreground">
              Maximum of {MAX_UNIT_PHOTOS} photos reached. Remove a photo to
              add a new one.
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="flex-1"
              />
              <Button
                type="button"
                disabled={!pendingFiles.length || uploadMutation.isPending}
                onClick={handleUpload}
              >
                <Upload className="size-4" />
                {uploadMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
