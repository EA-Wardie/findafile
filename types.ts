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

export interface ThemeType {
  background: string;
  foreground: string;
  header: string;
  sidebar: string;
  content: string;
  footer: string;
  selected_background: string;
  border: string;
  border_selected: string;
  border_muted: string;
  highlight: string;
}

export interface ExplorerConfigType {
  tile_width: number;
  tile_height: number;
}

export type BorderStyleType = "single" | "double" | "rounded" | "heavy";

export interface ConfigType {
  border_style: BorderStyleType;
  double_click_delay: number;
  explorer: ExplorerConfigType;
  theme: ThemeType;
  places: ShortcutType[];
  bookmarks: ShortcutType[];
  drives: ShortcutType[];
}

export interface TileEntryType {
  tile: Tile;
  fullPath: string;
  isDir: boolean;
}
