import config from "../config.toml";
import {
  BoxRenderable,
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

    this.add(
      new SidebarSection(ctx, {
        title: "Places",
        shortcuts: config.places || [],
      }),
    );

    this.add(
      new SidebarSection(ctx, {
        title: "Bookmarks",
        shortcuts: config.bookmarks || [],
      }),
    );

    this.add(
      new SidebarSection(ctx, {
        title: "Drives",
        shortcuts: config.drives || [],
      }),
    );
  }
}
