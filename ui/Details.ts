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
    // this.minWidth = 41;
    this.width = 35;
    this.height = "100%";
    // this.border = true;
    ((this.border = ["left"]),
      // this.borderStyle = config.border_style;
      // this.borderColor = config.theme.border;
      (this.borderColor = config.theme.border));
    // this.title = "Details";
    // this.titleColor = config.theme.foreground;
    this.backgroundColor = config.theme.content;
    this.flexDirection = "column";
    // this.paddingX = 1;
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
      justifyContent: "center",
      alignItems: "center",
    });

    const name = new TextRenderable(this.ctx, {
      content: basename(path) || path,
      height: 1,
      fg: config.theme.foreground,
      selectable: false,
    });

    header.add(name);
    this.add(header);

    const content = new BoxRenderable(this.ctx, {
      width: "100%",
      padding: 1,
    });

    this.rows(tile).forEach((row) => {
      // this.add(
      //   new TextRenderable(this.ctx, {
      //     content: row,
      //     fg: config.theme.foreground,
      //     selectable: false,
      //   }),
      // );
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
        // `Name: ${basename(path) || path}`,
        `Created: ${stats.birthtime.toLocaleString()}`,
        `Modified: ${stats.mtime.toLocaleString()}`,
        `Owner: ${stats.uid}:${stats.gid}`,
        `Permissions: ${(stats.mode & 0o777).toString(8)}`,
      ];
    } catch (error) {
      // Store.hideDetails(this.ctx);

      return [`Error: ${(error as Error).message}`];
    }
  }
}
