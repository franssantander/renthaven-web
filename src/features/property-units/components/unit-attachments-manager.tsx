"use client";

import { useState } from "react";
import { ImageOff, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  useDeletePropertyUnitAttachmentMutation,
  useUploadPropertyUnitAttachmentsMutation,
} from "../queries/property-unit-query";
import type { PropertyUnit } from "../types";

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

  const uploadMutation = useUploadPropertyUnitAttachmentsMutation(propertyUuid);
  const deleteMutation = useDeletePropertyUnitAttachmentMutation(propertyUuid);

  if (!unit) return null;

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPendingFiles(Array.from(event.target.files ?? []));
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage photos</DialogTitle>
          <DialogDescription>
            Upload or remove photos for &quot;{unit.name}&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {unit.attachments?.length ? (
            <div className="grid grid-cols-3 gap-2">
              {unit.attachments.map((attachment) => (
                <div key={attachment.uuid} className="group relative aspect-square">
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
