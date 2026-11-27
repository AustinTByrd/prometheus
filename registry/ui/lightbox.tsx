// @prometheus 0.2.0
"use client"

import * as React from "react"
import * as LightboxPrimitive from "@ramka/react/lightbox"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { SurfaceProvider } from "@/lib/surface-context"

/** One image in a `LightboxGallery`. Pass the real pixel size so the morph target is sized before the image loads. */
type LightboxGalleryItem = {
  id?: string | number
  src: string
  thumb?: string
  alt: string
  caption?: React.ReactNode
  width: number
  height: number
}

/**
 * Chrome steps aside while the photo is pulled to dismiss. `--lightbox-*`
 * variables and the `data-pull*` / `data-zoomed` attributes are written by ramka.
 */
const chromeClassName =
  "transition-opacity duration-(--duration-fast) ease-(--ease-standard) starting:opacity-0 group-data-pulling/lightbox:pointer-events-none group-data-pulling/lightbox:opacity-0 group-data-pull-dismissing/lightbox:opacity-0"

const controlClassName =
  "data-disabled:pointer-events-none data-disabled:opacity-50"

function Lightbox(props: LightboxPrimitive.LightboxRootProps) {
  return <LightboxPrimitive.Root {...props} />
}

function LightboxTrigger({
  className,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Trigger>) {
  return (
    <LightboxPrimitive.Trigger
      data-slot="lightbox-trigger"
      className={cn(
        "relative block cursor-zoom-in overflow-hidden rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&_img]:size-full [&_img]:object-cover",
        className
      )}
      {...props}
    />
  )
}

function LightboxPortal({
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Portal>) {
  return <LightboxPrimitive.Portal data-slot="lightbox-portal" {...props} />
}

function LightboxBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Backdrop>) {
  return (
    <LightboxPrimitive.Backdrop
      data-slot="lightbox-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-background opacity-0 transition-opacity duration-[var(--lightbox-pull-snap-duration,var(--lightbox-vt-duration,var(--duration-standard)))] ease-[var(--lightbox-pull-snap-easing,var(--ease-enter))] data-open:opacity-[calc(1_-_var(--lightbox-pull-progress,0)_*_0.6)] data-open:starting:opacity-0 data-pulling:transition-none",
        className
      )}
      {...props}
    />
  )
}

/** The dialog surface. Insets around the media live in `--lb-inset-*`, read by `LightboxSlide`. */
function LightboxPopup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Content>) {
  return (
    <LightboxPrimitive.Content
      data-slot="lightbox-popup"
      className={cn(
        "group/lightbox fixed inset-0 z-50 flex flex-col overscroll-contain text-foreground opacity-0 outline-none transition-opacity duration-[var(--lightbox-vt-duration,var(--duration-standard))] ease-(--ease-enter) data-open:opacity-100 data-open:starting:opacity-0",
        "[--lb-inset-bottom:calc(3.5rem_+_env(safe-area-inset-bottom,0px))] [--lb-inset-inline:0px] [--lb-inset-top:calc(3.5rem_+_env(safe-area-inset-top,0px))] md:[--lb-inset-inline:4.5rem]",
        className
      )}
      {...props}
    >
      <SurfaceProvider value={1}>{children}</SurfaceProvider>
    </LightboxPrimitive.Content>
  )
}

