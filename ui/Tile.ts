import { BoxRenderable, CliRenderer } from "@opentui/core";

const TILE_WIDTH: number = 12;
const TILE_HEIGHT: number = Math.floor(TILE_WIDTH * 0.56);

export class Tile {
  private static _tile: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._tile = new BoxRenderable(renderer, {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
      border: true,
      borderStyle: "single",
      borderColor: "#565f89",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    });

    return this._tile;
  }
}
