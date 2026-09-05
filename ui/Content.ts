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

// export class Content {
//   public static make(renderer: CliRenderer): BoxRenderable {
//     return new BoxRenderable(renderer, {
//       flexGrow: 1,
//       height: "100%",
//       border: true,
//       borderStyle: config.border_style,
//       borderColor: config.theme.border,
//       title: "Explorer",
//       titleColor: config.theme.foreground,
//       flexDirection: "column",
//     });
//   }
// }
