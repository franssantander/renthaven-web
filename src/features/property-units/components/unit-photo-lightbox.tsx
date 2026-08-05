"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

type UnitPhotoLightboxSlide = {
  src: string;
  alt?: string;
};

type UnitPhotoLightboxProps = {
  slides: UnitPhotoLightboxSlide[];
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange?: (index: number) => void;
};

export function UnitPhotoLightbox({
  slides,
  index,
  open,
  onOpenChange,
  onIndexChange,
}: UnitPhotoLightboxProps) {
  return (
    <Lightbox
      open={open}
      close={() => onOpenChange(false)}
      slides={slides}
      index={index}
      on={{
        view: ({ index: viewIndex }) => onIndexChange?.(viewIndex),
      }}
      plugins={[Zoom]}
      zoom={{
        maxZoomPixelRatio: 3,
        doubleClickMaxStops: 2,
      }}
    />
  );
}
