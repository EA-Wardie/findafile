import { CliRenderer, ScrollBoxRenderable } from "@opentui/core";

export class Explorer {
  private static _explorer: ScrollBoxRenderable;

  public static make(renderer: CliRenderer): ScrollBoxRenderable {
    this._explorer = new ScrollBoxRenderable(renderer, {
      width: "100%",
      height: "100%",
      contentOptions: {
        flexDirection: "row",
        flexWrap: "wrap",
      },
    });

    return this._explorer;
  }
}
