import type { BoxRenderable } from "@opentui/core";

export interface ShortcutType {
  label: string;
  path: string;
  icon: string;
}

export interface ShortcutEntryType {
  shortcut: ShortcutType;
  box: BoxRenderable;
}

export interface EntryType {
  name: string;
  isDir: boolean;
}

export interface ReadEntriesResultType {
  entries: EntryType[];
  error?: string;
}

export interface LastClickType {
  path: string;
  time: number;
}

export interface ContextMenuItemType {
  label: string;
  onSelect: () => void;
}
