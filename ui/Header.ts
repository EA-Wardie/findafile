import { BoxRenderable, CliRenderer, Renderable } from "@opentui/core";

export class Header {
  private static _header: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._header = new BoxRenderable(renderer, {
      width: "100%",
      height: 3,
      border: true,
      borderStyle: "single",
      borderColor: "#414868",
      titleColor: "#7aa2f7",
      paddingLeft: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 1,
    });

    return this._header;
  }

  public static addChild(child: Renderable) {
    this._header.add(child);
  }
}
