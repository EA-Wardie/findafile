import config from "../config.toml";
import { basename } from "node:path";
import { readdirSync, statSync, type Stats } from "node:fs";
import {
  BoxRenderable,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import { Store } from "../lib/Store";

export class Details extends BoxRenderable {
  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.minWidth = 41;
    this.height = "100%";
    this.border = true;
    this.borderStyle = config.border_style;
    this.borderColor = config.theme.border;
    this.title = "Details";
    this.titleColor = config.theme.foreground;
    this.flexDirection = "column";
    this.paddingX = 1;

    this.refresh(Store.selectedTile);

    Store.onSelectedTileChange((tile: BoxRenderable | null) => {
      this.refresh(tile);
    });
  }

  private refresh(tile: BoxRenderable | null): void {
    this.getChildren().forEach((child) => {
      this.remove(child);
    });

    this.rows(tile).forEach((row) => {
      this.add(
        new TextRenderable(this.ctx, {
          content: row,
          fg: config.theme.foreground,
          selectable: false,
        }),
      );
    });
  }

  private rows(tile: BoxRenderable | null): string[] {
    const path: string = tile?.id || '';

    try {
      const stats: Stats = statSync(path);
      const items: number = readdirSync(path).length;

      return [
        `Name: ${basename(path) || path}`,
        `Items: ${items}`,
        `Permissions: ${(stats.mode & 0o777).toString(8)}`,
        `Owner: ${stats.uid}:${stats.gid}`,
        `Modified: ${stats.mtime.toLocaleString()}`,
        `Created: ${stats.birthtime.toLocaleString()}`,
      ];
    } catch (error) {
      return [`Error: ${(error as Error).message}`];
    }
  }
}
