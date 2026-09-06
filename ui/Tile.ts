import config from "../config.toml";
import {
  BoxRenderable,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import { Formatter } from "../lib/Formatter";
import { Store } from "../lib/Store";

export interface Options extends BoxOptions {
  label: string;
  icon: string;
  isDir: boolean;
  fullPath?: string;
}

export class Tile extends BoxRenderable {
  constructor(
    ctx: RenderContext,
    options: Options = {
      label: "",
      icon: "📁",
      isDir: false,
    },
  ) {
    super(ctx, options);

    if (options.fullPath) {
      this.id = options.fullPath;
    }

    this.width = config.explorer.tile_width;
    this.height = config.explorer.tile_height;
    this.border = true;
    this.borderStyle = config.border_style;
    this.borderColor = config.theme.border;
    this.flexDirection = "column";
    this.alignItems = "center";
    this.justifyContent = "center";
    this.gap = 1;

    this.onMouseOver = (): void => {
      this.borderColor = config.theme.border_selected;
    };

    this.onMouseOut = (): void => {
      if (Store.selectedTile !== this) {
        this.borderColor = config.theme.border;
      }
    };

    this.add(
      new TextRenderable(ctx, {
        content: options.icon,
        fg: config.theme.foreground,
        selectable: false,
      }),
    );

    this.add(
      new TextRenderable(ctx, {
        content: Formatter.truncate(
          options.label,
          config.explorer.tile_width - 2,
        ),
        fg: config.theme.foreground,
        selectable: false,
      }),
    );
  }
}
