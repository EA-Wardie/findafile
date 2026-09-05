import { BoxRenderable, CliRenderer, TextRenderable } from "@opentui/core";
import config from "../config.toml";
import { Formatter } from "../lib/Formatter";

export class Tile {
  public static make(
    renderer: CliRenderer,
    label: string,
    isDir: boolean,
  ): BoxRenderable {
    const tile = new BoxRenderable(renderer, {
      width: config.explorer.tile_width,
      height: config.explorer.tile_height,
      border: true,
      borderColor: config.theme.border,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
    });

    tile.add(
      new TextRenderable(renderer, {
        content: isDir ? "📁" : "📄",
        fg: config.theme.foreground,
        selectable: false,
      }),
    );

    tile.add(
      new TextRenderable(renderer, {
        content: Formatter.truncate(label, config.explorer.tile_width - 2),
        fg: config.theme.foreground,
        selectable: false,
      }),
    );

    return tile;
  }
}
