import slugify from "slugify";

export class Slugify {
  public static create(title: string): string {
    return slugify(title, { lower: true, strict: true });
  }
}
