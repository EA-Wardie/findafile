import type { BoxRenderable, CliRenderer, RenderContext } from "@opentui/core";
import type { LastClickType, ShortcutType } from "../types";
import { homedir } from "node:os";
import { ConfirmDialog } from "../ui/ConfirmDialog";

export class Store {
  public static selectedTile: BoxRenderable | null = null;
  public static selectedShortcut: ShortcutType | null = null;
  public static lastClick: LastClickType | null = null;
  public static currentPath: string = homedir();
  public static error: string = "";
  public static detailsIsActive: boolean = false;
  public static previewIsActive: boolean = false;
  public static currentConfirmDialog: ConfirmDialog | null = null;

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

  public static setCurrentConfirmDialog(dialog: ConfirmDialog) {
    this.currentConfirmDialog = dialog;
  }

  public static clearCurrentConfirmDialog() {
    this.currentConfirmDialog = null;
  }

  public static showDetails(ctx: RenderContext) {
    this.detailsIsActive = true;

    const main = (ctx as CliRenderer).root.getRenderable("main");
    const detailSidebar = main?.getRenderable("details");

    if (detailSidebar) {
      detailSidebar.visible = true;
    }
  }

  public static hideDetails(ctx: RenderContext) {
    this.detailsIsActive = true;

    const main = (ctx as CliRenderer).root.getRenderable("main");
    const detailSidebar = main?.getRenderable("details");

    if (detailSidebar) {
      detailSidebar.visible = false;
    }
  }

  public static showPreview(ctx: RenderContext) {
    this.hideDetails(ctx);

    this.previewIsActive = true;

    const main = (ctx as CliRenderer).root.getRenderable("main");
    const previewSidebar = main?.getRenderable("preview");

    if (previewSidebar) {
      previewSidebar.visible = true;
    }
  }

  public static hidePreview(ctx: RenderContext) {
    this.previewIsActive = false;

    const main = (ctx as CliRenderer).root.getRenderable("main");
    const previewSidebar = main?.getRenderable("preview");

    if (previewSidebar) {
      previewSidebar.visible = false;
    }
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
