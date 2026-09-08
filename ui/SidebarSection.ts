import config from "../config.toml";
import {
  BoxRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import type { ShortcutType } from "../types";
import { Shortcut } from "./Shortcut";

export interface Options extends BoxOptions {
  label: string;
  shortcuts: ShortcutType[];
}

export class SidebarSection extends BoxRenderable {
  constructor(
    ctx: RenderContext,
    options: Options = { label: "", shortcuts: [] },
  ) {
    super(ctx, options);

    this.width = "100%";
    this.flexDirection = "column";

    this.add(
      new BoxRenderable(ctx, {
        border: ["top"],
        borderStyle: config.border_style,
        borderColor: config.theme.border,
        title: options.label,
        titleColor: config.theme.foreground,
      }),
    );

    options.shortcuts.forEach((shortcut: ShortcutType) => {
      this.add(new Shortcut(ctx, { shortcut }));
    });
  }
}
