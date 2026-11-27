import type { Metadata } from "next"
import Link from "next/link"

import {
  LightboxAlbumDemo,
  LightboxGalleryDemo,
  LightboxSingleDemo,
} from "@/app/demos/lightbox-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { PlaygroundFigure, PlaygroundStage } from "@/components/site/playground"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Lightbox — Prometheus",
  description:
    "ramka lightbox on Prometheus tokens: a morph from the thumbnail, swipe, pinch to zoom, pull to dismiss, and Button controls, plus a gallery that builds the whole viewer from an array of images.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "album", title: "Album and overflow" },
  { id: "single", title: "Single image" },
  { id: "gestures", title: "Gestures and keys" },
  { id: "composition", title: "Composition" },
  { id: "accessibility", title: "Accessibility" },
  { id: "api", title: "API" },
]

const usageSample = `import {
  Lightbox,
  LightboxGallery,
  LightboxTrigger,
  type LightboxGalleryItem,
} from "@/components/ui/lightbox"

const photos: LightboxGalleryItem[] = [
  { src: "/ridge.jpg", thumb: "/ridge-thumb.jpg", alt: "Peaks above the clouds", width: 1600, height: 1067 },
  // …
]

<Lightbox>
  {photos.map((photo, index) => (
    <LightboxTrigger className="aspect-square" index={index} key={photo.src}>
      {({ imageRef }) => <img ref={imageRef} src={photo.thumb} alt={photo.alt} />}
    </LightboxTrigger>
  ))}
  <LightboxGallery aria-label="Trip photos" items={photos} />
</Lightbox>`

const albumSample = `<Lightbox morphTo="closest">
  {photos.slice(0, 4).map((photo, index) => (
    <LightboxTrigger
      crossfade={index === 3 ? "both" : undefined}
      index={index}
      key={photo.src}
    >
      {({ imageRef }) => (
        <>
          <img ref={imageRef} src={photo.thumb} alt={photo.alt} />
          {index === 3 ? <span>+{photos.length - 4}</span> : null}
        </>
      )}
    </LightboxTrigger>
  ))}
  <LightboxGallery aria-label="Album" items={photos} />
</Lightbox>`

const compositionSample = `import {
  Lightbox,
  LightboxCaption,
  LightboxContent,
  LightboxItem,
  LightboxMedia,
  LightboxSlide,
  LightboxSlides,
  LightboxTrigger,
  LightboxZoom,
} from "@/components/ui/lightbox"

<Lightbox>
  <LightboxTrigger index={0}>…</LightboxTrigger>
  <LightboxContent aria-label="Floor plan" showZoomControls>
    <LightboxSlides aria-label="Plans" aria-roledescription="carousel">
      <LightboxSlide>
        <LightboxItem index={0} caption="Ground floor">
          <LightboxZoom maxZoom={8}>
            <LightboxMedia width={2400} height={1600}>
              <img src="/plan.png" alt="Ground floor plan" width={2400} height={1600} />
            </LightboxMedia>
          </LightboxZoom>
        </LightboxItem>
      </LightboxSlide>
    </LightboxSlides>
    <LightboxCaption className="absolute inset-x-0 bottom-4 text-center" />
  </LightboxContent>
</Lightbox>`

const handleSample = `const lightbox = createLightboxHandle()

<Button onClick={() => lightbox.open(0)}>View all photos</Button>

<Lightbox handle={lightbox}>
  <LightboxGallery aria-label="Trip photos" items={photos} />
</Lightbox>`

