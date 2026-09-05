import { BoxRenderable, CliRenderer } from "@opentui/core";
import config from "../config.toml";

export class Tile {
  private static _tile: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._tile = new BoxRenderable(renderer, {
      width: config.explorer.tile_width,
      height: config.explorer.tile_height,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    });

    return this._tile;
  }
}
