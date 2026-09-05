import type { BoxRenderable } from "@opentui/core";
import type { LastClickType, ShortcutType } from "../types";
import { homedir } from "node:os";

export class Store {
  public static selectedTile: BoxRenderable | null = null;
  public static selectedShortcut: ShortcutType | null = null;
  public static lastClick: LastClickType | null = null;
  public static currentPath: string = homedir();
  public static error: string = "";

  private static selectedTileListeners: ((
    tile: BoxRenderable | null,
  ) => void)[] = [];

  private static currentPathListeners: ((path: string) => void)[] = [];

  private static currentErrorListeners: ((error: string) => void)[] = [];

  public static setSelectedTile(tile: BoxRenderable | null) {
    this.selectedTile = tile;

    this.selectedTileListeners.forEach((listener) => listener(tile));
  }

  public static setSelectedShortcut(shortcut: ShortcutType | null) {
    this.selectedShortcut = shortcut;
  }

  public static setLastClick(lastClick: LastClickType | null) {
    this.lastClick = lastClick;
  }

  public static setCurrentPath(path: string) {
    this.currentPath = path;

    this.currentPathListeners.forEach((listener) => listener(path));
  }

  public static setError(error: string) {
    this.error = error;

    this.currentErrorListeners.forEach((listener) => listener(error));
  }

  public static onSelectedTileChange(
    listener: (tile: BoxRenderable | null) => void,
  ): void {
    this.selectedTileListeners.push(listener);
  }

  public static onCurrentPathChange(listener: (path: string) => void): void {
    this.currentPathListeners.push(listener);
  }

  public static onErrorChange(listener: (error: string) => void): void {
    this.currentErrorListeners.push(listener);
  }
}
