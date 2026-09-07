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
    this.border = ["left"];
    // this.borderStyle = config.border_style;
    // this.borderColor = config.theme.border;
    this.borderColor = config.theme.border;
    // this.title = "Explorer";
    // this.titleColor = config.theme.foreground;
    this.flexDirection = "column";
    // this.flexGrow = 1;

    const header = new BoxRenderable(ctx, {
      height: 3,
      backgroundColor: config.theme.header,
      justifyContent: "center",
      alignItems: "center",
    });

    const headerText = new TextRenderable(ctx, {
      content: Store.currentPath,
    });

    header.add(headerText);
    this.add(header);

    Store.onCurrentPathChange((path: string) => {
      headerText.content = path;
    });
  }
}
