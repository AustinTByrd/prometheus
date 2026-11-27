"use client"

import { ExclamationCircleIcon, InboxIcon } from "@heroicons/react/24/outline"

import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { ErrorState } from "@/components/ui/error"
import { Elevated } from "@/lib/elevated"

export function EmptyDemo() {
  return (
    <Elevated offset={2} shadowLevel={2}>
      <Empty
        actions={
          <Button size="sm">
            New order
          </Button>
        }
        description="Orders you create will show up here."
        icon={<InboxIcon />}
        title="No orders yet"
      />
    </Elevated>
  )
}

export function ErrorDemo() {
  return (
    <Elevated offset={2} shadowLevel={2}>
      <ErrorState
        actions={
          <Button size="sm">
            Try again
          </Button>
        }
        description="The orders could not be loaded. Your place in the list is unchanged."
        icon={<ExclamationCircleIcon />}
        title="Orders didn't load"
      />
    </Elevated>
  )
}
