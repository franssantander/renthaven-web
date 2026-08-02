import { useQuery } from "@tanstack/react-query";

import { amenityService } from "../services/amenity-service";

export function usePropertyAmenitiesQuery() {
  return useQuery({
    queryKey: ["amenities"],
    queryFn: amenityService.list,
    select: (amenities) =>
      amenities.filter(
        (amenity) => amenity.scope === "property" || amenity.scope === "both"
      ),
  });
}
