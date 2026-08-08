"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils/utils";
import { UnitCard } from "./unit-card";
import type { PropertyUnit } from "../types";

type UnitListProps = {
  units: PropertyUnit[];
  propertyUuid: string;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  errorMessage?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchNextPage: () => void;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onCreate: () => void;
  onEdit: (unit: PropertyUnit) => void;
  onDelete: (unit: PropertyUnit) => void;
  onManagePhotos: (unit: PropertyUnit) => void;
};

export function UnitList({
  units,
  propertyUuid,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  onSearchChange,
  onRefresh,
  onCreate,
  onEdit,
  onDelete,
  onManagePhotos,
}: UnitListProps) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  useEffect(() => {
    onSearchChange(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          onFetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search units..."
            className="pl-8"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button onClick={onCreate}>
            <Plus className="size-4" />
            Add unit
          </Button>
        </div>
      </div>

      {isError ? (
        <p className="py-8 text-center text-sm text-destructive">
          {errorMessage ?? "Failed to load units."}
        </p>
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full" />
          ))}
        </div>
      ) : units.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No units yet. Add the first unit to get started.
        </p>
      ) : (
        <>
          <div
            className={cn(
              "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
              isFetching && !isFetchingNextPage && "opacity-60 transition-opacity",
            )}
          >
            {units.map((unit) => (
              <UnitCard
                key={unit.uuid}
                unit={unit}
                propertyUuid={propertyUuid}
                onEdit={onEdit}
                onDelete={onDelete}
                onManagePhotos={onManagePhotos}
              />
            ))}
          </div>

          <div ref={sentinelRef} className="h-1" />

          {isFetchingNextPage ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Loading more...
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
