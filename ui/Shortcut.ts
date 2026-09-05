import config from "../config.toml";
import {
  BoxRenderable,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import type { ShortcutType } from "../types";

export interface Options extends BoxOptions {
  shortcut: ShortcutType;
}

export class Shortcut extends BoxRenderable {
  constructor(ctx: RenderContext, options: Options) {
    super(ctx, options);

    this.id = options.shortcut.path;
    this.width = "100%";
    this.height = 1;
    this.paddingX = 1;

    this.add(
      new TextRenderable(ctx, {
        content: `${options.shortcut.icon} ${options.shortcut.label}`,
        fg: config.theme.foreground,
        selectable: false,
      }),
    );
  }
}
