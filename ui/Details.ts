import config from "../config.toml";
import { basename } from "node:path";
import { statSync, type Stats } from "node:fs";
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

    this.id = "details";
    this.width = "50%";
    this.height = "100%";
    this.backgroundColor = config.theme.content;
    this.flexDirection = "column";
    this.visible = false;

    this.refresh(Store.selectedTile);

    Store.onSelectedTileChange((tile: BoxRenderable | null) => {
      this.refresh(tile);
    });
  }

  private refresh(tile: BoxRenderable | null): void {
    this.getChildren().forEach((child) => {
      this.remove(child);
    });

    const path: string = tile?.id || "";

    const header = new BoxRenderable(this.ctx, {
      height: 3,
      backgroundColor: config.theme.header,
      paddingX: 2,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    });

    const name = new TextRenderable(this.ctx, {
      content: `Details ${basename(path) || path}`,
      height: 1,
      fg: config.theme.foreground,
      selectable: false,
    });

    const close = new TextRenderable(this.ctx, {
      content: "❌",
      height: 1,
      fg: config.theme.foreground,
      selectable: false,
      onMouseOver: (): void => {
        close.bg = config.theme.selected_background;
      },
      onMouseOut: (): void => {
        close.bg = undefined;
      },
      onMouseDown: (): void => {
        Store.hideDetails(this.ctx);
      },
    });

    header.add(name);
    header.add(close);

    this.add(header);

    const content = new BoxRenderable(this.ctx, {
      width: "100%",
      padding: 1,
    });

    this.rows(tile).forEach((row) => {
      content.add(
        new TextRenderable(this.ctx, {
          content: row,
          fg: config.theme.foreground,
          selectable: false,
        }),
      );
    });

    this.add(content);
  }

  private rows(tile: BoxRenderable | null): string[] {
    const path: string = tile?.id || "";

    try {
      const stats: Stats = statSync(path);

      return [
        `Name        | ${basename(path) || path}`,
        `Location    | ${path}`,
        `Kind        | ${stats.isDirectory() ? "Directory" : "File"}`,
        `Size        | ${stats.size}`,
        `Created     | ${stats.birthtime.toLocaleString()}`,
        `Modified    | ${stats.mtime.toLocaleString()}`,
        `Accessed    | ${stats.atime.toLocaleString()}`,
        `Owner       | ${stats.uid}:${stats.gid}`,
        `Permissions | ${(stats.mode & 0o777).toString(8)}`,
      ];
    } catch (error) {
      return [`Error: ${(error as Error).message}`];
    }
  }
}
