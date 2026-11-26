"use client"

import { Button } from "@/components/button"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
} from "@/components/responsive-dialog"

export function HomeDialogDemo() {
  return (
    <ResponsiveDialog
      description="One component. A dialog on desktop, a swipeable drawer on mobile."
      footer={
        <>
          <ResponsiveDialogClose
            render={<Button variant="outline" />}
          >
            Close
          </ResponsiveDialogClose>
          <ResponsiveDialogClose
            render={<Button href="#components" />}
          >
            Browse components
          </ResponsiveDialogClose>
        </>
      }
      title="Your next project."
      trigger={<Button>Try the dialog</Button>}
    >
      <p className="text-sm text-muted-foreground">
        Keyboard friendly. Mobile ready. Install the source into the app and
        keep a small prop API.
      </p>
    </ResponsiveDialog>
  )
}