function LightboxSlides({
  className,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Slides>) {
  return (
    <LightboxPrimitive.Slides
      data-slot="lightbox-slides"
      className={cn(
        "flex-1 gap-4 [scrollbar-width:none] md:gap-0 [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    />
  )
}

function LightboxSlide({
  className,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Slide>) {
  return (
    <LightboxPrimitive.Slide
      data-slot="lightbox-slide"
      className={cn(
        "h-full min-w-full flex-[0_0_100%] px-(--lb-inset-inline) pt-(--lb-inset-top) pb-(--lb-inset-bottom)",
        className
      )}
      {...props}
    />
  )
}

function LightboxItem({
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Item>) {
  return <LightboxPrimitive.Item data-slot="lightbox-item" {...props} />
}

function LightboxZoom({
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Zoom>) {
  return <LightboxPrimitive.Zoom data-slot="lightbox-zoom" {...props} />
}

/** Morph target. Plain radius, not smooth corners: the view transition animates border-radius, and a clip-path would cut the morph. */
function LightboxMedia({
  className,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Media>) {
  return (
    <LightboxPrimitive.Media
      data-slot="lightbox-media"
      className={cn(
        "overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] md:rounded-lg md:after:shadow-[inset_0_0_0_0.5px_hsl(0_0%_0%/10%)] dark:md:after:shadow-[inset_0_0_0_0.5px_hsl(0_0%_100%/12%)] [&_img]:select-none",
        className
      )}
      {...props}
    />
  )
}

function LightboxClose({
  className,
  children,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Close>) {
  return (
    <LightboxPrimitive.Close
      data-slot="lightbox-close"
      aria-label="Close"
      render={<Button size="icon" />}
      className={cn(controlClassName, className)}
      {...props}
    >
      {children ?? <XMarkIcon />}
    </LightboxPrimitive.Close>
  )
}

function LightboxZoomIn({
  className,
  children,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.ZoomIn>) {
  return (
    <LightboxPrimitive.ZoomIn
      data-slot="lightbox-zoom-in"
      aria-label="Zoom in"
      render={<Button size="icon" />}
      className={cn(controlClassName, className)}
      {...props}
    >
      {children ?? <MagnifyingGlassPlusIcon />}
    </LightboxPrimitive.ZoomIn>
  )
}

function LightboxZoomOut({
  className,
  children,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.ZoomOut>) {
  return (
    <LightboxPrimitive.ZoomOut
      data-slot="lightbox-zoom-out"
      aria-label="Zoom out"
      render={<Button size="icon" />}
      className={cn(controlClassName, className)}
      {...props}
    >
      {children ?? <MagnifyingGlassMinusIcon />}
    </LightboxPrimitive.ZoomOut>
  )
}

function LightboxPrevious({
  className,
  children,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Previous>) {
  return (
    <LightboxPrimitive.Previous
      data-slot="lightbox-previous"
      aria-label="Previous"
      render={<Button size="icon" />}
      className={cn(controlClassName, className)}
      {...props}
    >
      {children ?? <ChevronLeftIcon />}
    </LightboxPrimitive.Previous>
  )
}

function LightboxNext({
  className,
  children,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Next>) {
  return (
    <LightboxPrimitive.Next
      data-slot="lightbox-next"
      aria-label="Next"
      render={<Button size="icon" />}
      className={cn(controlClassName, className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </LightboxPrimitive.Next>
  )
}

function LightboxCounter({
  className,
  children = ({ current, total }) => `${current} of ${total}`,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Counter>) {
  return (
    <LightboxPrimitive.Counter
      data-slot="lightbox-counter"
      className={cn("text-xs text-muted-foreground tabular-nums", className)}
      {...props}
    >
      {children}
    </LightboxPrimitive.Counter>
  )
}

function LightboxCaption({
  className,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Caption>) {
  return (
    <LightboxPrimitive.Caption
      data-slot="lightbox-caption"
      className={cn(
        "block max-w-full truncate text-sm font-medium text-foreground select-text",
        className
      )}
      {...props}
    />
  )
}

function LightboxThumbnails({
  className,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.ThumbnailGroup>) {
  return (
    <LightboxPrimitive.ThumbnailGroup
      data-slot="lightbox-thumbnails"
      className={cn(
        "flex max-w-full gap-2 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    />
  )
}

function LightboxThumbnail({
  className,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Thumbnail>) {
  return (
    <LightboxPrimitive.Thumbnail
      data-slot="lightbox-thumbnail"
      className={cn(
        "relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-sm opacity-60 outline-none transition-[opacity,box-shadow] duration-(--duration-fast) ease-(--ease-standard) hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 data-active:opacity-100 data-active:ring-2 data-active:ring-foreground data-active:ring-offset-2 data-active:ring-offset-background [&_img]:size-full [&_img]:object-cover",
        className
      )}
      {...props}
    />
  )
}

/** Portal, backdrop, and dialog with the zoom and close toolbar. Children are the slides and any extra chrome. */
function LightboxContent({
  children,
  container,
  keepMounted,
  showCloseButton = true,
  showZoomControls = true,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Content> & {
  container?: LightboxPrimitive.LightboxPortalProps["container"]
  keepMounted?: boolean
  showCloseButton?: boolean
  showZoomControls?: boolean
}) {
  return (
    <LightboxPortal container={container} keepMounted={keepMounted}>
      <LightboxBackdrop />
      <LightboxPopup {...props}>
        {children}
        {showCloseButton || showZoomControls ? (
          <div
            data-slot="lightbox-toolbar"
            className={cn(
              "absolute top-[calc(0.75rem_+_env(safe-area-inset-top,0px))] right-3 z-10 flex gap-2",
              chromeClassName
            )}
          >
            {showZoomControls ? (
              <>
                <LightboxZoomOut className="max-md:hidden" />
                <LightboxZoomIn className="max-md:hidden" />
              </>
            ) : null}
            {showCloseButton ? <LightboxClose /> : null}
          </div>
        ) : null}
      </LightboxPopup>
    </LightboxPortal>
  )
}

/** The whole viewer from an array of images: swipe, zoom, caption, counter, arrows, and thumbnails. */
function LightboxGallery({
  items,
  className,
  showThumbnails = true,
  preload = 1,
  ...props
}: Omit<React.ComponentProps<typeof LightboxContent>, "children"> & {
  items: LightboxGalleryItem[]
  showThumbnails?: boolean
  preload?: number
}) {
  const solo = items.length <= 1
  const thumbnails = showThumbnails && !solo

  return (
    <LightboxContent
      className={cn(
        thumbnails &&
          "md:[--lb-inset-bottom:calc(7.5rem_+_env(safe-area-inset-bottom,0px))]",
        solo && "md:[--lb-inset-inline:1.5rem]",
        className
      )}
      {...props}
    >
      <LightboxSlides aria-roledescription="carousel" aria-label="Images" preload={preload}>
        {items.map((item, index) => (
          <LightboxSlide key={item.id ?? index}>
            <LightboxItem
              index={index}
              caption={item.caption ?? item.alt}
              aria-roledescription="slide"
              {...(thumbnails ? {} : { "aria-label": `${index + 1} of ${items.length}` })}
            >
              <LightboxZoom>
                <LightboxMedia width={item.width} height={item.height}>
                  <img
                    alt={item.alt}
                    draggable={false}
                    height={item.height}
                    src={item.src}
                    width={item.width}
                  />
                </LightboxMedia>
              </LightboxZoom>
            </LightboxItem>
          </LightboxSlide>
        ))}
      </LightboxSlides>

      {solo ? null : (
        <>
          <LightboxPrevious
            className={cn(
              "absolute top-1/2 left-4 z-10 -translate-y-1/2 max-md:hidden",
              chromeClassName
            )}
          />
          <LightboxNext
            className={cn(
              "absolute top-1/2 right-4 z-10 -translate-y-1/2 max-md:hidden",
              chromeClassName
            )}
          />
        </>
      )}

      <div
        data-slot="lightbox-footer"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 px-4 pb-[calc(1rem_+_env(safe-area-inset-bottom,0px))]",
          chromeClassName,
          "group-data-zoomed/lightbox:opacity-0"
        )}
      >
        <div className="pointer-events-auto flex max-w-full flex-col items-center text-center">
          <LightboxCaption />
          {solo ? null : (
            <LightboxCounter className={thumbnails ? "md:sr-only" : undefined} />
          )}
        </div>
        {thumbnails ? (
          <LightboxThumbnails
            aria-label="Thumbnails"
            className="pointer-events-auto max-md:hidden"
          >
            {items.map((item, index) => (
              <LightboxThumbnail key={item.id ?? index} index={index}>
                <img alt={item.alt} draggable={false} src={item.thumb ?? item.src} />
              </LightboxThumbnail>
            ))}
          </LightboxThumbnails>
        ) : null}
      </div>
    </LightboxContent>
  )
}

const createLightboxHandle = LightboxPrimitive.createHandle

export {
  Lightbox,
  LightboxBackdrop,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
  LightboxCounter,
  LightboxGallery,
  LightboxItem,
  LightboxMedia,
  LightboxNext,
  LightboxPopup,
  LightboxPortal,
  LightboxPrevious,
  LightboxSlide,
  LightboxSlides,
  LightboxThumbnail,
  LightboxThumbnails,
  LightboxTrigger,
  LightboxZoom,
  LightboxZoomIn,
  LightboxZoomOut,
  createLightboxHandle,
  type LightboxGalleryItem,
}
