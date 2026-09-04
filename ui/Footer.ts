import { BoxRenderable, CliRenderer } from "@opentui/core";

export class Footer {
  private static _footer: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._footer = new BoxRenderable(renderer, {
      width: "100%",
      height: 3,
      border: true,
      borderStyle: "single",
      borderColor: "#414868",
      paddingLeft: 1,
      alignItems: "center",
    });

    return this._footer;
  }
}
