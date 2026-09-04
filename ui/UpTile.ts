import config from "../config.toml";
import { BoxRenderable, CliRenderer } from "@opentui/core";

export class UpTile {
  private static _tile: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._tile = new BoxRenderable(renderer, {
      width: config.explorer.tile_width,
      height: config.explorer.tile_height,
      border: true,
      borderColor: "#565f89",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    });

    return this._tile;
  }
}
