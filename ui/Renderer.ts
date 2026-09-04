import { CliRenderer, createCliRenderer, Renderable } from "@opentui/core";

export class Renderer {
  private static _renderer: CliRenderer;

  public static async make(): Promise<CliRenderer> {
    this._renderer = await createCliRenderer({
      exitOnCtrlC: true,
      backgroundColor: "#1a1b26",
    });

    return this._renderer;
  }

  public static addRootChild(child: Renderable) {
    this._renderer.root.add(child);
  }
}
