import {
  BoxRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";

export class Main extends BoxRenderable {
  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.id = "main";
    this.width = "100%";
    this.flexGrow = 1;
    this.flexDirection = "row";
  }
}
