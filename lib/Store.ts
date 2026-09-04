import type { BoxRenderable } from "@opentui/core";
import type { LastClick } from "../types";
import { homedir } from "node:os";

export class Store {
  public static selectedTile: BoxRenderable | null = null;
  public static lastClick: LastClick | null = null;
  public static currentPath: string = homedir();

  public static setSelectedTile(selectedTile: BoxRenderable | null) {
    this.selectedTile = selectedTile;
  }

  public static setLastClick(lastClick: LastClick | null) {
    this.lastClick = lastClick;
  }

  public static setCurrentPath(currentPath: string) {
    this.currentPath = currentPath;
  }
}
