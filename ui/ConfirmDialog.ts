import config from "../config.toml";
import {
  BoxRenderable,
  CliRenderer,
  TextAttributes,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import type { ConfirmDialogOptionsType } from "../types.ts";
import { Store } from "../lib/Store.ts";

export class ConfirmDialog extends BoxRenderable {
  private overlay: BoxRenderable;
  private headerText: TextRenderable;
  private descriptionText: TextRenderable;
  private cancelButton: BoxRenderable;
  private cancelLabel: TextRenderable;
  private confirmButton: BoxRenderable;
  private confirmLabel: TextRenderable;
  private open: boolean = false;

  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.id = "confirm";
    this.minWidth = 42;
    this.border = true;
    this.borderStyle = config.border_style;
    this.borderColor = config.theme.border;
    this.backgroundColor = config.theme.background;
    this.flexDirection = "column";
    this.paddingX = 1;
    this.gap = 1;
    this.zIndex = 101;

    this.overlay = new BoxRenderable(ctx, {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    });

    this.headerText = new TextRenderable(ctx, {
      content: "",
      fg: config.theme.foreground,
      attributes: TextAttributes.BOLD,
      selectable: false,
    });

    this.descriptionText = new TextRenderable(ctx, {
      content: "",
      fg: config.theme.foreground,
      selectable: false,
    });

    const actions = new BoxRenderable(ctx, {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 2,
    });

    this.cancelLabel = new TextRenderable(ctx, {
      content: "Cancel",
      fg: config.theme.foreground,
      selectable: false,
    });

    this.cancelButton = new BoxRenderable(ctx, {
      border: true,
      borderStyle: config.border_style,
      borderColor: config.theme.border,
      paddingX: 2,
      onMouseOver: (): void => {
        this.cancelButton.backgroundColor = config.theme.selected_background;
      },
      onMouseOut: (): void => {
        this.cancelButton.backgroundColor = undefined;
      },
    });

    this.confirmLabel = new TextRenderable(ctx, {
      content: "Confirm",
      fg: config.theme.foreground,
      selectable: false,
    });

    this.confirmButton = new BoxRenderable(ctx, {
      border: true,
      borderStyle: config.border_style,
      borderColor: config.theme.border,
      paddingX: 2,
      onMouseOver: (): void => {
        this.confirmButton.backgroundColor = config.theme.selected_background;
      },
      onMouseOut: (): void => {
        this.confirmButton.backgroundColor = undefined;
      },
    });

    this.cancelButton.add(this.cancelLabel);
    this.confirmButton.add(this.confirmLabel);

    actions.add(this.cancelButton);
    actions.add(this.confirmButton);

    this.add(this.headerText);
    this.add(this.descriptionText);
    this.add(actions);

    this.overlay.add(this);
  }

  public show(options: ConfirmDialogOptionsType): void {
    if (this.open) {
      this.hide();
    }

    this.headerText.content = options.title;
    this.descriptionText.content = options.description;
    this.cancelLabel.content = options.cancelLabel ?? "Cancel";
    this.confirmLabel.content = options.confirmLabel ?? "Confirm";

    this.cancelButton.onMouseDown = (): void => {
      this.hide();
      options.onCancel?.();
    };

    this.confirmButton.onMouseDown = (): void => {
      this.hide();
      options.onConfirm();
    };

    this.open = true;

    (this.ctx as CliRenderer).root.add(this.overlay);
  }

  public hide(): void {
    if (!this.open) {
      return;
    }

    this.open = false;

    (this.ctx as CliRenderer).root.remove(this.overlay);
    Store.clearCurrentConfirmDialog();
  }
}
