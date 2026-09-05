import config from "../config.toml";
import { dirname, join } from "node:path";
import {
  CliRenderer,
  MouseEvent,
  ScrollBoxRenderable,
  TextRenderable,
} from "@opentui/core";
import type { ContextMenuItemType, EntryType, ReadEntriesResultType } from "../types";
import { Store } from "../lib/Store";
import { readdirSync, type Dirent } from "node:fs";
import { UpTile } from "./UpTile";
import { Navigator } from "../lib/Navigator";
import { DownTile } from "./DownTile";
import { ContextMenu } from "./ContextMenu";
import { Formatter } from "../lib/Formatter";

export class Explorer {
  private static _renderer: CliRenderer;
  private static _explorer: ScrollBoxRenderable;

  public static make(renderer: CliRenderer): ScrollBoxRenderable {
    this._renderer = renderer;

    this._explorer = new ScrollBoxRenderable(renderer, {
      width: "100%",
      height: "100%",
      contentOptions: {
        flexDirection: "row",
        flexWrap: "wrap",
      },
    });

    return this._explorer;
  }

  public static render(): void {
    this._explorer.getChildren().forEach((child) => {
      this._explorer.remove(child);
    });

    const { entries, error }: ReadEntriesResultType = this.readEntries(
      Store.currentPath,
    );

    if (error !== undefined) {
      this._explorer.add(
        new TextRenderable(this._renderer, {
          content: `Error: ${error}`,
          fg: config.colors.error,
        }),
      );

      return;
    }

    const parent: string = dirname(Store.currentPath);

    if (parent !== Store.currentPath) {
      this._explorer.add(this.makeUpTile(parent));
    }

    if (entries.length === 0) {
      this._explorer.add(
        new TextRenderable(this._renderer, {
          content: "(empty)",
          fg: config.colors.border_muted,
        }),
      );
    }

    entries.forEach((entry) => {
      const fullPath: string = join(Store.currentPath, entry.name);

      this._explorer.add(this.makeTile(entry.name, entry.isDir, fullPath));
    });
  }

  private static readEntries(path: string): ReadEntriesResultType {
    try {
      const dirents: Dirent[] = readdirSync(path, { withFileTypes: true });

      const entries: EntryType[] = dirents
        .map((dirent: Dirent): EntryType => ({
          name: dirent.name,
          isDir: dirent.isDirectory(),
        }))
        .sort((a: EntryType, b: EntryType): number => {
          if (a.isDir !== b.isDir) {
            return a.isDir ? -1 : 1;
          }

          return a.name.localeCompare(b.name);
        });

      return { entries };
    } catch (err) {
      return { entries: [], error: (err as Error).message };
    }
  }

  private static makeUpTile(parent: string) {
    const tile = UpTile.make(this._renderer);

    tile.add(
      new TextRenderable(this._renderer, {
        content: "📁",
        fg: config.colors.border_muted,
      }),
    );

    tile.add(
      new TextRenderable(this._renderer, {
        content: "..",
        fg: config.colors.border_muted,
      }),
    );

    tile.onMouseDown = (): void => {
      Navigator.go(parent);
    };

    return tile;
  }

  private static makeTile(label: string, isDir: boolean, fullPath: string) {
    const tile = DownTile.make(this._renderer);

    tile.borderColor = config.colors.selected;
    tile.border = false;

    tile.add(
      new TextRenderable(this._renderer, {
        content: isDir ? "📁" : "📄",
        fg: isDir ? config.colors.accent : config.colors.foreground,
      }),
    );

    tile.add(
      new TextRenderable(this._renderer, {
        content: Formatter.truncate(label, config.explorer.tile_width - 4),
        fg: isDir ? config.colors.accent : config.colors.foreground,
      }),
    );

    tile.onMouseDown = (event: MouseEvent): void => {
      if (event.button === 2) {
        const items: ContextMenuItemType[] = [];

        if (isDir) {
          items.push({
            label: "Open",
            onSelect: (): void => {
              Navigator.go(fullPath);
            },
          });
        }

        items.push({
          label: "Copy",
          onSelect: (): void => {
            this._renderer.copyToClipboardOSC52(fullPath);
          },
        });

        items.push({
          label: "Delete",
          onSelect: (): void => {},
        });

        ContextMenu.show(items, event.x, event.y);

        if (Store.selectedTile !== null && Store.selectedTile !== tile) {
          Store.selectedTile.border = false;
        }

        tile.border = true;

        Store.setSelectedTile(tile);

        return;
      }

      const now: number = Date.now();

      const isDoubleClick: boolean =
        isDir &&
        Store.lastClick !== null &&
        Store.lastClick.path === fullPath &&
        now - Store.lastClick.time < config.explorer.double_click_delay;

      if (isDoubleClick) {
        Navigator.go(fullPath);

        return;
      }

      if (Store.selectedTile !== null && Store.selectedTile !== tile) {
        Store.selectedTile.border = false;
      }

      tile.border = true;

      Store.setSelectedTile(tile);
      Store.setLastClick({ path: fullPath, time: now });
    };

    return tile;
  }
}
