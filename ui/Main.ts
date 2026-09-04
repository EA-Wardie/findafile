import { BoxRenderable, CliRenderer, Renderable } from "@opentui/core";

export class Main {
  private static _main: BoxRenderable;

  public static make(renderer: CliRenderer): BoxRenderable {
    this._main = new BoxRenderable(renderer, {
      width: "100%",
      flexGrow: 1,
      flexDirection: "row",
      gap: 1,
    });

    return this._main;
  }

  public static addChild(child: Renderable): void {
    this._main.add(child);
  }
}
