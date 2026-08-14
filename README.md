# Havenly — Real Estate & Property Listing Directory

Havenly is a lightweight, commercial-marketplace-style real estate template built with **pure HTML5, CSS3, and Vanilla JavaScript**. It is designed to be easy to customize, fast to deploy, and suitable as a starting point for a property directory, real estate agency, rental marketplace, or property showcase.

## Features

- Mobile-first responsive layout from 320px phones to large desktop monitors.
- Three complete pages:
  - `index.html` — homepage, hero search, featured listings, categories, CTA.
  - `listings.html` — filterable property directory with sorting.
  - `property-single.html` — property detail page, gallery, feature list, map placeholder, and contact modal.
- Semantic HTML5 structure using `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer`.
- CSS custom properties for easy branding.
- Vanilla JavaScript only; no framework or UI library.
- Responsive mobile navigation.
- Interactive save/favourite buttons.
- Property filtering by city, type, minimum price, maximum price, and bedrooms.
- Listing sorting by featured order, price, and property size.
- Interactive property image gallery with previous/next controls and thumbnails.
- Contact form modal with demo success state.
- Reduced-motion support for accessibility.

## Folder structure

```text
realestate-directory-template/
├── index.html
├── listings.html
├── property-single.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── images/
    └── README.md
```

The demo uses publicly available Unsplash-hosted stock photography so the template works immediately without bundling large image files. The `images/` folder is reserved for buyers who want to self-host their own optimized images.

## Quick start

1. Download or clone the project.
2. Open `index.html` in a browser to preview it locally.
3. No build step or package manager is required.
4. To deploy on GitHub Pages, push the project to a repository and enable **Settings → Pages → Deploy from a branch**, using the branch containing `index.html` as the source.

## Customizing the primary colors

Open `css/styles.css` and edit the variables near the top of the file:

```css
:root {
  --color-ink: #18201d;
  --color-paper: #f7f7f3;
  --color-white: #ffffff;
  --color-dark: #1d2924;
  --color-accent: #c5d86d;
  --color-accent-dark: #aabf4e;
  --color-line: #dde1dc;
}
```

The most important variables are:

- `--color-accent` — main brand/highlight color.
- `--color-accent-dark` — hover/active version of the accent.
- `--color-dark` — dark sections, navigation CTA, and major buttons.
- `--color-paper` — page background.
- `--color-white` — cards and form surfaces.
- `--color-line` — borders and separators.

Because the components reference these variables rather than hard-coded colors, changing the palette updates most of the site automatically.

## JavaScript guide

All JavaScript lives in `js/main.js`.

### `initMobileNavigation()`

Controls the hamburger button on small screens. It toggles the `.open` class on the navigation and updates `aria-expanded` for accessibility.

### `initSaveButtons()`

Adds a local favourite interaction to listing cards. It changes the heart icon and `aria-pressed` state. It is intentionally client-side only; connect it to localStorage or a backend to persist favourites.

### `initListingFilters()`

Reads filter controls and compares them against listing card attributes such as:

```html
data-city="Austin"
data-type="House"
data-price="485000"
data-rooms="3"
data-size="2140"
```

The function then hides non-matching cards and updates the visible result count. It also handles sorting.

### `initFilterDrawer()`

Turns the filter sidebar into a slide-out drawer on mobile devices.

### `initGallery()`

Reads the gallery thumbnails and cycles the main image when a thumbnail, previous button, or next button is selected. Arrow-key support is also included.

### `initContactModal()`

Opens and closes the agent contact modal, supports Escape-to-close, returns focus to the triggering button, and displays a demo success message when the form is submitted.

## Adding your own property data

The current listings are static HTML mock data. This is deliberate: it makes the template simple to understand and easy to integrate with a backend later.

### Option 1 — Replace the HTML cards

Duplicate a `.listing-card` and update its `data-*` attributes:

```html
<article
  class="property-card listing-card"
  data-city="Lagos"
  data-type="Apartment"
  data-price="85000000"
  data-rooms="3"
  data-size="1800"
>
  <!-- Your image, title, location, price and property details -->
</article>
```

The existing JavaScript filtering logic will automatically use the new values.

### Option 2 — Render cards from an API

For a real marketplace, keep the same HTML structure but generate the cards from JSON returned by your backend. The important fields are:

```text
city
property type
a price value used for filtering
bedroom count
size
image URL
status
property title
location
bathroom count
```

Your API response could look conceptually like:

```json
{
  "title": "Palm Residence",
  "city": "Austin",
  "type": "House",
  "price": 485000,
  "rooms": 3,
  "bathrooms": 2,
  "size": 2140,
  "image": "images/palm-residence.jpg"
}
```

Then use JavaScript to create the same `.property-card` markup dynamically.

### Currency and rental pricing

The demo mixes sale and rental examples to demonstrate different UI states. For a production marketplace, normalize your backend price representation and add a separate field such as `listingType: "sale" | "rent"`. Format the displayed currency in JavaScript according to the target market.

## Replacing the map placeholder

`property-single.html` intentionally contains a visual placeholder rather than locking the buyer into a map provider. Replace `.map-placeholder` with your chosen map provider's official embed or JavaScript integration.

## Replacing the demo contact form

The contact form currently prevents a real network submission and shows a local success message. For production, replace the submit handler in `initContactModal()` with a request to your backend, serverless function, form service, or CRM endpoint.

Do not put private API keys or server credentials inside frontend JavaScript.

## Image usage

The demo references Unsplash-hosted images so the project can be previewed immediately. For a marketplace product, buyers should generally download, resize, compress, and self-host their final image assets in the `images/` folder or through their preferred image CDN.

See `images/README.md` for the asset replacement notes.

## Accessibility notes

- Semantic page landmarks are used throughout.
- Interactive controls have accessible labels.
- The mobile menu exposes `aria-expanded`.
- The gallery exposes current-image state.
- The modal supports Escape-to-close and focus return.
- `prefers-reduced-motion` is respected.
- Images have descriptive alternative text where they convey content.

## License / marketplace note

This is a template starter project. Before selling or redistributing a customized version, review the licenses and usage terms of every third-party asset you choose to include. The demo photography is sourced from Unsplash-hosted URLs; replace those URLs with assets you are licensed to redistribute if you are packaging the template for a commercial marketplace.
