import config from "../lib/Config";
import {
  BoxRenderable,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import { SidebarSection } from "./SidebarSection";

export class Sidebar extends BoxRenderable {
  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.minWidth = 24;
    this.height = "100%";
    this.flexDirection = "column";

    const header = new BoxRenderable(ctx, {
      border: ["top", "bottom"],
      borderStyle: config.border_style,
      borderColor: config.theme.border,
      justifyContent: "center",
      alignItems: "center",
    });

    header.add(
      new TextRenderable(ctx, {
        content: "🔰 Find-A-File",
      }),
    );

    this.add(header);

    this.add(
      new SidebarSection(ctx, {
        shortcuts: config.places || [],
      }),
    );

    this.add(new BoxRenderable(ctx, {
      border: ["top"],
      borderStyle: config.border_style,
      borderColor: config.theme.border,
    }));

    this.add(
      new SidebarSection(ctx, {
        shortcuts: config.bookmarks || [],
      }),
    );

    this.add(new BoxRenderable(ctx, {
      border: ["top"],
      borderStyle: config.border_style,
      borderColor: config.theme.border,
    }));

    this.add(
      new SidebarSection(ctx, {
        shortcuts: config.drives || [],
      }),
    );
  }
}
