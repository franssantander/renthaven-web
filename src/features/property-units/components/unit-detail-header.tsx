"use client";

import { Pencil, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getUnitStatusBadgeVariant,
  getUnitStatusLabel,
} from "../config/unit-status";
import type { PropertyUnit } from "../types";

type UnitDetailHeaderProps = {
  unit: PropertyUnit;
  editMode: boolean;
  onToggleEditMode: () => void;
};

export function UnitDetailHeader({
  unit,
  editMode,
  onToggleEditMode,
}: UnitDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{unit.name}</h1>
        <Badge variant={getUnitStatusBadgeVariant(unit.status)}>
          {getUnitStatusLabel(unit.status)}
        </Badge>
      </div>
      <Button
        variant={editMode ? "outline" : "default"}
        onClick={onToggleEditMode}
      >
        {editMode ? (
          <>
            <X className="size-4" />
            Done editing
          </>
        ) : (
          <>
            <Pencil className="size-4" />
            Edit
          </>
        )}
      </Button>
    </div>
  );
}
