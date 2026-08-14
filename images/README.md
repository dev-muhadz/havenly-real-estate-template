# Images folder

The template currently references public Unsplash-hosted stock photos directly from the HTML so the demo works without shipping large binary files.

For a production or marketplace package, replace those remote URLs with optimized local files in this folder, for example:

```text
images/
├── palm-residence-01.webp
├── palm-residence-02.webp
├── cedar-house.webp
├── the-loft.webp
└── ocean-villa.webp
```

Then update the `src` and `data-src` values in the HTML.

Recommended production formats:
- WebP or AVIF for photographs.
- SVG for simple logos/icons.
- Multiple image sizes when serving a very large catalogue.

Always verify the license/redistribution rights of any stock photography used in the final marketplace package.
