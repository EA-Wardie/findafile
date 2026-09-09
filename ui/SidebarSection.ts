import config from "../lib/Config";
import {
  BoxRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import type { ShortcutType } from "../types";
import { Shortcut } from "./Shortcut";

export interface Options extends BoxOptions {
  shortcuts: ShortcutType[];
}

export class SidebarSection extends BoxRenderable {
  constructor(
    ctx: RenderContext,
    options: Options = { shortcuts: [] },
  ) {
    super(ctx, options);

    this.width = "100%";
    this.flexDirection = "column";

    options.shortcuts.forEach((shortcut: ShortcutType) => {
      this.add(new Shortcut(ctx, { shortcut }));
    });
  }
}
