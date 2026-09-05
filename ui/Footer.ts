import config from "../config.toml";
import {
  BoxRenderable,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";

export class Footer extends BoxRenderable {
  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.width = "100%";
    this.height = 3;
    this.border = true;
    this.borderStyle = config.border_style;
    this.borderColor = config.theme.border;
    this.alignItems = "center";
    this.paddingLeft = 1;

    this.add(
      new TextRenderable(ctx, {
        selectable: false,
        content: "mouse all | ↑ ↓ ← → select | return down | esc up | q quit",
        fg: config.theme.border_muted,
      }),
    );
  }
}

// export class Footer {
//   private static _footer: BoxRenderable;

//   public static make(renderer: CliRenderer): BoxRenderable {
//     this._footer = new BoxRenderable(renderer, {
//       width: "100%",
//       height: 3,
//       border: true,
//       borderStyle: config.border_style,
//       borderColor: config.theme.border,
//       alignItems: "center",
//       paddingLeft: 1,
//     });

//     this.makeText(renderer);

//     return this._footer;
//   }

//   private static makeText(renderer: CliRenderer): void {
//     this._footer.add(
//       new TextRenderable(renderer, {
//         selectable: false,
//         content: "mouse all | ↑ ↓ ← → select | return down | esc up | q quit",
//         fg: config.theme.border_muted,
//       }),
//     );
//   }
// }
