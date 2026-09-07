import config from "../config.toml";
import {
  BoxRenderable,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import { Store } from "../lib/Store";

export class Content extends BoxRenderable {
  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.height = "100%";
    this.backgroundColor = config.theme.content;
    // this.border = true;
    this.border = ["right", "left"];
    // this.borderStyle = config.border_style;
    // this.borderColor = config.theme.border;
    this.borderColor = config.theme.border;
    // this.title = "Explorer";
    // this.titleColor = config.theme.foreground;
    this.flexDirection = "column";
    // this.flexGrow = 1;
  }

  public makeHeader() {
    const header = new BoxRenderable(this.ctx, {
      height: 3,
      backgroundColor: config.theme.header,
      justifyContent: "center",
      alignItems: "center",
    });

    const headerText = new TextRenderable(this.ctx, {
      content: Store.currentPath,
    });

    header.add(headerText);

    Store.onCurrentPathChange((path: string) => {
      headerText.content = path;
    });

    this.add(header);
  }

  public makeFooter() {
    const footer = new BoxRenderable(this.ctx, {
      height: 3,
      backgroundColor: config.theme.header,
      justifyContent: "center",
      alignItems: "center",
    });

    const footerText = new TextRenderable(this.ctx, {
      content: "mouse all | ↑ ↓ ← → select | return down | esc close | q quit",
    });

    footer.add(footerText);

    this.add(footer);
  }
}
