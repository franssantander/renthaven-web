"use client";

import { useState } from "react";
import { ImageOff, Images, Pencil, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UnitPhotoLightbox } from "./unit-photo-lightbox";
import type { PropertyUnit } from "../types";

type UnitDetailOverviewProps = {
  unit: PropertyUnit;
  editMode: boolean;
  onEditDetails: () => void;
  onManagePhotos: () => void;
};

export function UnitDetailOverview({
  unit,
  editMode,
  onEditDetails,
  onManagePhotos,
}: UnitDetailOverviewProps) {
  const attachments = unit.attachments ?? [];
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Unit details</CardTitle>
        {editMode ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onManagePhotos}>
              <Images className="size-4" />
              Manage photos
            </Button>
            <Button size="sm" onClick={onEditDetails}>
              <Pencil className="size-4" />
              Edit details
            </Button>
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Capacity</p>
            <p className="font-medium">{unit.capacity}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Occupied</p>
            <p className="flex items-center gap-1 font-medium">
              <Users className="size-4" />
              {unit.occupied_count} / {unit.capacity}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rent price</p>
            <p className="font-medium">
              {new Intl.NumberFormat("en-US").format(unit.rent_price)}
              <span className="text-muted-foreground">/mo</span>
            </p>
          </div>
        </div>

        {unit.amenities?.length ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Amenities</p>
            <div className="flex flex-wrap gap-1">
              {unit.amenities.map((amenity) => (
                <Badge key={amenity.uuid} variant="secondary">
                  {amenity.name}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Photos</p>
          {attachments.length ? (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {attachments.map((attachment, index) => (
                <button
                  type="button"
                  key={attachment.uuid}
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <Avatar className="aspect-square size-full rounded-md">
                    <AvatarImage
                      src={attachment.url}
                      alt={attachment.original_filename}
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md">
                      <ImageOff className="size-4 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No photos yet.</p>
          )}
        </div>
      </CardContent>

      <UnitPhotoLightbox
        slides={attachments.map((attachment) => ({
          src: attachment.url,
          alt: attachment.original_filename,
        }))}
        index={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onIndexChange={setLightboxIndex}
      />
    </Card>
  );
}
