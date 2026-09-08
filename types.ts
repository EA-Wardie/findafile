import type { BoxRenderable } from "@opentui/core";
import type { Tile } from "./ui/Tile";

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
  label?: string;
  separator?: boolean;
  onSelect?: () => void;
}

export interface ConfirmDialogOptionsType {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface PromptDialogOptionsType {
  title: string;
  label?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
  onCancel?: () => void;
}

export type ArrowDirectionType = "up" | "down" | "left" | "right";

export interface TileEntryType {
  tile: Tile;
  fullPath: string;
  isDir: boolean;
}
