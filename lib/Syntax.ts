import { RGBA, SyntaxStyle } from "@opentui/core";

export class Syntax {
  static getStyles() {
    return SyntaxStyle.fromStyles({
      // Basic tokens
      keyword: { fg: RGBA.fromHex("#FF7B72"), bold: true },
      "keyword.import": { fg: RGBA.fromHex("#FF7B72"), bold: true },
      "keyword.operator": { fg: RGBA.fromHex("#FF7B72") },

      string: { fg: RGBA.fromHex("#A5D6FF") },
      comment: { fg: RGBA.fromHex("#8B949E"), italic: true },
      number: { fg: RGBA.fromHex("#79C0FF") },
      boolean: { fg: RGBA.fromHex("#79C0FF") },
      constant: { fg: RGBA.fromHex("#79C0FF") },

      // Functions and types
      function: { fg: RGBA.fromHex("#D2A8FF") },
      "function.call": { fg: RGBA.fromHex("#D2A8FF") },
      "function.method.call": { fg: RGBA.fromHex("#D2A8FF") },
      type: { fg: RGBA.fromHex("#FFA657") },
      constructor: { fg: RGBA.fromHex("#FFA657") },

      // Variables and properties
      variable: { fg: RGBA.fromHex("#E6EDF3") },
      "variable.member": { fg: RGBA.fromHex("#79C0FF") },
      property: { fg: RGBA.fromHex("#79C0FF") },

      // Operators and punctuation
      operator: { fg: RGBA.fromHex("#FF7B72") },
      punctuation: { fg: RGBA.fromHex("#F0F6FC") },
      "punctuation.bracket": { fg: RGBA.fromHex("#F0F6FC") },
      "punctuation.delimiter": { fg: RGBA.fromHex("#C9D1D9") },

      // Default fallback
      default: { fg: RGBA.fromHex("#E6EDF3") },
    });
  }
}
