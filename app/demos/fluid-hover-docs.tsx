"use client"

import {
  ArchiveBoxIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/16/solid"

import { List, ListItem } from "@/components/ui/list"
import { FluidHoverHighlight, useFluidHover } from "@/lib/fluid-hover"

const actions = [
  { label: "Edit", icon: PencilSquareIcon },
  { label: "Duplicate", icon: DocumentDuplicateIcon },
  { label: "Share", icon: ShareIcon },
  { label: "Archive", icon: ArchiveBoxIcon },
  { label: "Delete", icon: TrashIcon },
]

export function FluidHoverDemo() {
  const hover = useFluidHover<HTMLDivElement>({ nearest: true })

  return (
    <div className="flex justify-center rounded-xl border border-border bg-card px-6 py-10">
      <div
        className="relative isolate flex w-56 flex-col gap-1 p-1"
        ref={hover.ref}
        {...hover.handlers}
      >
        <FluidHoverHighlight hover={hover} />
        {actions.map(({ label, icon: Icon }) => (
          <button
            className="flex h-8 items-center gap-2 rounded-md px-2 text-left text-sm font-medium text-muted-foreground outline-none data-fluid-hover-active:text-foreground [&_svg]:size-4"
            data-fluid-hover-item=""
            key={label}
            type="button"
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

const roles = [
  { title: "Compute Partnerships Manager", team: "Engineering" },
  { title: "Customer Support Engineer", team: "Engineering" },
  { title: "HPC/GPU Cluster Architect", team: "Engineering" },
  { title: "Principal/Staff HPC Network Engineer", team: "Engineering" },
  { title: "Staff Design Engineer", team: "Engineering" },
  { title: "Commercial Counsel", team: "Legal" },
]

export function ListDemo() {
  return (
    <List label="Open roles">
      {roles.map((role) => (
        <ListItem
          href="#"
          key={role.title}
          meta={role.team}
          onClick={(event) => event.preventDefault()}
        >
          {role.title}
        </ListItem>
      ))}
    </List>
  )
}
