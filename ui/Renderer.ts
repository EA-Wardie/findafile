import { CliRenderer, createCliRenderer, Renderable } from "@opentui/core";
import config from "../config.toml";

export class Renderer {
  private static _renderer: CliRenderer;

  public static async make(): Promise<CliRenderer> {
    this._renderer = await createCliRenderer({
      exitOnCtrlC: true,
    });

    return this._renderer;
  }
}
