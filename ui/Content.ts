import config from "../config.toml";
import {
  BoxRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";

export class Content extends BoxRenderable {
  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.flexGrow = 1;
    this.height = "100%";
    this.border = true;
    this.borderStyle = config.border_style;
    this.borderColor = config.theme.border;
    this.title = "Explorer";
    this.titleColor = config.theme.foreground;
    this.flexDirection = "column";
  }
}
