import { BoxRenderable, CliRenderer } from "@opentui/core";
import config from "../config.toml";

export class Tile {
  public static make(renderer: CliRenderer): BoxRenderable {
    return new BoxRenderable(renderer, {
      width: config.explorer.tile_width,
      height: config.explorer.tile_height,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    });
  }
}
