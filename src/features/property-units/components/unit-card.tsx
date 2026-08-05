"use client";

import { useState } from "react";
import { ImageOff, Images, MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getUnitStatusBadgeVariant,
  getUnitStatusLabel,
} from "../config/unit-status";
import { MAX_UNIT_PHOTOS } from "../schemas/property-unit-schema";
import { UnitPhotoLightbox } from "./unit-photo-lightbox";
import type { PropertyUnit } from "../types";

type UnitCardProps = {
  unit: PropertyUnit;
  onEdit: (unit: PropertyUnit) => void;
  onDelete: (unit: PropertyUnit) => void;
  onManagePhotos: (unit: PropertyUnit) => void;
};

export function UnitCard({
  unit,
  onEdit,
  onDelete,
  onManagePhotos,
}: UnitCardProps) {
  const attachments = unit.attachments ?? [];
  const coverImage = attachments[0]?.url;

  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = (index: number) => {
    if (!attachments.length) return;
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <Card className="overflow-hidden py-0 gap-0">
      <button
        type="button"
        className="relative block aspect-video w-full bg-muted disabled:cursor-default"
        disabled={!attachments.length}
        onClick={() => openLightbox(0)}
      >
        <Avatar className="size-full rounded-none">
          <AvatarImage
            src={coverImage ?? undefined}
            alt={unit.name}
            className="rounded-none"
          />
          <AvatarFallback className="rounded-none">
            <ImageOff className="size-6 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <Badge
          variant={getUnitStatusBadgeVariant(unit.status)}
          className="absolute top-2 right-2"
        >
          {getUnitStatusLabel(unit.status)}
        </Badge>
      </button>

      {attachments.length ? (
        <div className="grid grid-cols-4 gap-1 bg-muted p-1">
          {attachments.slice(0, MAX_UNIT_PHOTOS).map((attachment, index) => (
            <button
              type="button"
              key={attachment.uuid}
              onClick={() => openLightbox(index)}
            >
              <Avatar className="aspect-square size-full rounded-sm">
                <AvatarImage
                  src={attachment.url}
                  alt={attachment.original_filename}
                  className="rounded-sm"
                />
                <AvatarFallback className="rounded-sm">
                  <ImageOff className="size-3 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            </button>
          ))}
        </div>
      ) : null}

      <CardHeader className="pt-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium">{unit.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(unit)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManagePhotos(unit)}>
                <Images className="size-4" />
                Manage photos
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(unit)}>
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="size-4" />
          {unit.capacity}
        </span>
        <span className="font-medium text-foreground">
          {new Intl.NumberFormat("en-US").format(unit.rent_price)}
          <span className="text-muted-foreground">/mo</span>
        </span>
      </CardContent>

      {unit.amenities?.length ? (
        <CardFooter className="flex flex-wrap gap-1 pb-4">
          {unit.amenities.map((amenity) => (
            <Badge key={amenity.uuid} variant="secondary">
              {amenity.name}
            </Badge>
          ))}
        </CardFooter>
      ) : null}

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