export default function LightboxPage() {
  const item = getCatalogItem("lightbox")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          Put one <code>LightboxTrigger</code> per thumbnail inside{" "}
          <code>Lightbox</code>, and a <code>LightboxGallery</code> beside them
          with the full-size images. Each trigger opens the gallery at its{" "}
          <code>index</code>, and the thumbnail morphs into the full image.
          Attach <code>imageRef</code> to the thumbnail so its pixels stand in
          while the large file loads. Pass the real <code>width</code> and{" "}
          <code>height</code> of every image; the morph needs the shape before
          the file arrives.
        </DocsProse>
        <PlaygroundFigure code={usageSample}>
          <PlaygroundStage>
            <LightboxGalleryDemo />
          </PlaygroundStage>
        </PlaygroundFigure>
      </DocsSection>
      <DocsSection id="album" title="Album and overflow">
        <DocsProse>
          Show a few tiles and fold the rest behind a count. The count tile
          looks different from its photo, so give it{" "}
          <code>crossfade=&quot;both&quot;</code> to dissolve between them
          instead of a hard cut. <code>morphTo=&quot;closest&quot;</code> on{" "}
          <code>Lightbox</code> closes onto the nearest tile when the open
          photo has none of its own.
        </DocsProse>
        <PlaygroundFigure code={albumSample}>
          <PlaygroundStage>
            <LightboxAlbumDemo />
          </PlaygroundStage>
        </PlaygroundFigure>
      </DocsSection>

      <DocsSection id="single" title="Single image">
        <DocsProse>
          A gallery of one drops the arrows, counter, and thumbnails and keeps
          zoom and the caption. Use it for a screenshot or figure in an
          article.
        </DocsProse>
        <PlaygroundFigure>
          <PlaygroundStage>
            <LightboxSingleDemo />
          </PlaygroundStage>
        </PlaygroundFigure>
      </DocsSection>

      <DocsSection id="gestures" title="Gestures and keys">
        <DocsTable
          headers={["Action", "Touch", "Pointer and keyboard"]}
          rows={[
            ["Next or previous", "Swipe", "Arrow keys, the side buttons, or a thumbnail"],
            ["Zoom", "Pinch or double-tap", "Ctrl + scroll, + and −, or the toolbar"],
            ["Pan while zoomed", "Drag", "Drag or arrow keys"],
            ["Close", "Pull down", "Escape, the close button, or a trackpad swipe down"],
          ]}
        />
        <DocsProse>
          The toolbar and footer fade while a photo is pulled, and the footer
          hides while it is zoomed so the image can fill the screen. On a
          narrow viewport the arrows, zoom buttons, and thumbnails give way to
          swipe and pinch, and the counter shows the position instead.
        </DocsProse>
      </DocsSection>

      <DocsSection id="composition" title="Composition">
        <DocsProse>
          <code>LightboxGallery</code> covers a photo set.{" "}
          <code>LightboxContent</code> is one level down: the portal, the
          backdrop, the dialog, and the zoom and close toolbar, with your
          slides inside. Every ramka part is exported with Prometheus styles,
          so build a floor plan viewer, a video slide, or a side panel from
          the same pieces. Controls render through{" "}
          <Link href="/component/button">Button</Link> and sit on the page
          background, one surface step up.
        </DocsProse>
        <CodeBlock>{compositionSample}</CodeBlock>
        <DocsProse>
          Open the lightbox from anywhere with a handle. Without a trigger to
          morph from, it fades in.
        </DocsProse>
        <CodeBlock>{handleSample}</CodeBlock>
      </DocsSection>

      <DocsSection id="accessibility" title="Accessibility">
        <DocsProse>
          The viewer is a modal dialog that traps focus and closes on Escape.
          Give it a name with <code>aria-label</code>. Write real{" "}
          <code>alt</code> text for each image; the caption is extra, not a
          replacement. Thumbnails form a tab list tied to the slides, and the
          counter and caption announce changes politely. Reduced motion swaps
          the morph for a fade. The controls ship English labels; pass your
          own <code>aria-label</code> to translate them.
        </DocsProse>
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsProse>
          <code>Lightbox</code> accepts every ramka <code>Root</code> prop:{" "}
          <code>open</code>, <code>value</code>, <code>loop</code>,{" "}
          <code>morphTo</code>, <code>viewTransition</code>, and{" "}
          <code>handle</code> among them. <code>LightboxGallery</code> accepts
          every <code>Content</code> prop, plus:
        </DocsProse>
        <DocsTable
          headers={["Prop", "Values", "Default"]}
          rows={[
            [
              <code key="p">items</code>,
              "{ src, alt, width, height, thumb?, caption?, id? }[]",
              "—",
            ],
            [<code key="p">showThumbnails</code>, "boolean", <code key="d">true</code>],
            [<code key="p">preload</code>, "number", <code key="d">1</code>],
            [<code key="p">showZoomControls</code>, "boolean", <code key="d">true</code>],
            [<code key="p">showCloseButton</code>, "boolean", <code key="d">true</code>],
            [<code key="p">pullToClose</code>, "boolean", <code key="d">true</code>],
            [
              <code key="p">container</code>,
              "HTMLElement · ref · null",
              <code key="d">body</code>,
            ],
            [<code key="p">keepMounted</code>, "boolean", <code key="d">false</code>],
          ]}
        />
        <DocsProse>
          <code>LightboxTrigger</code> takes <code>index</code>,{" "}
          <code>crossfade</code>, and a render function with{" "}
          <code>imageRef</code> and <code>morphRef</code>.{" "}
          <code>createLightboxHandle</code> returns <code>open</code>,{" "}
          <code>close</code>, and <code>goTo</code>. The full part reference
          is in the{" "}
          <a href="https://ramka.dev/docs" rel="noreferrer" target="_blank">
            ramka docs
          </a>
          .
        </DocsProse>
      </DocsSection>
    </DocsArticle>
  )
}
