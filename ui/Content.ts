import { BoxRenderable, CliRenderer } from "@opentui/core";

export class Content {
  private static _content: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._content = new BoxRenderable(renderer, {
      flexGrow: 1,
      height: "100%",
      border: true,
      borderColor: "#414868",
      title: "Files",
      titleColor: "#7aa2f7",
      flexDirection: "column",
    });

    return this._content;
  }
}
