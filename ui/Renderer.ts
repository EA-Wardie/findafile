import { CliRenderer, createCliRenderer } from "@opentui/core";

export class Renderer {
  private static _renderer: CliRenderer;

  public static async make(): Promise<CliRenderer> {
    this._renderer = await createCliRenderer({
      exitOnCtrlC: true,
    });

    return this._renderer;
  }
}
