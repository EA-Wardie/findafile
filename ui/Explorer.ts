import { dirname, join } from "node:path";
import {
  ScrollBoxRenderable,
  type BoxOptions,
  type MouseEvent,
  type RenderContext,
} from "@opentui/core";
import type {
  ArrowDirectionType,
  ContextMenuItemType,
  EntryType,
  ReadEntriesResultType,
  TileEntryType,
} from "../types";
import { Store } from "../lib/Store";
import { readdirSync, type Dirent } from "node:fs";
import { Navigator } from "../lib/Navigator";
import { Create } from "../lib/Create";
import { Tile } from "./Tile";
import { ContextMenu } from "./ContextMenu";
import { PromptDialog } from "./PromptDialog";

export class Explorer extends ScrollBoxRenderable {
  private tiles: TileEntryType[] = [];

  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.width = "100%";
    this.height = "100%";
    this.paddingX = 1;
    this.contentOptions = {
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: 1,
    };

    this.onMouseDown = (event: MouseEvent): void => {
      if (event.button === 2) {
        this.showContextMenu(event);
      }
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
      this.tiles[0]!.tile.select();

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
      target.tile.select();
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
    let backTile: Tile | undefined;

    if (parent !== Store.currentPath) {
      backTile = this.makeTile("Back", "↩️", true, parent);

      this.tiles.push({ tile: backTile, fullPath: parent, isDir: true });
      this.add(backTile);
    }

    if (!entries.length) {
      this.add(
        new Tile(this.ctx, { label: "(empty)", icon: "❔", isDir: false }),
      );
    }

    entries.forEach((entry) => {
      const fullPath: string = join(Store.currentPath, entry.name);
      const icon = entry.isDir ? "🗂️" : "📄";

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

  private showContextMenu(event: MouseEvent): void {
    new ContextMenu(this.ctx, { items: this.makeCreateMenuItems() }).show(
      event.x,
      event.y,
    );
  }

  private makeCreateMenuItems(): ContextMenuItemType[] {
    return [
      {
        label: "📄 New File",
        onSelect: (): void => {
          this.promptCreate("New File", (name: string) => {
            Create.file(join(Store.currentPath, name));
          });
        },
      },
      {
        label: "📁 New Folder",
        onSelect: (): void => {
          this.promptCreate("New Folder", (name: string) => {
            Create.folder(join(Store.currentPath, name));
          });
        },
      },
      { separator: true },
      {
        label: "❔ Details",
        onSelect: (): void => {
          Store.hidePreview(this.ctx);
          Store.showDetails(this.ctx);
        },
      },
    ];
  }

  private promptCreate(title: string, create: (name: string) => void): void {
    const dialog = new PromptDialog(this.ctx);

    Store.setCurrentPromptDialog(dialog);

    dialog.show({
      title,
      label: "Name",
      confirmLabel: "Create",
      onConfirm: (name: string): void => {
        create(name);

        this.refresh();
      },
    });
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
        tile.select();
      },
      onOpen: (): void => {
        Navigator.go(fullPath);
      },
      onDeleted: (): void => {
        this.refresh();
      },
      onCreated: (): void => {
        this.refresh();
      },
    });

    return tile;
  }
}
