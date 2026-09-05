import config from "../config.toml";
import { dirname, join } from "node:path";
import {
  CliRenderer,
  MouseEvent,
  ScrollBoxRenderable,
  TextRenderable,
} from "@opentui/core";
import type {
  ArrowDirectionType,
  ContextMenuItemType,
  EntryType,
  ReadEntriesResultType,
  TileEntryType,
} from "../types";
import { Store } from "../lib/Store";
import { Input } from "../lib/Input";
import { readdirSync, type Dirent } from "node:fs";
import { Navigator } from "../lib/Navigator";
import { Tile } from "./Tile";

export class Explorer {
  private static _renderer: CliRenderer;
  private static _explorer: ScrollBoxRenderable;
  private static _tiles: TileEntryType[] = [];

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

  public static move(direction: ArrowDirectionType): void {
    if (this._tiles.length === 0) {
      return;
    }

    const currentIndex: number = this._tiles.findIndex(
      (entry) => entry.tile === Store.selectedTile,
    );

    if (currentIndex === -1) {
      this.selectTile(this._tiles[0]!);

      return;
    }

    const current: TileEntryType = this._tiles[currentIndex]!;

    let target: TileEntryType | null = null;

    if (direction === "left") {
      target = currentIndex > 0 ? this._tiles[currentIndex - 1]! : null;
    } else if (direction === "right") {
      target =
        currentIndex < this._tiles.length - 1
          ? this._tiles[currentIndex + 1]!
          : null;
    } else {
      target = this.findVerticalNeighbor(current, direction);
    }

    if (target !== null) {
      this.selectTile(target);
    }
  }

  public static openSelected(): void {
    const selected: TileEntryType | undefined = this._tiles.find(
      (entry) => entry.tile === Store.selectedTile,
    );

    if (selected !== undefined && selected.isDir) {
      Navigator.go(selected.fullPath);
    }
  }

  public static navigateUp(): void {
    const parent: string = dirname(Store.currentPath);

    if (parent !== Store.currentPath) {
      Navigator.go(parent);
    }
  }

  private static findVerticalNeighbor(
    current: TileEntryType,
    direction: "up" | "down",
  ): TileEntryType | null {
    const candidates: TileEntryType[] = this._tiles.filter((entry) =>
      direction === "up"
        ? entry.tile.y < current.tile.y
        : entry.tile.y > current.tile.y,
    );

    if (candidates.length === 0) {
      return null;
    }

    const targetY: number =
      direction === "up"
        ? Math.max(...candidates.map((entry) => entry.tile.y))
        : Math.min(...candidates.map((entry) => entry.tile.y));

    const row: TileEntryType[] = candidates.filter(
      (entry) => entry.tile.y === targetY,
    );

    return row.reduce((closest, entry) =>
      Math.abs(entry.tile.x - current.tile.x) <
      Math.abs(closest.tile.x - current.tile.x)
        ? entry
        : closest,
    );
  }

  private static selectTile(entry: TileEntryType): void {
    if (Store.selectedTile !== null && Store.selectedTile !== entry.tile) {
      Store.selectedTile.backgroundColor = undefined;
    }

    entry.tile.backgroundColor = config.theme.selected_background;

    Store.setSelectedTile(entry.tile);
  }

  public static render(): void {
    this._tiles = [];

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
          fg: "#D10000",
          selectable: false,
        }),
      );
    }

    const parent: string = dirname(Store.currentPath);

    if (parent !== Store.currentPath) {
      const upTile = this.makeTile("Back", true, parent);

      this._tiles.push({ tile: upTile, fullPath: parent, isDir: true });
      this._explorer.add(upTile);
    }

    if (entries.length === 0) {
      this._explorer.add(
        new TextRenderable(this._renderer, {
          content: "(empty)",
          fg: config.theme.border_muted,
          selectable: false,
        }),
      );
    }

    entries.forEach((entry) => {
      const fullPath: string = join(Store.currentPath, entry.name);

      const tile = this.makeTile(entry.name, entry.isDir, fullPath);

      this._tiles.push({ tile, fullPath, isDir: entry.isDir });
      this._explorer.add(tile);
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

  private static makeTile(label: string, isDir: boolean, fullPath: string) {
    // const tile = Tile.make(this._renderer, label, isDir);
    const tile = new Tile(this._renderer, {
      label,
      isDir,
    });

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

        // ContextMenu.show(items, event.x, event.y);

        this.selectTile({ tile, fullPath, isDir });

        return;
      }

      if (isDir && Input.isDoubleClick(fullPath)) {
        Navigator.go(fullPath);

        return;
      }

      this.selectTile({ tile, fullPath, isDir });
      Store.setLastClick({ path: fullPath, time: Date.now() });
    };

    return tile;
  }
}
