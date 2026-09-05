import type { BoxRenderable } from "@opentui/core";
import type { LastClickType, ShortcutType } from "../types";
import { homedir } from "node:os";

export class Store {
  public static selectedTile: BoxRenderable | null = null;
  public static selectedShortcut: ShortcutType | null = null;
  public static lastClick: LastClickType | null = null;
  public static currentPath: string = homedir();

  public static setSelectedTile(tile: BoxRenderable | null) {
    this.selectedTile = tile;
  }

  public static setSelectedShortcut(shortcut: ShortcutType | null) {
    this.selectedShortcut = shortcut;
  }

  public static setLastClick(lastClick: LastClickType | null) {
    this.lastClick = lastClick;
  }

  public static setCurrentPath(path: string) {
    this.currentPath = path;
  }
}
