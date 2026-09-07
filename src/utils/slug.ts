import slugify from "slugify";

export const generateSlug = (text: string): string =>
  slugify(text, {
    lower: true,
    strict: true,
    locale: "pt",
  });
