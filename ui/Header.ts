import config from "../config.toml";
import {
  BoxRenderable,
  TextAttributes,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import { Store } from "../lib/Store";

export interface Options extends BoxOptions {
  text: string;
}

export class Header extends BoxRenderable {
  private leftText: TextRenderable;
  private rightText: TextRenderable;

  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.width = "100%";
    this.height = 3;
    this.border = true;
    this.borderStyle = config.border_style;
    this.borderColor = config.theme.border;
    this.titleColor = config.theme.foreground;
    this.paddingLeft = 1;
    this.flexDirection = "row";
    this.alignItems = "center";
    this.justifyContent = "space-between";
    this.gap = 1;

    this.leftText = new TextRenderable(ctx, {
      fg: config.theme.foreground,
      content: Store.currentPath,
      attributes: TextAttributes.BOLD,
      selectable: false,
    });

    this.rightText = new TextRenderable(ctx, {
      fg: "#D10000",
      content: undefined,
      attributes: TextAttributes.BOLD,
      selectable: false,
    });

    this.add(this.leftText);
    this.add(this.rightText);

    Store.onCurrentPathChange((path: string) => {
      this.leftText.content = path;
    });

    Store.onErrorChange((error: string) => {
      this.rightText.content = error;

      setTimeout(() => {
        this.rightText.content = "";
      }, 5000);
    });
  }
}
