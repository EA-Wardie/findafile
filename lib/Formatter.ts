export class Formatter {
  public static truncate(value: string, length: number) {
    return value.length > length ? `${value.slice(0, length - 1)}` : value;
  }
}
