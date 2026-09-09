import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import defaults from "../config.toml";
import type { ConfigType } from "../types";

const USER_CONFIG_PATH: string = join(
  homedir(),
  ".config",
  "findafile",
  "config.toml",
);

function loadUserConfig(): Partial<ConfigType> | null {
  if (!existsSync(USER_CONFIG_PATH)) {
    return null;
  }

  try {
    return Bun.TOML.parse(
      readFileSync(USER_CONFIG_PATH, "utf-8"),
    ) as Partial<ConfigType>;
  } catch (error) {
    console.error(
      `Failed to parse ${USER_CONFIG_PATH}: ${(error as Error).message}`,
    );

    return null;
  }
}

function mergeConfig(
  base: ConfigType,
  override: Partial<ConfigType> | null,
): ConfigType {
  if (!override) {
    return base;
  }

  return {
    ...base,
    ...override,
    explorer: { ...base.explorer, ...override.explorer },
    theme: { ...base.theme, ...override.theme },
    places: override.places ?? base.places,
    bookmarks: override.bookmarks ?? base.bookmarks,
    drives: override.drives ?? base.drives,
  };
}

const config: ConfigType = mergeConfig(
  defaults as ConfigType,
  loadUserConfig(),
);

export default config;
