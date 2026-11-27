"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@/components/ui/menu"
import {
  DocsExample,
} from "@/components/site/docs-article"

export function MenuDemo() {
  const [bookmarks, setBookmarks] = React.useState(true)
  const [urls, setUrls] = React.useState(false)
  const [person, setPerson] = React.useState("pedro")

  return (
    <DocsExample>
      <Menu>
        <MenuTrigger
          render={<Button variant="outlined">Open menu</Button>}
        />
        <MenuContent className="w-56" align="start">
          <MenuGroup>
            <MenuLabel>My Account</MenuLabel>
            <MenuItem>
              Profile
              <MenuShortcut>⇧⌘P</MenuShortcut>
            </MenuItem>
            <MenuItem>
              Billing
              <MenuShortcut>⌘B</MenuShortcut>
            </MenuItem>
            <MenuItem>
              Settings
              <MenuShortcut>⌘S</MenuShortcut>
            </MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuLabel>Appearance</MenuLabel>
            <MenuCheckboxItem
              checked={bookmarks}
              onCheckedChange={setBookmarks}
            >
              Show Bookmarks
            </MenuCheckboxItem>
            <MenuCheckboxItem checked={urls} onCheckedChange={setUrls}>
              Show Full URLs
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuRadioGroup value={person} onValueChange={setPerson}>
            <MenuLabel>People</MenuLabel>
            <MenuRadioItem value="pedro">Pedro Duarte</MenuRadioItem>
            <MenuRadioItem value="colm">Colm Tuite</MenuRadioItem>
          </MenuRadioGroup>
          <MenuSeparator />
          <MenuSub>
            <MenuSubTrigger>Invite users</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>Email</MenuItem>
              <MenuItem>Message</MenuItem>
              <MenuSeparator />
              <MenuItem>More…</MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuSeparator />
          <MenuItem variant="destructive">Log out</MenuItem>
        </MenuContent>
      </Menu>
    </DocsExample>
  )
}
