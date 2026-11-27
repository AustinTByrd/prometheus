"use client"

import {
  Lightbox,
  LightboxGallery,
  type LightboxGalleryItem,
  LightboxTrigger,
} from "@/components/ui/lightbox"
import { cn } from "@/lib/utils"

const PHOTOS: LightboxGalleryItem[] = [
  {
    id: "ridge",
    src: "/lightbox/ridge.jpg",
    thumb: "/lightbox/ridge-thumb.jpg",
    alt: "Snow-capped peaks above a sea of clouds at sunset",
    caption: "Above the clouds",
    width: 1600,
    height: 1067,
  },
  {
    id: "lake",
    src: "/lightbox/lake.jpg",
    thumb: "/lightbox/lake-thumb.jpg",
    alt: "A rowboat on a turquoise alpine lake below limestone cliffs",
    caption: "Rowing out at noon",
    width: 1600,
    height: 1067,
  },
  {
    id: "fog",
    src: "/lightbox/fog.jpg",
    thumb: "/lightbox/fog-thumb.jpg",
    alt: "Green cliffs disappearing into low fog, a road winding below",
    caption: "Fog on the ridge road",
    width: 1200,
    height: 1500,
  },
  {
    id: "forest",
    src: "/lightbox/forest.jpg",
    thumb: "/lightbox/forest-thumb.jpg",
    alt: "A dirt path through a sunlit pine forest",
    caption: "Through the pines",
    width: 1600,
    height: 1067,
  },
  {
    id: "valley",
    src: "/lightbox/valley.jpg",
    thumb: "/lightbox/valley-thumb.jpg",
    alt: "A hiker standing on a rock above a hazy green valley",
    caption: "The last summit",
    width: 1400,
    height: 1400,
  },
  {
    id: "coast",
    src: "/lightbox/coast.jpg",
    thumb: "/lightbox/coast-thumb.jpg",
    alt: "Waves on a sandy beach under a pastel sunset",
    caption: "Low tide",
    width: 1600,
    height: 1067,
  },
]

export function LightboxGalleryDemo() {
  return (
    <Lightbox>
      <div className="grid w-full max-w-md grid-cols-3 gap-2">
        {PHOTOS.map((photo, index) => (
          <LightboxTrigger className="aspect-square" index={index} key={photo.id}>
            {({ imageRef }) => (
              <img
                alt={photo.alt}
                height={photo.height}
                ref={imageRef}
                src={photo.thumb}
                width={photo.width}
              />
            )}
          </LightboxTrigger>
        ))}
      </div>
      <LightboxGallery aria-label="Trip photos" items={PHOTOS} />
    </Lightbox>
  )
}

const TILE_CORNERS = ["rounded-tl-lg", "rounded-tr-lg", "rounded-bl-lg", "rounded-br-lg"]

export function LightboxAlbumDemo() {
  const extra = PHOTOS.length - 4

  return (
    <Lightbox morphTo="closest">
      <div className="grid aspect-[3/2] w-full max-w-md grid-cols-2 grid-rows-2 gap-0.5">
        {PHOTOS.slice(0, 4).map((photo, index) => {
          const overflow = index === 3 && extra > 0
          return (
            <LightboxTrigger
              className={cn("min-h-0 rounded-none", TILE_CORNERS[index])}
              crossfade={overflow ? "both" : undefined}
              index={index}
              key={photo.id}
            >
              {({ imageRef }) => (
                <>
                  <img
                    alt={photo.alt}
                    className="absolute inset-0"
                    height={photo.height}
                    ref={imageRef}
                    src={photo.thumb}
                    width={photo.width}
                  />
                  {overflow ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xl font-medium text-white">
                      +{extra}
                    </span>
                  ) : null}
                </>
              )}
            </LightboxTrigger>
          )
        })}
      </div>
      <LightboxGallery aria-label="Album" items={PHOTOS} />
    </Lightbox>
  )
}

export function LightboxSingleDemo() {
  const photo = PHOTOS[1]

  return (
    <figure className="flex w-full max-w-md flex-col gap-2">
      <Lightbox>
        <LightboxTrigger className="aspect-[3/2] w-full" index={0}>
          {({ imageRef }) => (
            <img
              alt={photo.alt}
              height={photo.height}
              ref={imageRef}
              src={photo.thumb}
              width={photo.width}
            />
          )}
        </LightboxTrigger>
        <LightboxGallery aria-label={photo.alt} items={[photo]} />
      </Lightbox>
      <figcaption className="text-xs text-muted-foreground">
        An alpine lake at midday. Click to open.
      </figcaption>
    </figure>
  )
}
