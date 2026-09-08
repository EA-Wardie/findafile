import config from "../config.toml";
import {
  BoxRenderable,
  CliRenderer,
  InputRenderable,
  InputRenderableEvents,
  TextAttributes,
  TextRenderable,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import type { PromptDialogOptionsType } from "../types.ts";
import { Store } from "../lib/Store.ts";

export class PromptDialog extends BoxRenderable {
  private overlay: BoxRenderable;
  private headerText: TextRenderable;
  private labelText: TextRenderable;
  private input: InputRenderable;
  private cancelButton: BoxRenderable;
  private cancelLabel: TextRenderable;
  private confirmButton: BoxRenderable;
  private confirmLabel: TextRenderable;
  private open: boolean = false;
  private onConfirm?: (value: string) => void;

  constructor(ctx: RenderContext, options: BoxOptions = {}) {
    super(ctx, options);

    this.id = "prompt";
    this.minWidth = 44;
    this.backgroundColor = config.theme.sidebar;
    this.flexDirection = "column";
    this.paddingY = 1;
    this.paddingX = 2;
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
      marginBottom: 1,
      selectable: false,
    });

    this.labelText = new TextRenderable(ctx, {
      content: "",
      fg: config.theme.foreground,
      selectable: false,
    });

    this.input = new InputRenderable(ctx, {
      flexGrow: 1,
      backgroundColor: config.theme.content,
      focusedBackgroundColor: config.theme.content,
      textColor: config.theme.foreground,
    });

    this.input.on(InputRenderableEvents.ENTER, (): void => {
      this.submit();
    });

    const actions = new BoxRenderable(ctx, {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 1,
      gap: 1,
    });

    this.cancelLabel = new TextRenderable(ctx, {
      content: "Cancel",
      fg: config.theme.foreground,
      selectable: false,
    });

    this.cancelButton = new BoxRenderable(ctx, {
      height: 1,
      backgroundColor: config.theme.content,
      alignItems: "center",
      paddingX: 1,
      onMouseOver: (): void => {
        this.cancelButton.backgroundColor = config.theme.selected_background;
      },
      onMouseOut: (): void => {
        this.cancelButton.backgroundColor = config.theme.content;
      },
    });

    this.confirmLabel = new TextRenderable(ctx, {
      content: "Confirm",
      fg: config.theme.foreground,
      selectable: false,
    });

    this.confirmButton = new BoxRenderable(ctx, {
      height: 1,
      backgroundColor: config.theme.content,
      alignItems: "center",
      paddingX: 1,
      onMouseOver: (): void => {
        this.confirmButton.backgroundColor = config.theme.selected_background;
      },
      onMouseOut: (): void => {
        this.confirmButton.backgroundColor = config.theme.content;
      },
    });

    this.cancelButton.add(this.cancelLabel);
    this.confirmButton.add(this.confirmLabel);

    actions.add(this.cancelButton);
    actions.add(this.confirmButton);

    this.add(this.headerText);
    this.add(this.labelText);
    this.add(this.input);
    this.add(actions);

    this.overlay.add(this);
  }

  public show(options: PromptDialogOptionsType): void {
    if (this.open) {
      this.hide();
    }

    this.headerText.content = options.title;
    this.labelText.content = options.label ?? "Name";
    this.input.value = "";
    this.cancelLabel.content = options.cancelLabel ?? "Cancel";
    this.confirmLabel.content = options.confirmLabel ?? "Confirm";
    this.onConfirm = options.onConfirm;

    this.cancelButton.onMouseDown = (): void => {
      this.hide();
      options.onCancel?.();
    };

    this.confirmButton.onMouseDown = (): void => {
      this.submit();
    };

    this.open = true;

    (this.ctx as CliRenderer).root.add(this.overlay);
    this.input.focus();
  }

  public hide(): void {
    if (!this.open) {
      return;
    }

    this.open = false;

    this.input.blur();
    (this.ctx as CliRenderer).root.remove(this.overlay);
    Store.clearCurrentPromptDialog();
  }

  private submit(): void {
    const value: string = this.input.value.trim();

    if (!value) {
      return;
    }

    const onConfirm = this.onConfirm;

    this.hide();
    onConfirm?.(value);
  }
}
