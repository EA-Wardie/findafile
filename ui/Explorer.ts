import { dirname, join } from "node:path";
import { ScrollBoxRenderable, type BoxOptions, type RenderContext } from "@opentui/core";
import type {
  ArrowDirectionType,
  EntryType,
  ReadEntriesResultType,
  TileEntryType,
} from "../types";
import { Store } from "../lib/Store";
import { readdirSync, type Dirent } from "node:fs";
import { Navigator } from "../lib/Navigator";
import { Tile } from "./Tile";

export class Explorer extends ScrollBoxRenderable {
  private tiles: TileEntryType[] = [];

  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.width = "100%";
    this.height = "100%";
    // this.paddingX = 1;
    this.contentOptions = {
      flexDirection: "row",
      flexWrap: "wrap",
      // columnGap: 1,
    };

    this.refresh();

    Store.onCurrentPathChange(() => {
      this.refresh();
    });
  }

  public move(direction: ArrowDirectionType): void {
    if (this.tiles.length === 0) {
      return;
    }

    const currentIndex: number = this.tiles.findIndex(
      (entry) => entry.tile === Store.selectedTile,
    );

    if (currentIndex === -1) {
      this.selectTile(this.tiles[0]!);

      return;
    }

    const current: TileEntryType = this.tiles[currentIndex]!;

    let target: TileEntryType | null = null;

    if (direction === "left") {
      target = currentIndex > 0 ? this.tiles[currentIndex - 1]! : null;
    } else if (direction === "right") {
      target =
        currentIndex < this.tiles.length - 1
          ? this.tiles[currentIndex + 1]!
          : null;
    } else {
      target = this.findVerticalNeighbor(current, direction);
    }

    if (target !== null) {
      this.selectTile(target);
    }
  }

  public openSelected(): void {
    const selected: TileEntryType | undefined = this.tiles.find(
      (entry) => entry.tile === Store.selectedTile,
    );

    if (selected !== undefined && selected.isDir) {
      Navigator.go(selected.fullPath);
    }
  }

  public navigateUp(): void {
    const parent: string = dirname(Store.currentPath);

    if (parent !== Store.currentPath) {
      Navigator.go(parent);
    }
  }

  private findVerticalNeighbor(
    current: TileEntryType,
    direction: "up" | "down",
  ): TileEntryType | null {
    const candidates: TileEntryType[] = this.tiles.filter((entry) =>
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

  private selectTile(entry: TileEntryType): void {
    if (Store.selectedTile !== null && Store.selectedTile !== entry.tile) {
      (Store.selectedTile as Tile).setSelected(false);
    }

    entry.tile.setSelected(true);

    Store.setSelectedTile(entry.tile);
  }

  public refresh(): void {
    this.tiles = [];

    this.getChildren().forEach((child) => {
      this.remove(child);
    });

    const { entries, error }: ReadEntriesResultType = this.readEntries(
      Store.currentPath,
    );

    if (error !== undefined) {
      Store.setError(`Error: ${error}`);
    }

    const parent: string = dirname(Store.currentPath);

    if (parent !== Store.currentPath) {
      const upTile = this.makeTile("Back", "↩️", true, parent);

      this.tiles.push({ tile: upTile, fullPath: parent, isDir: true });
      this.add(upTile);
    }

    if (!entries.length) {
      this.add(
        new Tile(this.ctx, { label: "(empty)", icon: "❔", isDir: false }),
      );
    }

    entries.forEach((entry) => {
      const fullPath: string = join(Store.currentPath, entry.name);
      const icon = entry.isDir ? "📁" : "📄";

      const tile = this.makeTile(entry.name, icon, entry.isDir, fullPath);

      this.tiles.push({ tile, fullPath, isDir: entry.isDir });
      this.add(tile);
    });
  }

  private readEntries(path: string): ReadEntriesResultType {
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

  private makeTile(
    label: string,
    icon: string,
    isDir: boolean,
    fullPath: string,
  ): Tile {
    const tile = new Tile(this.ctx, {
      label,
      icon,
      isDir,
      fullPath,
      onSelect: (): void => {
        this.selectTile({ tile, fullPath, isDir });
      },
      onOpen: (): void => {
        Navigator.go(fullPath);
      },
      onDeleted: (): void => {
        this.refresh();
      },
    });

    return tile;
  }
}
