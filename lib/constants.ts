// A plain gray SVG data URI — always renders, never 404s. Used anywhere a
// product might not have an image yet (new product, failed upload, etc).
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23E8D9C3'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='20' fill='%236B4A34' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
