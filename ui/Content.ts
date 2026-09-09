import config from "../lib/Config";
import { homedir } from "node:os";
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
    this.border = ["right", "left"];
    this.borderColor = config.theme.border;
    this.flexDirection = "column";
  }

  public makeHeader() {
    const header = new BoxRenderable(this.ctx, {
      border: ["top", "bottom"],
      borderStyle: config.border_style,
      borderColor: config.theme.border,
      paddingX: 1,
      justifyContent: "center",
    });

    const headerText = new TextRenderable(this.ctx, {
      content: `${this.getCurrentPathIcon(Store.currentPath)}${Store.currentPath}`,
    });

    header.add(headerText);

    Store.onCurrentPathChange((path: string) => {
      headerText.content = `${this.getCurrentPathIcon(Store.currentPath)}${path}`;
    });

    this.add(header);
  }

  public makeFooter() {
    const footer = new BoxRenderable(this.ctx, {
      border: ["top", "bottom"],
      borderStyle: config.border_style,
      borderColor: config.theme.border,
      justifyContent: "center",
      alignItems: "center",
    });

    const footerText = new TextRenderable(this.ctx, {
      content: "mouse all | ↑ ↓ ← → select | return down | esc close | q quit",
      fg: config.theme.selected_background,
    });

    footer.add(footerText);

    this.add(footer);
  }

  private getCurrentPathIcon(path: string) {
    let icon = "💾";

    if (Store.currentPath.startsWith(homedir())) {
      icon = "🏠";
    }

    return icon;
  }
}
