import config from "../config.toml";
import {
  BoxRenderable,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import { Formatter } from "../lib/Formatter";

export interface Options extends BoxOptions {
  label: string;
  isDir: boolean;
}

export class Tile extends BoxRenderable {
  constructor(
    ctx: RenderContext,
    options: Options = { label: "", isDir: false },
  ) {
    super(ctx, options);

    this.width = config.explorer.tile_width;
    this.height = config.explorer.tile_height;
    this.border = true;
    this.borderStyle = config.border_style;
    this.borderColor = config.theme.border;
    this.flexDirection = "column";
    this.alignItems = "center";
    this.justifyContent = "center";
    this.gap = 1;

    this.add(
      new TextRenderable(ctx, {
        content: options.isDir ? "📁" : "📄",
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

// export class Tile {
//   public static make(
//     renderer: CliRenderer,
//     label: string,
//     isDir: boolean,
//   ): BoxRenderable {
//     const tile = new BoxRenderable(renderer, {
//       width: config.explorer.tile_width,
//       height: config.explorer.tile_height,
//       border: true,
//       borderStyle: config.border_style,
//       borderColor: config.theme.border,
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: 1,
//     });

//     tile.add(
//       new TextRenderable(renderer, {
//         content: isDir ? "📁" : "📄",
//         fg: config.theme.foreground,
//         selectable: false,
//       }),
//     );

//     tile.add(
//       new TextRenderable(renderer, {
//         content: Formatter.truncate(label, config.explorer.tile_width - 2),
//         fg: config.theme.foreground,
//         selectable: false,
//       }),
//     );

//     return tile;
//   }
// }
